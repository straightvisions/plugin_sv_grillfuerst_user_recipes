<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export\Services;

use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Info_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Models\Recipe_Exporter_Model;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Service\Product_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Voucher_Service;

use Exception;
final class Export_Service {

	protected $data = [
		'status'        => 'pending', // pending, running, done
		'next'          => 'media',
		'uuid'          => 0,
		'external_id'   => 0, // link media files to post_id
		'link'          => '',
		'media'         => [],
		'error'         => [],
	];

	protected $clone = null;

	protected Media_Service $Media_Service;
	protected Job_Service $Job_Service;
	protected Recipes_Service $Recipes_Service;
	protected User_Info_Service $User_Info_Service;
	protected Recipe_Exporter_Model $Recipe_Exporter_Model;
	protected Product_Finder_Service $Product_Finder_Service;
	protected Recipe_Voucher_Service $Recipe_Voucher_Service;

	public function __construct(
		Media_Service $Media_Service,
		Recipes_Service $Recipes_Service,
		Job_Service $Job_Service,
		User_Info_Service $User_Info_Service,
		Product_Finder_Service $Product_Finder_Service,
		Recipe_Voucher_Service $Recipe_Voucher_Service
	) {
		$this->Media_Service = $Media_Service;
		$this->Job_Service = $Job_Service;
		$this->Recipes_Service = $Recipes_Service;
		$this->User_Info_Service = $User_Info_Service;
		$this->Product_Finder_Service = $Product_Finder_Service;
		$this->Recipe_Voucher_Service = $Recipe_Voucher_Service;
	}

	public function get_data(){
		return $this->data;
	}

	public function get_status(){
		return $this->data['status'];
	}

	public function get_errors(){
		return $this->data['errors'];
	}

	public function get_next(){
		return $this->data['next'];
	}

	public function export($item){
		$this->create($item);

		//@todo shouldn't this be moved to the controller?
		$this->Job_Service->create([
			'type' => 'recipe',
			'item_id' => $this->data['uuid'],
			'callback'=>'SV_Grillfuerst_User_Recipes\Middleware\Export\Export_Controller::run_job_export_recipe_data',
			'priority' => 2, // give data items higher priority than media just in case we do bulk exporting later, data needs to be exported earlier
		]);

		foreach($this->data['media'] as $key => $media){
			$this->Job_Service->create([
				'type' => 'media',
				'item_id' => $this->data['uuid'],
				'data' => json_encode($media),
				'callback'=>'SV_Grillfuerst_User_Recipes\Middleware\Export\Export_Controller::run_job_export_recipe_media',
				'priority' => 1,
			]);
		}

		$this->Job_Service->create([
			'type' => 'recipe_media_merge',
			'status' => 'pending',
			'item_id' => $this->data['uuid'],
			'data'=>json_encode([]),
			'callback'=>'SV_Grillfuerst_User_Recipes\Middleware\Export\Export_Controller::run_job_export_recipe_media_to_data',
			'priority' => 0
		]);

	}
	public function create($item) {
		$this->data['uuid'] = $item['uuid'] ?? 0;
		$this->data['media'] = $item ? $this->extract_media($item) : [];

		return $this->data;
	}

	private function extract_media($item): array {
		$media = [];
		// featured
		$featured = json_decode($item['featured_image'], true);
		if ($featured) {
			$featured['_type']          = 'featured';
			$featured['_export']        = 'pending';
			$featured['_media_id']      = 0;
			$media[] = $featured;
		}
		// steps
		$steps = json_decode($item['steps'], true);
		if ($steps) {
			foreach ($steps as $step) {
				$images = $step['images'];
				foreach ($images as $img) {
					$image = $img;

					if ($image) {
						$image['_type']             = 'step';
						$image['_export']           = 'pending';
						$image['_media_id']         = 0;
						$media[] = $image;
					}
				}
			}
		}

		return $media;
	}

