<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Media;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Service\Media_Upload_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Service\Media_Update_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Updater_Service;

use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Media_Middleware implements Middleware_Interface {
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private Media_Upload_Service $Media_Upload_Service;
    private Media_Update_Service $Media_Update_Service;
    private Recipe_Finder_Service $Recipe_Finder_Service;
    private Recipe_Updater_Service $Recipe_Updater_Service;


    public function __construct(
        Api_Middleware $Api_Middleware,
        Adapter $Adapter,
        Media_Upload_Service $Media_Upload_Service,
        Media_Update_Service $Media_Update_Service,
        Recipe_Finder_Service $Recipe_Finder_Service,
        Recipe_Updater_Service $Recipe_Updater_Service,
    ) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;
        $this->Media_Upload_Service = $Media_Upload_Service;
        $this->Media_Update_Service = $Media_Update_Service;
        $this->Recipe_Finder_Service = $Recipe_Finder_Service;
        $this->Recipe_Updater_Service = $Recipe_Updater_Service;

        // upload recipe files
        $this->Api_Middleware->add([
            'route' => '/media/upload/recipes/(?P<uuid>\d+)',
            'args'  => ['methods' => 'POST', 'callback' => [$this, 'rest_upload_media_recipes'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/media/update/recipes/(?P<uuid>\d+)',
            'args'  => ['methods' => 'PUT', 'callback' => [$this, 'rest_update_media_recipes'], 'permission_callback' => '__return_true']
        ]);


    }

    // SETTER ----------------------------------------------------------------------------
    public function rest_upload_media_recipes( $request ) {
        return $this->Api_Middleware->response(
            $request,
            function ($Request) {
                $uuid = (int) $Request->getAttribute('uuid');

                $data = $this->filter_upload_files($Request->getUploadedFiles());
                $items = [];

                if(empty($data) === false){
                    $items = $this->Media_Upload_Service->add_multiple($data, 'recipes/'.$uuid);
                }

				// @todo add a deeper level of status handling like error on not allowed files
               return [$items, 201];
        }, ['customer', 'edit']);
    }

    public function rest_update_media_recipes( $request ){
        return $this->Api_Middleware->response(
            $request,
            function ($Request) {
                $uuid = (int)$Request->getAttribute('uuid');
                $data    = $Request->getJSONParams();
                $item = $this->Media_Update_Service->update($data, 'recipes/'.$uuid);
                $this->update_recipe($item, $uuid);

                return [$item, 200];
            },
            ['admin', 'edit']
        );
    }

	// @todo refactor to a single point of truth ------------------------------------------
    private function get_media_type($string) {
        $mediaTypes = [
            'png' => 'image',
            'jpg' => 'image',
            'jpeg' => 'image',
            'gif' => 'image',
            'mp4' => 'video',
            'mov' => 'video',
            'mp3' => 'audio',
            'pdf' => 'pdf',
        ];

        $extension = pathinfo(strtolower($string), PATHINFO_EXTENSION);
        return $mediaTypes[strtolower($extension)] ?? 'Other';
    }

	private function is_media_type_allowed($file): bool {
		$allowed_types = [
			'image/jpeg',
			'image/jpg',
			'image/png',
		];

		$mimeType = mime_content_type($file['tmp_name']);
		return in_array($mimeType, $allowed_types);
	}

	private function validate_upload_media(array $file): bool {
		return
			// check if file is valid --------------------------
			$file['error'] === 0
			&& $this->is_media_type_allowed($file) === true
			// -------------------------------------------------
			? true : false;
	}

	private function filter_upload_files($data): array {
		$data = is_array($data) ? $data : [];

		foreach($data as $key => $file){
			if($this->validate_upload_media($file) === false){
				unset($data[$key]);
			}
		}

		return array_values($data);
	}
	// / @todo refactor to a single point of truth ------------------------------------------

	// dedicated data updater
    private function update_recipe($item, $uuid){
        $finderResults = $this->Recipe_Finder_Service->get($uuid); // returns object with items array
        $recipe = reset($finderResults->items); // reset returns false if empty
        $type = $this->get_media_type($item->filename);

        if($recipe){
            switch($type){
                case 'image':
                    $recipe = $this->update_recipe_images($recipe, $item);
                    break;
            }

            $this->Recipe_Updater_Service->update((array)$recipe, $uuid);
        }
        return $recipe;
    }

    private function update_recipe_images($recipe, $item){
        // multiple recipe returns to save some performance
        //check if item is the featured image
        if($recipe->featured_image->id === $item->id){
            $recipe->featured_image = $item;
            return $recipe;
        }
        // check if item is one of the steps images
        foreach($recipe->steps as $key => $step){
            foreach($step->images as $imageKey => $image){
                if($image->id === $item->id){
                    $recipe->steps[$key]->images[$imageKey] = $item;
                    return $recipe;
                }
            }
        }

        return $recipe;
    }
}