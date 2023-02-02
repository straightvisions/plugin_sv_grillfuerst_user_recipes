<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Dashboard_Frontend_Service;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;
use Psr\Container\ContainerInterface;


final class User_Middleware implements Middleware_Interface {
    private User_Dashboard_Frontend_Service $User_Dashboard_Frontend_Service;
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private $settings;
    private $auth_header;

    public function __construct(
        Api_Middleware $Api_Middleware,
        User_Dashboard_Frontend_Service $User_Dashboard_Frontend_Service,
        Adapter $Adapter,
        ContainerInterface $container
    ) {
        $this->settings = $container->get('settings');
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
            'args'  => ['methods' => 'POST', 'callback' => [$this, 'rest_register']]
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/reset',
            'args'  => ['methods' => 'PUT', 'callback' => [$this, 'rest_reset']]
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/login',
            'args'  => ['methods' => 'POST,GET', 'callback' => [$this, 'rest_login']]
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
        $client = $this->Api_Middleware->http();

        $response = $client->request('POST',
            $this->settings['login_server_url'] ,
        [
            'content-type' => 'application/json',
            'json' => $data,
            'headers' => ['Authorization' => $this->settings['auth_header']],
            'debug'=>false
        ]);

        // implement wp_response adapter + services
        $response = new \WP_REST_Response(json_decode($response->getBody(), true), $response->getStatusCode()); // @todo remove this when adapter is available
        return $response;
    }

    public function rest_reset( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $data = $Request->getJSONParams();
        $client = $this->Api_Middleware->http();

        $response = $client->request('POST',
            $this->settings['reset_server_url'] ,
            [
                'content-type' => 'application/json',
                'json' => $data,
                'headers' => ['Authorization' => $this->settings['auth_header']],
                'debug'=>false
            ]);

        // implement wp_response adapter + services
        $response = new \WP_REST_Response(json_decode($response->getBody(), true), $response->getStatusCode()); // @todo remove this when adapter is available
        return $response;
    }

    public function rest_register( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $data = $Request->getJSONParams();
        $client = $this->Api_Middleware->http();

        $response = $client->request('POST',
            $this->settings['register_server_url'] ,
            [
                'content-type' => 'application/json',
                'json' => $data,
                'headers' => ['Authorization' => $this->settings['auth_header']],
                'debug'=>false
            ]);

        // implement wp_response adapter + services
        $response = new \WP_REST_Response(json_decode($response->getBody(), true), $response->getStatusCode()); // @todo remove this when adapter is available
        return $response;
    }

    public function test() {
        // implement wp_response adapter + services
        echo "ok";

    }

    // more controller functions
}