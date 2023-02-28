<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Creator_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Updater_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Ingredients_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Kitchen_Styles_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Menu_Types_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Exporter_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Jwt\Jwt_Middleware;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Recipes_Middleware implements Middleware_Interface {
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private Recipe_Finder_Service $Recipe_Finder_Service;
    private Recipe_Creator_Service $Recipe_Creator_Service;
    private Recipe_Updater_Service $Recipe_Updater_Service;
	private Recipe_Exporter_Service $Recipe_Exporter_Service;
	private Recipe_Kitchen_Styles_Finder_Service $Recipe_Kitchen_Styles_Finder_Service;
	private Recipe_Menu_Types_Finder_Service $Recipe_Menu_Types_Finder_Service;
	private Jwt_Middleware $Jwt_Middleware;

    public function __construct(
        Api_Middleware $Api_Middleware,
        Adapter $Adapter,
        Recipe_Finder_Service $Recipe_Finder_Service,
        Recipe_Creator_Service $Recipe_Creator_Service,
        Recipe_Updater_Service $Recipe_Updater_Service,
        Recipe_Ingredients_Finder_Service $Recipe_Ingredients_Finder_Service,
        Recipe_Kitchen_Styles_Finder_Service $Recipe_Kitchen_Styles_Finder_Service,
        Recipe_Menu_Types_Finder_Service $Recipe_Menu_Types_Finder_Service,
	    Recipe_Exporter_Service $Recipe_Exporter_Service,
        Jwt_Middleware $Jwt_Middleware
    ) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;
        $this->Recipe_Finder_Service = $Recipe_Finder_Service;
        $this->Recipe_Creator_Service = $Recipe_Creator_Service;
        $this->Recipe_Updater_Service = $Recipe_Updater_Service;
        $this->Recipe_Kitchen_Styles_Finder_Service = $Recipe_Kitchen_Styles_Finder_Service;
        $this->Recipe_Menu_Types_Finder_Service = $Recipe_Menu_Types_Finder_Service;
        $this->Recipe_Ingredients_Finder_Service = $Recipe_Ingredients_Finder_Service;
	    $this->Recipe_Exporter_Service = $Recipe_Exporter_Service;
        $this->Jwt_Middleware = $Jwt_Middleware;

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

        // Ingredients
        $this->Api_Middleware->add([
            'route' => '/recipes/ingredients', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_ingredients']]
        ]);

        // Menu Types
        $this->Api_Middleware->add([
            'route' => '/recipes/menutypes', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_menu_types']]
        ]);

        // Kitchen Styles
        $this->Api_Middleware->add([
            'route' => '/recipes/kitchenstyles', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_kitchen_styles']]
        ]);

		// Export
	    // GET / CREATE RECIPES BASED ON USER ID
	    $this->Api_Middleware->add([
		    'route' => '/recipes/(?P<uuid>\d+)/export', // wordpress specific
		    'args'  => ['methods' => 'PUT', 'callback' => [$this, 'route_recipe_export']]
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

	public function route_recipe_export( $request ){
        return $this->Api_Middleware->response($request, function($Request){
            $uuid = $Request->getAttribute('uuid');
            //$results = $this->Recipe_Exporter_Service->export($uuid);

            return [[],200];
            return [$results, 200];
        }, ['admin','export']);
	}

    // GETTER ----------------------------------------------------------------------------
    public function rest_get_recipes( $request ) {
        return $this->Api_Middleware->response($request, function($Request){
            $params = $Request->getParams();
            if($this->Jwt_Middleware->isRole('admin')){
                $results = $this->Recipe_Finder_Service->get_list(0, $params);
            }else{
                $token_user_id = (int)$this->Jwt_Middleware->getValue('userId');
                $results = $this->Recipe_Finder_Service->get_list($token_user_id, $params);
            }
            return [$results, 200];
        }, ['customer', 'view']);

    }

    public function rest_get_recipes_by_user_id( $request ) {
        return $this->Api_Middleware->response($request, function($Request){
            $params = $Request->getParams();
            $user_id = (int)$Request->getAttribute('user_id');
            $results = $this->Recipe_Finder_Service->get_list($user_id, $params);
            return [$results, 200];
        }, ['customer', 'view', fn($Request) => (int)$Request->getAttribute('user_id') === (int)$this->Jwt_Middleware->getValue('userId')]);
    }

    public function rest_get_recipes_by_uuid( $request ) {
        return $this->Api_Middleware->response($request, function($Request){
            $uuid = $Request->getAttribute('uuid');

            if($this->Jwt_Middleware->isRole('admin')){
                $results = $this->Recipe_Finder_Service->get($uuid);
            }else{
                $token_user_id = (int)$this->Jwt_Middleware->getValue('userId');
                $results = $this->Recipe_Finder_Service->get($uuid, $token_user_id);
            }

            $results = isset($results->items[0]) ? $results->items[0] : [];
            return [$results, 200];
        }, ['customer', 'view']);
    }

    public function rest_get_ingredients( $request ) {
        return $this->Api_Middleware->response($request, function($Request){
            $results = $this->Recipe_Ingredients_Finder_Service->get_list();
            return [$results, 200];
        }, ['customer', 'view'], ['Cache-Control' => 'max-age=3600']);
    }

    public function rest_get_menu_types( $request ) {
        return $this->Api_Middleware->response($request, function($Request){
            $results = $this->Recipe_Menu_Types_Finder_Service->get_list();
            return [$results, 200];
        }, ['customer', 'view'], ['Cache-Control' => 'max-age=3600']);
    }

    public function rest_get_kitchen_styles( $request ) {
        return $this->Api_Middleware->response($request, function($Request){
            $results = $this->Recipe_Kitchen_Styles_Finder_Service->get_list();
            return [$results, 200];
        }, ['customer', 'view'], ['Cache-Control' => 'max-age=3600']);
    }

    // SETTER ----------------------------------------------------------------------------
    public function rest_create_recipe( $request ) {
        return $this->Api_Middleware->response($request, function($Request){
            $user_id = $Request->getAttribute('user_id');
            $data = $Request->getJSONParams();

            $recipe_uuid = $this->Recipe_Creator_Service->insert($data, $user_id);
            $results = $this->Recipe_Finder_Service->get($recipe_uuid, $user_id);
            $results = $results->items[0]; //hotfix // @todo replace the results with ReaderService
            return [$results, 200];
        }, ['customer', 'edit', fn($Request) => (int)$Request->getAttribute('user_id') === (int)$this->Jwt_Middleware->getValue('userId')]);
    }

    public function rest_update_recipe( $request ) {
        return $this->Api_Middleware->response($request, function($Request){
            $uuid = $Request->getAttribute('uuid');
            $data = $Request->getJSONParams();

            if(is_array($data) && empty($data) === false){
                $this->Recipe_Updater_Service->update($data, $uuid);
            }
            return [[], 200];
        }, ['customer', 'edit', fn($Request) => $this->Jwt_Middleware->isRole('admin') || (int)$Request->getAttribute('user_id') === (int)$this->Jwt_Middleware->getValue('userId')]);


    }

}