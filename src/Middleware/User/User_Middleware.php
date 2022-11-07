<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Login_Frontend_Service;

final class User_Middleware implements Middleware_Interface {
    private User_Login_Frontend_Service $User_Login_Frontend_Service;
    private Api_Middleware $Api_Middleware;
    private $Adapter;

    public function __construct(Api_Middleware $Api_Middleware, $Adapter) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;
        $this->Adapter->shortcode->add('sv_gf_user_login', [$this, 'get_frontend_user_login']);

        // load services
        $this->User_Login_Frontend_Service = new User_Login_Frontend_Service();

        $this->Api_Middleware->add([
            'route' => '/users',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'test']]
        ]);
    }

    // custom shortcode handler
    public function get_frontend_user_login(array $atts): string {
        return $this->User_Login_Frontend_Service->get($atts);
    }

    public function test() {
        // implement wp_response adapter + services
        echo "ok";

    }

    // more controller functions

}