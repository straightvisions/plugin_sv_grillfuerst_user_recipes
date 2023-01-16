<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Login;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Login\Service\Login_Frontend_Service;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Login_Middleware implements Middleware_Interface {
    private Login_Frontend_Service $Login_Frontend_Service;
    private Api_Middleware $Api_Middleware;
    private $Adapter;

    public function __construct(
        Api_Middleware $Api_Middleware,
        Login_Frontend_Service $Login_Frontend_Service,
        Adapter $Adapter) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Login_Frontend_Service = $Login_Frontend_Service;
        $this->Adapter = $Adapter;
        // @todo add debugging check here, we don't want this shortcode in production
        $this->Adapter->Shortcode()->add('sv_grillfuerst_user_recipes_login', [$this, 'get_frontend']);

    }

    // custom shortcode handler
    public function get_frontend(array $atts): string {
        $this->Adapter->Asset()->add('app', 'Login/lib/apps/login/dist/login.build.js');
        return $this->Login_Frontend_Service->get($atts);
    }

}