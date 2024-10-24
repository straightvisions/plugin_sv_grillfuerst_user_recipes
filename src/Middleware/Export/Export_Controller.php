<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export;

use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Recipes_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Export\Services\Export_Service;

final class Export_Controller{
	private Api_Middleware $Api_Middleware;
	private Recipes_Service $Recipes_Service;
	private Export_Service $Export_Service;

	public function __construct(
		Api_Middleware $Api_Middleware,
		Recipes_Service $Recipes_Service,
		Export_Service $Export_Service
	){
		$this->Api_Middleware = $Api_Middleware;
		$this->Recipes_Service = $Recipes_Service;
		$this->Export_Service = $Export_Service;

		$this->register_routes();
	}

	public function register_routes(){
		// /export/recipe/{id}
		$this->Api_Middleware->add([
			'route' => '/export/recipes/(?P<uuid>\d+)',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_recipe'], 'permission_callback' => '__return_true']
		]);

		$this->Api_Middleware->add([
			'route' => '/export/recipes/(?P<uuid>\d+)/resume',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_resume'], 'permission_callback' => '__return_true']
		]);

		$this->Api_Middleware->add([
			'route' => '/export/recipes/(?P<uuid>\d+)/status',
			'args'  => ['methods' => 'GET', 'callback' => [$this, 'export_status'], 'permission_callback' => '__return_true']
		]);

	}

	public function export_recipe($request){

		return $this->Api_Middleware->response_public(
			$request,
			function ($Request) {
				$message = '';
				$errors = [];
				// get recipe
				$uuid  = $Request->getAttribute('uuid');
				$item = $this->Recipes_Service->get($uuid);
				$export = $this->Export_Service;
				$export->create($item);

				// save to export column
				$this->Recipes_Service->update($uuid, ['export'=>json_encode($export->get_data())]);
				$status = $export->get_status();

				if($status === 'done'){
					$message = 'Already exported: ' . $item['link'];
				}

				if($status === 'pending'){
					// call export media asynchron
					$this->call('/' . $uuid . '/resume');
					$message = 'Export started.';
				}

				if($status === 'running'){
					$message = 'Export already running.';
				}

				if($status === 'error'){
					$message = 'Export halted with error - please resume.';
					$errors = $export->get_errors();
				}

				return [['message'=>$message, 'errors' => $errors], 200];
			}//,			['admin', 'export']
		);

	}

	//@todo should only resume, not for loop, create a /next route for the loop
	public function export_resume($request){
		return $this->Api_Middleware->response_public($request,
			function ($Request) {
				$message = 'Export restarted!';
				$errors = [];
				// get recipe
				$uuid  = $Request->getAttribute('uuid');
				$item = $this->Recipes_Service->get($uuid);
				$export = $this->Export_Service;
				$export->create($item);
				$status = $export->get_status();

				if($status === 'done'){
					$message = 'Export already done: ' . $item['link'];
				}else{
					if($export->get_next() === 'media'){
						$export->export_media();
					}

					if($export->get_next() === 'data'){
						$export->export_data();
					}

					if(empty($export->get_errors())){
						// update and next async round
						$this->Recipes_Service->update($uuid, ['export'=>json_encode($export->get_data())]);
						$this->call('/' . $uuid . '/resume');
					}else{
						$errors = $export->get_errors();
					}
				}

				return [['message'=>$message, 'errors' => $errors], 200];
			}
		);
	}

	public function export_status($request){
		return $this->Api_Middleware->response_public($request,
			function ($Request) {
				$message = '';
				$errors = [];
				// get recipe
				$uuid  = $Request->getAttribute('uuid');
				$item = $this->Recipes_Service->get($uuid) ?? [];
				$export = $this->Export_Service;
				$export->create($item);

				if(empty($item)){
					$message = 'Item not found!';
				}

				return [['message'=>$message, 'errors' => $errors, 'data' => json_encode($export->get_data())], 200];
			}
		);
	}

	protected function call(string $path): void{
		$url = 'https://staging-magazin.grillfuerst.de/sv-grillfuerst-user-recipes/v1/export/recipes/' . ltrim($path, '/');
		// Initialize cURL session
		$ch = curl_init($url);
		// Set cURL options to make it non-blocking
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, false); // Do not wait for the response
		curl_setopt($ch, CURLOPT_TIMEOUT_MS, 100); // Set a very short timeout
		curl_setopt($ch, CURLOPT_NOSIGNAL, 1); // Prevent timeout for 0 or very short timeouts
		curl_setopt($ch, CURLOPT_HEADER, 0); // No need to return headers
		// Execute cURL request and close immediately
		curl_exec($ch);
		curl_close($ch);
	}
}