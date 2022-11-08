<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Finder_Service;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Recipes_Middleware implements Middleware_Interface {
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private Recipe_Finder_Service $Recipe_Finder_Service;

    public function __construct(
        Api_Middleware $Api_Middleware,
        Adapter $Adapter,
        Recipe_Finder_Service $Recipe_Finder_Service
    ) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;
        $this->Recipe_Finder_Service = $Recipe_Finder_Service;

        // https://github.com/straightvisions/plugin_sv_appointment/blob/master/lib/modules/api.php

        // get all recipes
        $this->Api_Middleware->add([
            'route' => '/recipes',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_recipes']]
        ]);

        // get recipes from a specific user
        $this->Api_Middleware->add([
            'route' => '/recipes/user/(?P<user_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_recipes_by_user_id']]
        ]);

        // get a specific recipe
        $this->Api_Middleware->add([
            'route' => '/recipes/(?P<recipe_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_recipes_by_recipe_id']]
        ]);

        // get a specific recipe from a specific user
        $this->Api_Middleware->add([
            'route' => '/recipes/(?P<recipe_id>\d+)/user/(?P<user_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_recipes_by_recipe_and_user_id']]
        ]);

    }

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

    public function rest_get_recipes_by_recipe_and_user_id( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $user_id = $Request->getAttribute('user_id');
        $recipe_id = $Request->getAttribute('recipe_id');
        $results = $this->Recipe_Finder_Service->get($recipe_id, $user_id);
        // implement wp_response adapter + services
        return \wp_send_json($results); // @todo remove this when adapter is available
    }

    // more controller functions

}