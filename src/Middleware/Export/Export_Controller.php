<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export;

use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Recipes_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Export_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Job_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Recipes_Middleware;

use Exception;
final class Export_Controller{
	private Api_Middleware $Api_Middleware;
	private Recipes_Service $Recipes_Service;
	private Export_Service $Export_Service;
	private Job_Service $Job_Service;
	private Recipes_Middleware $Recipes_Middleware;

	public function __construct(
		Api_Middleware $Api_Middleware,
		Recipes_Service $Recipes_Service,
		Export_Service $Export_Service,
		Job_Service $Job_Service,
		Recipes_Middleware $Recipes_Middleware
	){
		$this->Api_Middleware = $Api_Middleware;
		$this->Recipes_Service = $Recipes_Service;
		$this->Export_Service = $Export_Service;
		$this->Job_Service = $Job_Service;
		$this->Recipes_Middleware = $Recipes_Middleware;

		$this->register_routes();
	}

	public function register_routes(){
		// /export/recipe/{id}
		$this->Api_Middleware->add([
			'route' => '/export/recipes/(?P<uuid>\d+)',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_recipe'], 'permission_callback' => '__return_true']
		]);

		$this->Api_Middleware->add([
			'route' => '/export/recipes/(?P<uuid>\d+)/restart',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_recipe_restart'], 'permission_callback' => '__return_true']
		]);


		// deprecated?
		$this->Api_Middleware->add([
			'route' => '/export/recipes/(?P<uuid>\d+)/status',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_status'], 'permission_callback' => '__return_true']
		]);

		$this->Api_Middleware->add([
			'route' => '/export/heartbeat',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'heartbeat_rest'], 'permission_callback' => '__return_true']
		]);

		$this->Api_Middleware->add([
			'route' => '/export/recipes/',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_recipes_list'], 'permission_callback' => '__return_true']
		]);

		$this->Api_Middleware->add([
			'route' => '/export/recipes/(?P<uuid>\d+)/status/details',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_status_details'], 'permission_callback' => '__return_true']
		]);

		// testing routes
		/*$this->Api_Middleware->add([
			'route' => '/export/test/jobs', // id from table jobs
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'test_get_jobs'], 'permission_callback' => '__return_true']
		]);

		$this->Api_Middleware->add([
			'route' => '/export/test/run_job/(?P<id>\d+)', // id from table jobs
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'test_run_job'], 'permission_callback' => '__return_true']
		]);*/

		// wordpress specific
		// create the cron job
		if (!\wp_next_scheduled('sv_grillfuerst_user_recipes_export_heartbeat')) {
			\wp_schedule_event(time(), 'every_minute', 'sv_grillfuerst_user_recipes_export_heartbeat');
		}

		\add_action('sv_grillfuerst_user_recipes_export_heartbeat', [$this, 'heartbeat'], 10, 1);

	}

	// /////////////////////////////
	// REST FUNCTIONS
	// /////////////////////////////
	public function export_recipe($request){
		return $this->Api_Middleware->response(
			$request,
			function ($Request) {
				$message = '';
				$errors = [];
				// get recipe
				$uuid  = $Request->getAttribute('uuid');
				$item = $this->Recipes_Service->get($uuid);

				if($item){
					// export_error allows re-export through review / edit screen
					if(in_array($item['state'], ['export_running', 'export_pending']) !== false){
						$message = 'Export already running.';
					}

					if($item['state'] === 'published'){
						$message = 'Recipe already published: '. $item['link'];
					}

					if(empty($message)){
						$message = 'Export queued!';
						$this->Export_Service->export($item);
						$this->Recipes_Service->update($uuid, ['state'=>'export_pending', 'export_date'=>date('Y-m-d H:i:s')]);
					}

				}else{
					$message = 'Item not found!';
				}

				return [['message'=>$message, 'errors' => $errors], 200];
			},['admin', 'export']
		);

	}

	public function export_recipe_restart($request){
		return $this->Api_Middleware->response(
			$request,
			function ($Request) use($request){
				$message = '';
				$errors = [];
				// get recipe
				$uuid  = $Request->getAttribute('uuid');
				$item = $this->Recipes_Service->get($uuid);

				if($item){
					// flush current jobs for this recipe
					$this->Job_Service->delete_by_item_id($uuid);
					// flush export column on recipe
					$this->Recipes_Service->update($uuid,['state'=>'export_pending', 'export_date'=>date('Y-m-d H:i:s'), 'link'=>'']);

					// run export again
					$message = 'Export queued!';
					$this->Export_Service->export($item);
				}else{
					$message = 'Item not found!';
				}

				return [['message'=>$message, 'errors' => $errors], 200];
			},['admin', 'export']
		);

	}

	public function heartbeat_rest($request){
		return $this->Api_Middleware->response($request,
			function ($Request) {
				$message = '';
				$errors = [];

				// blocking
				$this->Job_Service->run_next();

				return [['message'=>'', 'errors' => $errors], 200];
			},['admin', 'export']
		);
	}

	public function heartbeat(){
		// blocking
		$this->Job_Service->run_next();
	}

	public function export_status($request){
		return $this->Api_Middleware->response($request,
			function ($Request) {
				$message = '';
				$errors = [];
				// get recipe
				$uuid  = $Request->getAttribute('uuid');
				$jobs = $this->Job_Service->get_by_item_id($uuid);

				// trigger job run manually
				foreach($jobs as $key => $job){
					if($job['status'] === 'pending'){
						$this->Job_Service->run_job($job['id']);
						break;
					}
				}

				$recipe = $this->Recipes_Service->get($uuid);
				return [['message'=>'', 'errors' => $errors, 'export_link'=>empty($recipe['link']) ? null : $recipe['link'], 'export_status'=>$recipe['state'], 'data' => $jobs], 200];
			},['admin', 'export']
		);
	}

	public function export_status_details($request){
		return $this->Api_Middleware->response($request,
			function ($Request) {
				$message = '';
				$errors = [];
				// get recipe
				$uuid  = $Request->getAttribute('uuid');
				$jobs = $this->Job_Service->get_by_item_id($uuid);
				$recipe = $this->Recipes_Service->get($uuid);

				$recipe_data = [
					'uuid' => $recipe['uuid'],
					'state' => $recipe['state'],
					'title' => $recipe['title'],
					'link' => $recipe['link'],
					'export_date' => $recipe['export_date'],
				];

				return [[
					'message'=>'',
					'recipe'=> $recipe_data,
					'errors' => $errors,
					'jobs' => $jobs
				], 200];
			},['admin', 'export']
		);
	}

	public function export_recipes_list($request) {
		return $this->Api_Middleware->response_public(
			$request,
			function ($Request) {
				$messages = [];

				// Get pagination and filters
				$page = $Request->getPage();
				$limit = $Request->getLimit();
				$offset = ($page - 1) * $limit;
				// Build conditions dynamically
				$export_state = $Request->getQuery('state', null);
				$text_query = $Request->getQuery('query', null);

				$conditions = [
					'OR' => [
						'state in' => $export_state && $export_state !== 'all' ? [$export_state] : ['published', 'export_pending', 'export_running', 'export_error'],
					],
				];

				if ($text_query) {
					$conditions['AND'] = ['OR'=> ['title LIKE' => '%'.$text_query.'%', 'uuid'=>$text_query]];
				}

				// Define the parameters
				$params = [
					'columns' => ['uuid', 'title', 'state', 'link', 'export_date', 'voucher'],
					'conditions' => $conditions,
					'order' => ['export_date' => 'DESC'],
					'limit' => $limit,
					'offset' => $offset,
				];

				// Fetch items
				$items = $this->Recipes_Service->get_list($params);

				// Fetch total count for pagination
				$totalRows = $this->Recipes_Service->get_count($params);
				$totalPages = (int) ceil($totalRows / $limit);

				return [
					[
						'messages' => $messages,
						'items' => $items,
						'pagination' => [
							'page' => $page,
							'totalRows' => $totalRows,
							'totalPages' => $totalPages,
						],
					],
					200,
				];
			},
			['admin', 'export']
		);
	}


	// /////////////////////////////
	// REST FUNCTIONS
	// /////////////////////////////

	// /////////////////////////////
	// CRON JOB FUNCTIONS
	// /////////////////////////////

	public function run_job_export_recipe_data(array $job): bool{
		try{
			if($job['type'] !== 'recipe') throw new Exception(__FUNCTION__ .' wrong job type '.$job['type'].' in job id '.$job['id'], 500);

			$recipe_id = $job['item_id'];
			$this->Recipes_Service->update($recipe_id,['state'=>'export_running']);
			// export to post
			$post = $this->Export_Service->export_recipe_data($recipe_id);
			// add post_id to job for exporting media files / linking them later
			$job['data']['post_id'] = $post->ID;
			$this->Job_Service->update($job['id'], ['data'=>$job['data']]);
			return true;
		}catch(Exception $e){
			if( $e->getCode() > 300 ) $this->Recipes_Service->update($job['item_id'], ['state'=>'export_error']);
			throw new Exception($e->getMessage(), $e->getCode()); // push errors back to job service caller
		}

		return false;
	}

	public function run_job_export_recipe_media(array $job) {
		try{
			$success = false;
			$post_id = 0;
			$data_job_status = '';
			$merge_job = null;

			if($job['type'] !== 'media') throw new Exception(__FUNCTION__ .' wrong job type '.$job['type'].' in job id '.$job['id'], 500);

			// check first if uuid is available on post_meta table
			// yes - get post_id for linking the media file
			$job_family = $this->Job_Service->get_by_item_id($job['item_id']);

			if(empty($job_family)) throw new Exception(__FUNCTION__ . ' no job family members found - impossible to get post_id - job id: '. $job['id'], 500);

			foreach($job_family as $key => $item){
				if($item['type'] === 'recipe'){
					$data = $item['data'];
					$data_job_status = $item['status'];
					if($data_job_status === 'done' && isset($data['post_id']) && !empty($data['post_id'])){
						$post_id = (int)$data['post_id'];
					}
				}

				if($item['type'] === 'recipe_media_merge'){
					$merge_job = $item;
				}
			}

			if(empty($post_id)) throw new Exception(__FUNCTION__ . ' no post_id available (yet). - job id: '. $job['id'], 102);
			if(empty($post_id) && $data_job_status === 'done') throw new Exception(__FUNCTION__ . ' data job is done, but there is no post_id. - job id: '. $job['id'], 500);
			if(!empty($post_id) && $data_job_status === 'error') throw new Exception(__FUNCTION__ . ' post_id found - but data job halted with error. - job id: '. $job['id'], 500);

			$media_id = $this->Export_Service->export_media($post_id, $job['data']);

			if(!$media_id){
				throw new Exception(__FUNCTION__ . ' media export failed - job id: '. $job['id'], 500);
			}

			// add job is missing
			if(empty($merge_job)){
				$merge_job = $this->Job_Service->create([
					'type' => 'recipe_media_merge',
					'status' => 'wait',
					'item_id' => $job['item_id'],
					'callback'=>'SV_Grillfuerst_User_Recipes\Middleware\Export\Export_Controller::run_job_export_recipe_media_to_data',
					'priority' => 0,
					'data' => [
						'post_id' => 0,
						'images' => [],
					]
				]);
			}

			$merge_job['data']['post_id'] = $post_id;
			$merge_job['data']['images'] = $merge_job['data']['images'] ?? [];
			$merge_job['data']['images'][] = array_merge($job['data'], ['_media_id'=>$media_id]);

			$this->Job_Service->update($merge_job['id'], ['data'=>$merge_job['data']]);

			return true;
		}catch(Exception $e){
			if( $e->getCode() > 300 ) $this->Recipes_Service->update($job['item_id'], ['state'=>'export_error']);
			throw new Exception($e->getMessage(), $e->getCode()); // push errors back to job service caller
		}

	}

	public function run_job_export_recipe_media_to_data(array $job){
		try{
			$job_family = $this->Job_Service->get_by_item_id($job['item_id']);

			if(empty($job_family)) throw new Exception(__FUNCTION__ . ' no job family members found - impossible to get post_id - job id: '. $job['id'], 404);

			// check if all prev jobs are done
			$check = true;
			foreach($job_family as $key => $item){
				if($item['type'] === 'recipe_media_merge') continue;
				if($item['status'] !== 'done'){
					$check = false; // not all prev jobs are done
				}
			}

			$data = $job['data'];

			// soft error
			if(!$check) throw new Exception(__FUNCTION__ . ' prev jobs not done for merge job: '. $job['id'], 102);
			// fatal errors - indicating that something went wrong with the prev jobs
			if(empty($job['data'])) throw new Exception(__FUNCTION__ . ' merge job is missing data (indicates missing media files): '. $job['id'], 500);
			if(empty($job['data']['post_id'])) throw new Exception(__FUNCTION__ . ' merge job is missing post id (indicates error while creating recipe post): '. $job['id'], 500);
			if(empty($job['data']['images'])) throw new Exception(__FUNCTION__ . ' merge job has data but no media files: '. $job['id'], 500);

			$this->Export_Service->add_media_to_post($data['post_id'], $data['images']); // this also publishes the post

			// clean up
			$this->Job_Service->delete_by_item_id($job['item_id']);
			$this->Recipes_Service->update($job['item_id'], ['state'=>'published']);
			// old function with error returns - workaround // we should use events instead of logs
			$this->Recipes_Middleware->handle_after_recipe_published($job['item_id']);
		}catch(Exception $e){
			if( $e->getCode() > 300 ) $this->Recipes_Service->update($job['item_id'], ['state'=>'export_error']);
			throw new Exception($e->getMessage(), $e->getCode()); // push errors back to job service caller
		}

	}

	// /////////////////////////////
	// CRON JOB FUNCTIONS
	// /////////////////////////////

	// /////////////////////////////
	// TEST FUNCTIONS
	// /////////////////////////////
	public function test_get_jobs($request){
		return $this->Api_Middleware->response(
			$request,
			function ($Request) {
				return [['message'=>'', 'errors' => [], 'data' => $this->Job_Service->get()], 200];

			}
		);
	}
	public function test_run_job($request){
		return $this->Api_Middleware->response(
			$request,
			function ($Request) {
				// get recipe
				$id  = $Request->getAttribute('id');

				try{
					$job = $this->Job_Service->get($id);
					$this->Job_Service->update($id, ['status'=>'pending']);

					\do_action('sv_grillfuerst_user_recipes_run_job', $id);
					$message = 'ok';
				}catch(Exception $e){
					$message = $e->getMessage();
				}

				return [['message'=>$message], 200];
			}
		);
	}

}