<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Api\Service;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;
use function register_rest_route;

final class Api_Route_Service {
	private Adapter $Adapter;
    private $routes = [];

	public function __construct(Adapter $Adapter){
		$this->Adapter = $Adapter;
	}

    public function add(array $route): void {
        // implement route validation here

       if(is_array($route) === true){
           $this->routes[] = $route;

	       // caching
	       $path = (string) $route['route'];
	       if(isset($route['cache']) && $route['cache']){
		       $this->Adapter->Cache()->add('sv-grillfuerst-user-recipes/v1' , $path);
	       }
       }else{
           // error handling here
       }

    }

    public function register_routes(): void {

        foreach ($this->routes as $route) {
            $version = 'v1';
            if (isset($route['version'])) {
                $version = $route['version'];
            }

            $path    = (string) $route['route'];
            $args     = isset($route['args']) ? (array) $route['args'] : [];
            $override = isset($route['override']) ? (bool) $route['override'] : true;

            register_rest_route('sv-grillfuerst-user-recipes/v1', $path, $args, $override);
        }
    }

    public function get_list(): array{
        $list = [];

        foreach($this->routes as $key => $route){
            $list[] = $route['route'];
        }

        return $list;
    }


}