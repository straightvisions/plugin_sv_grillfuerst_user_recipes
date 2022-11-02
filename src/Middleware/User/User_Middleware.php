<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User;

use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Shortcode_Adapter;
use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Login_Frontend_Service;

final class User_Middleware implements Middleware_Interface {

    public function __construct() {
        $Shortcode_Adapter = new Shortcode_Adapter();
        $Shortcode_Adapter->add('sv_gf_user_login', [$this, 'get_frontend_user_login']);
    }

    // custom shortcode handler
    public function get_frontend_user_login(array $atts): string {
        $User_Login_Frontend_Service = new User_Login_Frontend_Service();

        return $User_Login_Frontend_Service->get($atts);
    }

    // more controller functions

}