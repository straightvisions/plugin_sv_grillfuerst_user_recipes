<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Api\Service;

use function register_rest_route;

final class Api_Route_Service {
    private $routes = [];

    public function add(array $route): void {
        // implement route validation here
        $this->routes[] = $route;
    }

    public function register_routes(): void {
        foreach ($this->routes as $route) {
            $version = 'v1';
            if (isset($route['version'])) {
                $version = $route['version'];
            }

            $route    = $route['route'];
            $args     = $route['args'];
            $override = isset($route['override']) ? $route['override'] : false;

            register_rest_route('sv-grillfuerst-user-recipes/' . $version, '/' . $route, $args, $override);
        }
    }


}