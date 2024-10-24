<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export\Services;

use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Media_Service;

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

	public function __construct(Media_Service $Media_Service) {
		$this->Media_Service = $Media_Service;
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
	public function create($item) {
		if(isset($item['export']) && !empty($item['export'])){
			$export = is_string($item['export']) ? json_decode($item['export'], true) : $item['export'];
			foreach($export as $key => $value){
				if($key === 'media' && is_string($value)){
					$value = json_decode($value, true);
				}

				if(isset($this->data[$key])){
					$this->data[$key] = $value;
				}
			}
		}else{
			$this->data['uuid'] = $item['uuid'] ?? 0;
			$this->data['media'] = $item ? $this->extract_media($item) : [];
		}

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

	public function export_media(): void{
		///////////////////////////////////
		$this->data['status'] = 'running';
		///////////////////////////////////
		$media_id = 0;
		$did_an_export = false;
		// export single media
		foreach($this->data['media'] as $key => $file){
			if($file['_export'] === 'done') continue;

			// export item
			$media_id = $this->Media_Service->export_file((object)$file);

			if($media_id){
				$file['_media_id'] = $media_id;
				$file['_export'] = 'done';
				$this->data['media'][$key] = $file;
			}else{
				$this->data['status'] = 'error';
				$this->data['errors'][] = 'Error while exporting media ' . $file['url'];
			}

			$did_an_export = true;
			break;
		}

		$this->data['next'] = $did_an_export ? 'media' : 'data';
	}

	public function export_data(): void{
		$this->data['status'] = 'done';
		$this->data['next'] = 'none';
	}

}