	public function export_recipe_data(int $recipe_id):mixed{
		$item = $this->Recipes_Service->get($recipe_id);
		if(empty($item)) throw new Exception(__FUNCTION__ . ' recipe not found: ' . $recipe_id);
		$item = new Recipe_Exporter_Model($item, $this->Product_Finder_Service);
		$user = $this->User_Info_Service->get_raw($item->get('user_id'), true);
		if(empty($user)) throw new Exception(__FUNCTION__ . ' user not found: ' . $recipe_id . ' user id: '. $item->get('user_id'));

		$user = $this->User_Info_Service->get_raw($item->get('user_id'), true);

		$author = [
			'user_id'=> $item->get('user_id'),
			'username'=> $user ? $user['username'] : '',
			'firstname'=> $user ? $user['firstname'] : '',
			'lastname'=> $user ? $user['lastname'] : '',
			'voucher'=> empty($item->get('voucher')) ? $this->Recipe_Voucher_Service->create($item) : $item->get('voucher'),
		];

		$data = [
			'post_title'   => $item->get('title'),
			'post_status'  => 'draft', // keep it drafty still medias have been exported
			'post_content' => '<!-- wp:acf/sv-grillfuerst-custom-recipe-steps {"name":"acf/sv-grillfuerst-custom-recipe-steps","mode":"preview"} /-->',
			'post_excerpt' => $item->get('excerpt'),
			'post_type'    => 'grillrezepte',
			'meta_input'   => [] // non custom metas
		];

		$metas = [
			'preparation_time' => $item->get('preparation_time'),
			'cooking_time'     => $item->get('cooking_time'),
			'waiting_time'     => $item->get('waiting_time'),
			'difficulty'       => $item->get('difficulty'),
			'ingredients'      => $item->get('ingredients'),
			'accessories'      => $item->get('accessories'),
			'steps'            => $item->get('steps'),
			'gf_community_recipe_is' => '1',
			'gf_community_recipe'   => [
				'uuid'    => $item->get('uuid'),
				'user_id' => $author['user_id'],
				'firstname' => $author['firstname'],
				'lastname' => $author['lastname'],
				'username' => $author['username'],
				'voucher' => $author['voucher'],
			]
		];

		$post_id = \wp_insert_post($data);

		$post = \get_post($post_id);

		if(empty($post)) throw new Exception(__FUNCTION__ . ' couldn\'t create post');

		// add metas
		foreach($metas as $key => $val){
			\update_field($key, $val, $post_id);
		}

		// add taxonomies
		\wp_set_object_terms($post_id, $item->get('menu_type'), 'cp_menutype');
		\wp_set_object_terms($post_id, $item->get('kitchen_style'), 'cp_kitchenstyle');
		\wp_set_object_terms($post_id, [$this->get_community_taxonomy_id()], 'cp_source');


		return $post;
	}

	public function export_media(int $post_id, array $media): int{
		// export item
		$media_id = $this->Media_Service->export_file((object)$media); // returns false or media_id

		if(!$media_id) throw new Exception(__FUNCTION__ . ' Export for media file failed. post_id '.$post_id);

		$this->Media_Service->link($post_id, $media_id);
		//$this->add_media_to_post($post_id, $media_id, $media);
		return $media_id;
	}

	public function add_media_to_post(int $post_id, array $medias){
		$post_meta = \get_post_meta($post_id);
		$uuid = (int) $post_meta['gf_community_recipe_uuid'][0];
		$recipe = $this->Recipes_Service->get($uuid);

		if(!$post_meta) throw new Exception(__FUNCTION__ . ' post meta not found: post_id '.$post_id, 500);
		if(!$uuid) throw new Exception(__FUNCTION__ . ' uuid missing: post_id '.$post_id, 500);
		if(!$recipe) throw new Exception(__FUNCTION__ . ' recipe not found post_id '.$post_id, 500);

		$item = new Recipe_Exporter_Model($recipe, $this->Product_Finder_Service);

		foreach($medias as $key => $media){
			// feature image
			if($media['_type'] === 'featured'){
				\set_post_thumbnail( $post_id, $media['_media_id']);
				continue;
			}

			$steps = $item->steps;

			foreach ($steps as $skey => &$step) {
				foreach($step->images as $iKey => &$img){
					if(is_object($img)
					   && is_array($media)
					   && $img->id === $media['id']
					){
						$img = $media['_media_id'];
					}
				}
			}

			$item->set('steps', $steps);
		}

		$steps = $item->get('steps');

		\update_field('steps', $steps, $post_id);

		// Publish the post
		\wp_update_post([
			'ID' => $post_id,
			'post_status' => 'publish'
		]);

		$this->Recipes_Service->update($uuid, ['link'=> \get_permalink($post_id) ?? 'could_not_get_permalink']);
	}

	// helper functions
	public function get_community_taxonomy_id(){
		return defined('GF_USER_RECIPES_TAXONOMY_ID') ? GF_USER_RECIPES_TAXONOMY_ID : 0;
	}

	public function from_json(mixed $data): array{
		if(is_array($data)) return $data;
		if(is_string($data)) return json_decode($data, true);

		throw new Exception(__FUNCTION__ . ' couldn\'t decode $data.' );
	}


}
