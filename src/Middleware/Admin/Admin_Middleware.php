<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Admin;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Admin\Service\Admin_Dashboard_Frontend_Service;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Admin_Middleware implements Middleware_Interface {
    private Admin_Dashboard_Frontend_Service $Admin_Dashboard_Frontend_Service;
    private Api_Middleware $Api_Middleware;
    private $Adapter;

    public function __construct(
        Api_Middleware $Api_Middleware,
        Admin_Dashboard_Frontend_Service $Admin_Dashboard_Frontend_Service,
        Adapter $Adapter) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Admin_Dashboard_Frontend_Service = $Admin_Dashboard_Frontend_Service;
        $this->Adapter = $Adapter;
        $this->Adapter->Shortcode()->add('sv_grillfuerst_user_recipes_admin_dashboard', [$this, 'get_frontend_admin_dashboard']);

    }

    // custom shortcode handler
    public function get_frontend_admin_dashboard(array $atts): string {

        // @todo add adapter
        if( \current_user_can( 'edit_posts' ) ){
            $this->Adapter->Asset()->add('app', 'Admin/lib/apps/admin_dashboard/dist/admin_dashboard.build.js');
            return $this->Admin_Dashboard_Frontend_Service->get($atts);
        }else{
            \wp_redirect('/');
            exit();
        }

    }

}