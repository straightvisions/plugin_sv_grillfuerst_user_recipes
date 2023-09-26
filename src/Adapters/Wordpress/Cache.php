<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use function add_filter;

final class Cache {
	private $endpoints = [];

	public function __construct(){
		add_filter( 'wp_rest_cache/allowed_endpoints', [$this, 'handle_endpoints'], 10, 1);
	}

	public function handle_endpoints(array $allowed_endpoints = []): array{
		foreach($this->endpoints as $endpoint){
			if(!isset($allowed_endpoints[ $endpoint['base'] ])){
				$allowed_endpoints[ $endpoint['base'] ] = [];
			}
			$allowed_endpoints[ $endpoint['base'] ][] = $endpoint['path'];
		}

		return $allowed_endpoints;
	}

	public function add(string $base, string $path): void {
		$this->endpoints[] = ['base'=>$base, 'path'=>ltrim($path, '/')];
	}

}