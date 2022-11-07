<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;

final class Recipes_Middleware implements Middleware_Interface {
    private Api_Middleware $Api_Middleware;
    private $Adapter;

    public function __construct(Api_Middleware $Api_Middleware, $Adapter) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;

        $this->Api_Middleware->add([
            'route' => '/recipes',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_recipes']]
        ]);
    }

    public function rest_get_recipes( $request ) {
        $Request = $this->Adapter->Request($request);

        // implement wp_response adapter + services
        echo "ok";

    }

    // more controller functions

}