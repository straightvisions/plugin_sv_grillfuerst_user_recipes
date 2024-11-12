<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export;

use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Recipes_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Export_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Job_Service;

use Exception;
final class Export_Controller{
	private Api_Middleware $Api_Middleware;
	private Recipes_Service $Recipes_Service;
	private Export_Service $Export_Service;
	private Job_Service $Job_Service;

	public function __construct(
		Api_Middleware $Api_Middleware,
		Recipes_Service $Recipes_Service,
		Export_Service $Export_Service,
		Job_Service $Job_Service
	){
		$this->Api_Middleware = $Api_Middleware;
		$this->Recipes_Service = $Recipes_Service;
		$this->Export_Service = $Export_Service;
		$this->Job_Service = $Job_Service;

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


		$this->Api_Middleware->add([
			'route' => '/export/recipes/(?P<uuid>\d+)/status',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_status'], 'permission_callback' => '__return_true']
		]);

		// testing routes
		$this->Api_Middleware->add([
			'route' => '/export/test/jobs', // id from table jobs
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'test_get_jobs'], 'permission_callback' => '__return_true']
		]);

		$this->Api_Middleware->add([
			'route' => '/export/test/run_job/(?P<id>\d+)', // id from table jobs
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'test_run_job'], 'permission_callback' => '__return_true']
		]);

	}

	// /////////////////////////////
	// REST FUNCTIONS
	// /////////////////////////////
	public function export_recipe($request){
		return $this->Api_Middleware->response_public(
			$request,
			function ($Request) {
				$message = '';
				$errors = [];
				// get recipe
				$uuid  = $Request->getAttribute('uuid');
				$item = $this->Recipes_Service->get($uuid);

				if($item){
					if(empty($item['export'])){
						$message = 'Export started.';
						$this->Export_Service->export($item);
						$this->Recipes_Service->update($uuid, ['export'=>'running']);
					}

					if($item['export'] === 'running'){
						$message = 'Export already running.';
					}

					if($item['export'] === 'done'){
						$message = 'Export already done: '. $item['link'];
					}
				}else{
					$message = 'Item not found!';
				}

				return [['message'=>$message, 'errors' => $errors], 200];
			}//,			['admin', 'export']
		);

	}

	public function export_recipe_restart($request){
		return $this->Api_Middleware->response_public(
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
					$this->Recipes_Service->update($uuid,['state'=>'review_pending', 'export'=>null, 'link'=>'']);

					// run export again
					$message = 'Export started.';
					$this->Export_Service->export($item);
				}else{
					$message = 'Item not found!';
				}

				return [['message'=>$message, 'errors' => $errors], 200];
			}//,			['admin', 'export']
		);

	}

	public function export_status($request){
		return $this->Api_Middleware->response_public($request,
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
					}
				}

				$recipe = $this->Recipes_Service->get($uuid);
				$export_status = $recipe &&  isset($recipe['export']) ? $recipe['export'] : null;
				return [['message'=>'', 'errors' => $errors, 'export_status'=>$export_status, 'data' => $jobs], 200];
			}
		);
	}
	// /////////////////////////////
	// REST FUNCTIONS
	// /////////////////////////////

	// /////////////////////////////
	// CRON JOB FUNCTIONS
	// /////////////////////////////
	public function run_job_export_recipe_media(array $job) {
		$success = false;
		$post_id = 0;
		$data_job_status = '';
		$merge_job = null;

		if($job['type'] !== 'media') throw new Exception(__FUNCTION__ .' wrong job type '.$job['type'].' in job id '.$job['id'], 409);
		if($job['status'] === 'done') throw new Exception(__FUNCTION__ .' job already done - job id '.$job['id'], 201);
		if($job['status'] === 'running') throw new Exception(__FUNCTION__ .' job already running - job id '.$job['id'], 201);
		if($job['status'] === 'error') throw new Exception(__FUNCTION__ .' job halted with errors - job id '.$job['id'], 409);

		// check first if uuid is available on post_meta table
		// yes - get post_id for linking the media file
		$job_family = $this->Job_Service->get_by_item_id($job['item_id']);

		if(empty($job_family)) throw new Exception(__FUNCTION__ . ' no job family members found - impossible to get post_id - job id: '. $job['id']);

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

		if(empty($post_id)) throw new Exception(__FUNCTION__ . ' no post_id available (yet). - job id: '. $job['id']);
		if(empty($post_id) && $data_job_status === 'done') throw new Exception(__FUNCTION__ . ' data job is done, but there is no post_id. - job id: '. $job['id']);
		if(!empty($post_id) && $data_job_status === 'error') throw new Exception(__FUNCTION__ . ' post_id found - but data job halted with error. - job id: '. $job['id']);

		$media_id = $this->Export_Service->export_media($post_id, $job['data']);

		if($media_id){
			$this->Job_Service->update($job['id'], ['status'=>'done']);
		}else{
			$this->Job_Service->update($job['id'], ['status'=>'error']);
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
	}

	public function run_job_export_recipe_data(array $job): bool{
		try{
			if($job['type'] !== 'recipe') throw new Exception(__FUNCTION__ .' wrong job type '.$job['type'].' in job id '.$job['id'], 409);
			if($job['status'] === 'done') throw new Exception(__FUNCTION__ .' job already done - job id '.$job['id'], 201);
			if($job['status'] === 'running') throw new Exception(__FUNCTION__ .' job already running - job id '.$job['id'], 201);
			if($job['status'] === 'error') throw new Exception(__FUNCTION__ .' job halted with errors - job id '.$job['id'], 409);

			$recipe_id = $job['item_id'];
			// export to post
			$post = $this->Export_Service->export_recipe_data($recipe_id);
			// add post_id to job for exporting media files / linking them later
			$job['data']['post_id'] = $post->ID;
			$this->Job_Service->update($job['id'], ['data'=>$job['data']]);
			return true;
		}catch(Exception $e){
			error_log($e->getMessage());
			return false;
		}
	}

	public function run_job_export_recipe_media_to_data(array $job): bool{
		try{
			$job_family = $this->Job_Service->get_by_item_id($job['item_id']);

			if(empty($job_family)) throw new Exception(__FUNCTION__ . ' no job family members found - impossible to get post_id - job id: '. $job['id']);

			// check if all prev jobs are done
			$check = true;
			foreach($job_family as $key => $item){
				if($item['type'] === 'recipe_media_merge') continue;
				if($item['status'] !== 'done'){
					$check = false; // not all prev jobs are done
				}
			}

			$data = $job['data'];

			if(!$check) throw new Exception(__FUNCTION__ . ' prev jobs not done for merge job: '. $job['id']);
			if(empty($job['data'])) throw new Exception(__FUNCTION__ . ' merge job is missing data: '. $job['id']);
			if(empty($job['data']['post_id'])) throw new Exception(__FUNCTION__ . ' merge job is missing post id: '. $job['id']);
			if(empty($job['data']['images'])) throw new Exception(__FUNCTION__ . ' merge job is missing medias: '. $job['id']);


			$this->Export_Service->add_media_to_post($data['post_id'], $data['images']); // this also publishes the post
			$this->Job_Service->update($job['id'], ['status'=>'done']);

			// clean up
			$this->Job_Service->delete_by_item_id($job['item_id']);
			$this->Recipes_Service->update($job['item_id'], ['export'=>'done','state'=>'published']);

			return true;
		}catch(Exception $e){
			error_log($e->getMessage());
			return false;
		}
	}

	// /////////////////////////////
	// CRON JOB FUNCTIONS
	// /////////////////////////////

	// /////////////////////////////
	// TEST FUNCTIONS
	// /////////////////////////////
	public function test_get_jobs($request){
		return $this->Api_Middleware->response_public(
			$request,
			function ($Request) {
				return [['message'=>'', 'errors' => [], 'data' => $this->Job_Service->get()], 200];

			}
		);
	}
	public function test_run_job($request){
		return $this->Api_Middleware->response_public(
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