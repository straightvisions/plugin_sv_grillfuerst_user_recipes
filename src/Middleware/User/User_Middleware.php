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

        $this->Api_Middleware->add([
            'route' => '/users/(?P<user_id>\d+)/login',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'test']]
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/register',
            'args'  => ['methods' => 'POST', 'callback' => [$this, 'test']]
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/(?P<user_id>\d+)/reset',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'test']]
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/login',
            'args'  => ['methods' => 'POST', 'callback' => [$this, 'rest_login']]
        ]);
    }

    // custom shortcode handler
    public function get_frontend_user_dashboard(array $atts): string {
        //@todo add switch for redirect to login template
        $this->Adapter->Asset()->add('app', 'User/lib/apps/user_recipes/dist/user_recipes.build.js');
        return $this->User_Dashboard_Frontend_Service->get($atts);
    }

    public function rest_login( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $data = $Request->getJSONParams();


        //$results = $this->Recipe_Finder_Service->get_list(null, $params);
        $client = $this->Api_Middleware->http();

        //@todo implement env
        $response = $client->request('POST', 'localhost',
        [
            'form_params' => $data,
            'auth' => [
                '',
                ''
            ]
        ]);

        // implement wp_response adapter + services
        $response = new \WP_REST_Response($response->getBody()->getContents(), $response->getStatusCode()); // @todo remove this when adapter is available
        return $response;
    }

    public function test() {
        // implement wp_response adapter + services
        echo "ok";

    }

    // more controller functions

}