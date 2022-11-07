<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Finder_Service;

final class Recipes_Middleware implements Middleware_Interface {
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private Recipe_Finder_Service $Recipe_Finder;

    public function __construct(Api_Middleware $Api_Middleware, $Adapter) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;

        $this->Api_Middleware->add([
            'route' => '/recipes',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_recipes']]
        ]);

        $this->add_services();
    }

    public function add_services(){
        $this->Recipe_Finder_Service = new Recipe_Finder_Service();
    }

    public function rest_get_recipes( $request ) {
        $Request = $this->Adapter->Request->set($request);

        $results = $this->Recipe_Finder_Service->get_list();
        // implement wp_response adapter + services
        return json_encode($results); // @todo remove this when adapter is available

    }

    // more controller functions

}