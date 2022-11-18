<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Dashboard_Frontend_Service;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class User_Middleware implements Middleware_Interface {
    private User_Dashboard_Frontend_Service $User_Dashboard_Frontend_Service;
    private Api_Middleware $Api_Middleware;
    private $Adapter;

    public function __construct(
        Api_Middleware $Api_Middleware,
        User_Dashboard_Frontend_Service $User_Dashboard_Frontend_Service,
        Adapter $Adapter) {
        $this->Api_Middleware = $Api_Middleware;
        $this->User_Dashboard_Frontend_Service = $User_Dashboard_Frontend_Service;
        $this->Adapter = $Adapter;
        $this->Adapter->Shortcode()->add('sv_grillfuerst_user_recipes_user_dashboard', [$this, 'get_frontend_user_dashboard']);

        $this->Api_Middleware->add([
            'route' => '/users',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'test']]
        ]);
    }

    // custom shortcode handler
    public function get_frontend_user_dashboard(array $atts): string {
        $this->Adapter->Asset()->add('app', 'User/lib/apps/user_recipes/dist/user_recipes.build.js');
        return $this->User_Dashboard_Frontend_Service->get($atts);
    }

    public function test() {
        // implement wp_response adapter + services
        echo "ok";

    }

    // more controller functions

}