<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Creator_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Updater_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Ingredients_Finder_Service;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Recipes_Middleware implements Middleware_Interface {
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private Recipe_Finder_Service $Recipe_Finder_Service;
    private Recipe_Creator_Service $Recipe_Creator_Service;
    private Recipe_Updater_Service $Recipe_Updater_Service;

    public function __construct(
        Api_Middleware $Api_Middleware,
        Adapter $Adapter,
        Recipe_Finder_Service $Recipe_Finder_Service,
        Recipe_Creator_Service $Recipe_Creator_Service,
        Recipe_Updater_Service $Recipe_Updater_Service,
        Recipe_Ingredients_Finder_Service $Recipe_Ingredients_Finder_Service
    ) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;
        $this->Recipe_Finder_Service = $Recipe_Finder_Service;
        $this->Recipe_Creator_Service = $Recipe_Creator_Service;
        $this->Recipe_Updater_Service = $Recipe_Updater_Service;
        $this->Recipe_Ingredients_Finder_Service = $Recipe_Ingredients_Finder_Service;

        // https://github.com/straightvisions/plugin_sv_appointment/blob/master/lib/modules/api.php
        // @todo add permissions
        // https://developer.wordpress.org/rest-api/extending-the-rest-api/routes-and-endpoints/#permissions-callback
        //
        //

        // GET ALL RECIPES
        $this->Api_Middleware->add([
            'route' => '/recipes',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_recipes']]
        ]);

        // GET / UPDATE A SPECIFIC RECIPE
        $this->Api_Middleware->add([
            'route' => '/recipes/(?P<uuid>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET, PUT', 'callback' => [$this, 'route_recipes_uuid']]
        ]);

        // GET / CREATE RECIPES BASED ON USER ID
        $this->Api_Middleware->add([
            'route' => '/recipes/user/(?P<user_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET, POST', 'callback' => [$this, 'route_recipes_user_id']]
        ]);

        // Create - Upload Images
        $this->Api_Middleware->add([
            'route' => '/recipes/(?P<uuid>\d+)/images/user/(?P<user_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'POST,PUT', 'callback' => [$this, 'rest_get_recipes_upload_files']]
        ]);

        // Ingredients
        $this->Api_Middleware->add([
            'route' => '/recipes/ingredients', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_ingredients']]
        ]);

    }

    // ROUTER ----------------------------------------------------------------------------
    public function route_recipes_user_id( $request ){
        $Request = $this->Adapter->Request()->set($request);

        switch($Request->getMethod()){
            case 'POST' : return $this->rest_create_recipe($request);
            case 'PUT' : return $this->rest_update_recipe($request);
            case 'GET' : return $this->rest_get_recipes_by_user_id($request);
        }

        return [];
    }

    public function route_recipes_uuid( $request ){
        $Request = $this->Adapter->Request()->set($request);

        switch($Request->getMethod()){
            case 'PUT' : return $this->rest_update_recipe($request);
            case 'GET' : return $this->rest_get_recipes_by_uuid($request);
        }

        return [];
    }

    // GETTER ----------------------------------------------------------------------------
    public function rest_get_recipes( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $results = $this->Recipe_Finder_Service->get_list();
        // implement wp_response adapter + services
        $response = new \WP_REST_Response($results, 200); // @todo remove this when adapter is available
        return $response;
    }

    public function rest_get_recipes_by_user_id( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $user_id = $Request->getAttribute('user_id');
        $results = $this->Recipe_Finder_Service->get_list($user_id);
        // implement wp_response adapter + services
        $response = new \WP_REST_Response($results, 200);
        return $response;
    }

    // @todo change finder in reader services!!
    public function rest_get_recipes_by_uuid( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $uuid = $Request->getAttribute('uuid');
        $results = $this->Recipe_Finder_Service->get($uuid);

        //hotfix // @todo replace the results with ReaderService
        $results = $results->items[0];
        $response = new \WP_REST_Response($results, 200);
        // implement wp_response adapter + services
        return $response; // @todo remove this when adapter is available
    }

    public function rest_get_ingredients( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $results = $this->Recipe_Ingredients_Finder_Service->get_list();
        // implement wp_response adapter + services
        $response = new \WP_REST_Response($results, 200);
        // experimental cache control
        $response->set_headers(array('Cache-Control' => 'max-age=3600'));
        return $response; // @todo remove this when adapter is available
    }

    // SETTER ----------------------------------------------------------------------------
    public function rest_create_recipe( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $user_id = $Request->getAttribute('user_id');
        $data = $Request->getJSONParams();

        $recipe_uuid = $this->Recipe_Creator_Service->insert($data, $user_id);
        $results = $this->Recipe_Finder_Service->get($recipe_uuid, $user_id);
        $response = new \WP_REST_Response($results, 200);
        // implement wp_response adapter + services
        return $response; // @todo remove this when adapter is available
    }

    public function rest_update_recipe( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $uuid = $Request->getAttribute('uuid');
        $data = $Request->getJSONParams();

        $this->Recipe_Updater_Service->update($data, $uuid);
        $results = $this->Recipe_Finder_Service->get($uuid);

        // hotifix -- return item not list
       // $results = $results->items[0];
        $response = new \WP_REST_Response($results, 200);
        // implement wp_response adapter + services
        return $response; // @todo remove this when adapter is available
    }
    // more controller functions



}