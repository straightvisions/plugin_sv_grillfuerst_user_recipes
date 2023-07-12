<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Admin;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Jwt\Jwt_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Admin\Service\Admin_Dashboard_Frontend_Service;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Admin_Middleware implements Middleware_Interface {
    private Admin_Dashboard_Frontend_Service $Admin_Dashboard_Frontend_Service;
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private Jwt_Middleware $Jwt_Middleware;

    public function __construct(
        Api_Middleware $Api_Middleware,
        Admin_Dashboard_Frontend_Service $Admin_Dashboard_Frontend_Service,
        Adapter $Adapter,
        Jwt_Middleware $Jwt_Middleware
    ) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Jwt_Middleware = $Jwt_Middleware;
        $this->Admin_Dashboard_Frontend_Service = $Admin_Dashboard_Frontend_Service;
        $this->Adapter = $Adapter;
        $this->Adapter->Shortcode()->add('sv_grillfuerst_user_recipes_admin_dashboard', [$this, 'get_frontend_admin_dashboard']);

        // routes
        $this->Api_Middleware->add([
            'route' => '/admin/info',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_admin_info'], 'permission_callback' => '__return_true']
        ]);

    }

    // custom shortcode handler
    public function get_frontend_admin_dashboard(array $atts): string {
        // @todo add adapter
        if( \current_user_can( 'edit_posts' ) ){
            $this->Adapter->Asset()->add('sv_grillfuerst_admin_dashboard_app', 'Admin/lib/apps/admin_dashboard/dist/admin_dashboard.build.js',
            [
                'token'=>$this->Jwt_Middleware->create(
                    [
                        'userId' => \get_current_user_id(),
                        'role'=> 'admin',
                        'can' => ['view','edit','delete','export']
                    ])
            ]);

            return $this->Admin_Dashboard_Frontend_Service->get($atts);
        }else{
            \wp_redirect('/');
            exit();
        }

    }

    // route handlers
    public function rest_admin_info($request) {
        //@todo add adapter for wp functions
        return $this->Api_Middleware->response($request, function($Request){
            $data = $this->Jwt_Middleware->get();
            $user_id = isset($data['userId']) ? $data['userId'] : 0;
            $user_meta = \get_user_meta( $user_id );

            $data = [
              'firstname' => $this->array_to_string($user_meta['first_name']),
              'lastname' => $this->array_to_string($user_meta['last_name']),
              'nickname' => $this->array_to_string($user_meta['nickname']),
              'gender' => '',
              'avatar' => \get_avatar_url( $user_id ),
              'roles' => $this->get_user_roles($user_id),
            ];

            // add salutation
            switch($data['gender']){
                case 'm': $data['salutation'] = 'Herr'; break;
                case 'f': $data['salutation'] = 'Frau'; break;
                default: $data['salutation'] = ''; break;
            }

            return [[
                'status' => 'success',
                'isLoggedIn' => true, // @todo check if user is logged in wp by id
                'data' => $data,
            ],200];

        },['admin','view']);
    }

    private function get_user_roles(int $user_id): array{
        $roles = ['editor'];

        if(\user_can($user_id , 'manage_options')){$roles[] = 'admin';}

        return $roles;
    }

    private function array_to_string($array){
        $array = is_object($array) ? (array)$array : $array;
        return is_array($array) ? implode(' ', $array) : $array;
    }

}