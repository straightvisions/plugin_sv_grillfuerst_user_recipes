<?php

	namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

	use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
	use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Validator_Service;
	use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Finder_Service;
	use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
	use Psr\Log\LoggerInterface;

	final class Recipe_Exporter_Service {
		private Recipe_Repository $repository;
		private Recipe_Validator_Service $Recipe_Validator;
		private LoggerInterface $logger;
		private $uploadedMediaIDs   = array();
        private $response = ['message'=>'', 'status'=>200];
        private $Recipe_Finder_Service;

        public function __construct(
			Recipe_Repository $repository,
			Recipe_Validator_Service $Recipe_Validator,
            Recipe_Finder_Service $Recipe_Finder_Service,
			Logger_Factory $Logger_Factory
		) {
			$this->repository = $repository;
			$this->Recipe_Validator = $Recipe_Validator;
			$this->Recipe_Finder_Service = $Recipe_Finder_Service;
			$this->logger = $Logger_Factory
				->addFileHandler('user_updater.log')
				->createLogger();
		}

		public function export(int $uuid): array {
			if(!defined('GF_USER_RECIPES_BASE_URL')){#
                $this->response = ['message'=>'Config error - base url missing.', 'status'=>500];
			}

			if(!defined('GF_USER_RECIPES_AUTH')){
                $this->response = ['message'=>'Config error - recipes auth not set.', 'status'=>401];
			}

            $data = $this->Recipe_Finder_Service->getRaw($uuid);

			$post_id        = '';
            foreach($data->steps as $key => $step){
                $this->export_images($step->images);
            }

die;
			// REST Post Array
			$d = json_encode([
				'title'                             => $data['title'],
				'content'                           => '<!-- wp:acf/sv-grillfuerst-custom-recipe-steps {"name":"acf/sv-grillfuerst-custom-recipe-steps","mode":"preview"} /-->',
				'excerpt'                           => $data['excerpt'],
				'featured_media'                    => $this->export_media($data['featured_image']),
				'cp_menutype'                       => [$data['menu_type']],
				'cp_kitchenstyle'                   => [$data['kitchen_style']],
				'acf'                               => [
					'preparation_time'              => $data['preparation_time'],
					'cooking_time'                  => $data['cooking_time'],
					'waiting_time'                  => $data['waiting_time'],
					'difficulty'                    => $data['difficulty'],
					'ingredients'                   => $data['ingredients'],
					'steps'                         => $data['steps'],
					'gf_user_recipe'                => [
						'gf_user_recipe_uuid'       => $data['uuid'],
						'gf_user_recipe_user_id'    => $data['user_id']
					]
				]
			]);

			echo $d;

			$c      = curl_init(GF_USER_RECIPES_BASE_URL.'/wp-json/wp/v2/grillrezepte'.$post_id);
			curl_setopt($c, CURLOPT_USERPWD, GF_USER_RECIPES_AUTH);
			curl_setopt($c, CURLOPT_TIMEOUT, 30);
			curl_setopt($c, CURLOPT_POST, 1);
			curl_setopt($c, CURLOPT_CUSTOMREQUEST, "POST");
			curl_setopt($c, CURLOPT_RETURNTRANSFER, TRUE);

			curl_setopt($c, CURLOPT_POSTFIELDS, $d);
			curl_setopt($c, CURLOPT_HTTPHEADER, [
				'Content-Type: application/json',
				'Content-Length: ' . strlen($d)
			]);

			$r = json_decode(curl_exec($c));
			curl_close($c);

			// @todo: add debugging
			// var_dump($r);

			// Logging
			if(isset($r->id)){
				$this->map_media_to_post($r->id);
				$this->logger->info(sprintf('Recipe exported successfully: %s', $recipe_id));
			}

            return $this->response;
		}

        private function export_images(array $images): void{
            foreach($images as $key => $image){
                $this->export_media($image);
            }
        }

		private function export_media($image): int{

            if(empty($image->url)){
               return 0;
            }

            $url = $image->url;
			$file = file_get_contents( $url );

			$c      = curl_init(GF_USER_RECIPES_BASE_URL.'/wp-json/wp/v2/media');
			curl_setopt($c, CURLOPT_USERPWD, GF_USER_RECIPES_AUTH);
			curl_setopt($c, CURLOPT_TIMEOUT, 30);
			curl_setopt($c, CURLOPT_POST, 1);
			curl_setopt($c, CURLOPT_CUSTOMREQUEST, "POST");
			curl_setopt($c, CURLOPT_RETURNTRANSFER, TRUE);

			curl_setopt($c, CURLOPT_POSTFIELDS, $file);
			curl_setopt($c, CURLOPT_HTTPHEADER, [
				'Content-Disposition: form-data; filename="'.basename($url).'"',
				'Content-Length: ' . strlen($file)
			]);

			$r = json_decode(curl_exec($c));
			curl_close($c);

			// @todo: add debugging
			// var_dump($r);

			// Logging
			if(isset($r->id)){
				$this->logger->info(sprintf('Media exported successfully: %s', $url));
				$this->uploadedMediaIDs[]     = $r->id;
				return $r->id;
			}

			return 0;
		}
		private function map_media_to_post(int $post_id){
			if(count($this->uploadedMediaIDs) === 0){
				return;
			}

			foreach($this->uploadedMediaIDs as $ID){
				// REST Media Array
				$d = json_encode([
					'post'                             => $post_id,
				]);

				$c      = curl_init(GF_USER_RECIPES_BASE_URL.'/wp-json/wp/v2/media/'.$ID);
				curl_setopt($c, CURLOPT_USERPWD, GF_USER_RECIPES_AUTH);
				curl_setopt($c, CURLOPT_TIMEOUT, 30);
				curl_setopt($c, CURLOPT_POST, 1);
				curl_setopt($c, CURLOPT_CUSTOMREQUEST, "POST");
				curl_setopt($c, CURLOPT_RETURNTRANSFER, TRUE);

				curl_setopt($c, CURLOPT_POSTFIELDS, $d);
				curl_setopt($c, CURLOPT_HTTPHEADER, [
					'Content-Type: application/json',
					'Content-Length: ' . strlen($d)
				]);

				$r = json_decode(curl_exec($c));
				curl_close($c);
			}
		}
	}
