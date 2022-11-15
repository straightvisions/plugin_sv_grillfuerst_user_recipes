<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Creator_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Updater_Service;
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
        Recipe_Updater_Service $Recipe_Updater_Service
    ) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;
        $this->Recipe_Finder_Service = $Recipe_Finder_Service;
        $this->Recipe_Creator_Service = $Recipe_Creator_Service;
        $this->Recipe_Updater_Service = $Recipe_Updater_Service;

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
            'route' => '/recipes/(?P<recipe_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET, PUT', 'callback' => [$this, 'route_recipes_recipe_id']]
        ]);

        // GET / CREATE RECIPES BASED ON USER ID
        $this->Api_Middleware->add([
            'route' => '/recipes/user/(?P<user_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET, POST', 'callback' => [$this, 'route_recipes_user_id']]
        ]);

        // Create - Upload Images
        $this->Api_Middleware->add([
            'route' => '/recipes/(?P<recipe_id>\d+)/images/user/(?P<user_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'POST,PUT', 'callback' => [$this, 'rest_get_recipes_upload_files']]
        ]);

        // Update


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

    public function route_recipes_recipe_id( $request ){
        $Request = $this->Adapter->Request()->set($request);

        switch($Request->getMethod()){
            case 'PUT' : return $this->rest_update_recipe($request);
            case 'GET' : return $this->rest_get_recipes_by_recipe_id($request);
        }

        return [];
    }

    // GETTER ----------------------------------------------------------------------------
    public function rest_get_recipes( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $results = $this->Recipe_Finder_Service->get_list();
        // implement wp_response adapter + services
        return \wp_send_json($results); // @todo remove this when adapter is available
    }

    public function rest_get_recipes_by_user_id( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $user_id = $Request->getAttribute('user_id');
        $results = $this->Recipe_Finder_Service->get_list($user_id);
        // implement wp_response adapter + services
        return \wp_send_json($results); // @todo remove this when adapter is available
    }

    // @todo change finder in reader services!!
    public function rest_get_recipes_by_recipe_id( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $recipe_id = $Request->getAttribute('recipe_id');
        $results = $this->Recipe_Finder_Service->get($recipe_id);
        // implement wp_response adapter + services
        return \wp_send_json($results); // @todo remove this when adapter is available
    }

    // SETTER ----------------------------------------------------------------------------
    public function rest_create_recipe( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $user_id = $Request->getAttribute('user_id');
        $data = $Request->getJSONParams();

        $recipe_id = $this->Recipe_Creator_Service->insert($data, $user_id);
        $results = $this->Recipe_Finder_Service->get($recipe_id, $user_id);
        // implement wp_response adapter + services
        return \wp_send_json($results); // @todo remove this when adapter is available
    }

    public function rest_update_recipe( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $recipe_id = $Request->getAttribute('recipe_id');
        $data = $Request->getJSONParams();

        $this->Recipe_Updater_Service->update($data, $recipe_id);
        $results = $this->Recipe_Finder_Service->get($recipe_id);
        // implement wp_response adapter + services
        return \wp_send_json($results); // @todo remove this when adapter is available
    }
    // more controller functions

}