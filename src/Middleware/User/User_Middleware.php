<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User;

use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;
use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Jwt\Jwt_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Dashboard_Frontend_Service;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Info_Service;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Login_Frontend_Service;
use WP_REST_Response;

final class User_Middleware implements Middleware_Interface {
    private User_Dashboard_Frontend_Service $User_Dashboard_Frontend_Service;
    private User_Login_Frontend_Service $User_Login_Frontend_Service;
    private User_Info_Service $User_Info_Service;
    private Api_Middleware $Api_Middleware;
    private Jwt_Middleware $Jwt_Middleware;
    private $Adapter;
    private $settings;
    private $auth_header;


    public function __construct(
        Api_Middleware $Api_Middleware,
        User_Dashboard_Frontend_Service $User_Dashboard_Frontend_Service,
        User_Login_Frontend_Service $User_Login_Frontend_Service,
        User_Info_Service $User_Info_Service,
        Jwt_Middleware $Jwt_Middleware,
        Adapter $Adapter,
        ContainerInterface $container
    ) {
        $this->settings                        = $container->get('settings');
        $this->Api_Middleware                  = $Api_Middleware;
        $this->User_Dashboard_Frontend_Service = $User_Dashboard_Frontend_Service;
        $this->User_Login_Frontend_Service     = $User_Login_Frontend_Service;
        $this->User_Info_Service               = $User_Info_Service;
        $this->Jwt_Middleware                  = $Jwt_Middleware;
        $this->Adapter                         = $Adapter;

        // SHORTCODES
        $this->Adapter->Shortcode()->add(
            'sv_grillfuerst_user_recipes_user_dashboard',
            [$this, 'get_frontend_user_dashboard']
        );

        // API ROUTES
        $this->Api_Middleware->add([
            'route' => '/users/register',
            'args'  => ['methods' => 'POST', 'callback' => [$this, 'rest_register'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/reset',
            'args'  => ['methods' => 'PUT', 'callback' => [$this, 'rest_reset'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/login',
            'args'  => ['methods' => 'POST', 'callback' => [$this, 'rest_login'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/login/check',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_login_check'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/info',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_user_info'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/(?P<id>\d+)/info',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_user_info_by_id'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/logout',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_logout'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/users/test',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_user_test'], 'permission_callback' => '__return_true']
        ]);
    }

    // custom shortcode handler
    public function get_frontend_user_dashboard(array $atts): string {
        //@todo add switch for redirect to login template
        $this->Adapter->Asset()->add('app', 'User/lib/apps/user_recipes/dist/user_recipes.build.js');

        return $this->User_Dashboard_Frontend_Service->get($atts);
    }

    public function get_frontend_user_login(array $atts): string {
        //@todo add switch for redirect to login template
        $this->Adapter->Asset()->add('app', 'User/lib/apps/login/dist/login.build.js');

        return $this->User_Login_Frontend_Service->get($atts);
    }

    //@todo add Api Response wrapper
    public function rest_login($request) {
        $Request = $this->Adapter->Request()->set($request);
        $data    = $Request->getJSONParams();
        $client  = $this->Api_Middleware->http();

        $response = $client->request(
            'POST',
            $this->settings['login_server_url'],
            [
                'content-type' => 'application/json',
                'json'         => $data,
                'headers'      => ['Authorization' => $this->settings['auth_header']],
                'debug'        => false
            ]
        );

        $body        = json_decode($response->getBody(), true);
        $code        = $response->getStatusCode();
        $auth_header = '';

        if ($code === 200 && isset($body['status']) && $body['status'] === 'success' && isset($body['customerId'])) {
            $auth_header = 'Bearer ' . $this->Jwt_Middleware->create([
                    'userId' => $body['customerId'],
                    'role'   => 'customer',
                    'can'    => ['view', 'edit']
                ]);
        }

        // implement wp_response adapter + services
        $response = new WP_REST_Response($body, $code);
        $response->header('Authorization', $auth_header);
        $response->header('Access-Control-Expose-Headers', 'Authorization');


        return $response;
    }

    //@todo add Api Response wrapper
    public function rest_login_check() {
        $data   = $this->Jwt_Middleware->get();
        $id     = isset($data['userId']) ? $data['userId'] : 0;
        $client = $this->Api_Middleware->http();

        $response = $client->request(
            'POST',
            $this->settings['loggedin_server_url'],
            [
                'content-type' => 'application/json',
                'json'         => ['customerId' => $id],
                'headers'      => ['Authorization' => $this->settings['auth_header']],
                'debug'        => false
            ]
        );

        $body = json_decode($response->getBody(), true);
        $code = $response->getStatusCode();

        // id = 0 returns an error from remote, we have to compensate that
        if (isset($body['status']) && $body['status'] === 'error') {
            $body['status']   = 'success';
            $body['loggedIn'] = false;
        }

        $body['userId'] = $id;

        // implement wp_response adapter + services
        $response = new WP_REST_Response($body, $code); // @todo remove this when adapter is available

        return $response;
    }

    //@todo add Api Response wrapper
    public function rest_logout() {
        $data = $this->Jwt_Middleware->get();
        $id   = isset($data['userId']) ? $data['userId'] : 0;
        $this->Jwt_Middleware->destroy();
        $client = $this->Api_Middleware->http();

        //@todo not implemented yet
        $code = 200;
        $body = ['status' => 'success'];
        /*
        $response = $client->request('POST',
            $this->settings['logout_server_url'] ,
            [
                'content-type' => 'application/json',
                'json' => ['customerId'=>$id],
                'headers' => ['Authorization' => $this->settings['auth_header']],
                'debug'=>false
            ]);

        $body = json_decode($response->getBody(), true);
        $code = $response->getStatusCode();
    */
        // implement wp_response adapter + services
        $response = new WP_REST_Response($body, $code); // @todo remove this when adapter is available

        return $response;
    }

    //@todo add Api Response wrapper
    public function rest_reset($request) {
        $Request = $this->Adapter->Request()->set($request);
        $data    = $Request->getJSONParams();
        $client  = $this->Api_Middleware->http();

        $response = $client->request(
            'POST',
            $this->settings['reset_server_url'],
            [
                'content-type' => 'application/json',
                'json'         => $data,
                'headers'      => ['Authorization' => $this->settings['auth_header']],
                'debug'        => false
            ]
        );

        // implement wp_response adapter + services
        $response = new WP_REST_Response(
            json_decode($response->getBody(), true), $response->getStatusCode()
        ); // @todo remove this when adapter is available

        return $response;
    }

    //@todo add Api Response wrapper
    public function rest_register($request) {
        $debug  = false;
        $Request = $this->Adapter->Request()->set($request);
        $data    = $Request->getJSONParams();
        $client  = $this->Api_Middleware->http();

        //debug
        if($debug) return new WP_REST_Response(
            ["status"=>"error",
            "message"=>
                ["error"=>
                     [
                         ["info_message"=>"Es existiert bereits ein Kundenkonto mit dieser E-Mail Adresse <a href=https:\/\/staging.grillfuerst.de\/customer\/password_reset>Passwort vergessen?<\/a>"],
                         ["info_message"=>"Passwort zu kurz"]
                     ]
                ]
            ], 500
        ); // @todo remove this when adapter is available*/

        $response = $client->request(
            'POST',
            $this->settings['register_server_url'],
            [
                'content-type' => 'application/json',
                'json'         => $data,
                'headers'      => ['Authorization' => $this->settings['auth_header']],
                'debug'        => false
            ]
        );

        $body =  json_decode($response->getBody(), true);

        $normalizedBody = [
            'status' => $body['status'],
            'message' => '',
            'customerId'=> isset($body['customerId']) ? $body['customerId'] : 0,
        ];

        if($body['status'] === 'error'){
            $normalizedBody['message'] = implode('<br>', array_map(function($error) {
                return $error['info_message'];
            }, $body['message']['error']));
        }

        // implement wp_response adapter + services
        $response = new WP_REST_Response(
            $normalizedBody, $response->getStatusCode()
        ); // @todo remove this when adapter is available*/

        return $response;
    }

    //@todo add Api Response wrapper
    public function rest_user_info($request) {
        $Request     = $this->Adapter->Request()->set($request);
        $auth_header = $Request->getHeader('Authorization');
        $this->Jwt_Middleware->setToken($auth_header);
        $token_data = $this->Jwt_Middleware->get();
        $user_id    = isset($token_data['userId']) ? $token_data['userId'] : 0;

        // get the data
        $info = $this->User_Info_Service->get($user_id);

        // implement wp_response adapter + services
        $response = new WP_REST_Response($info['body'], 200); // @todo remove this when adapter is available
        $response->header('Authorization', $auth_header);
        $response->header('Access-Control-Expose-Headers', 'Authorization');

        return $response;
    }

    public function rest_user_info_by_id($request) {
        return $this->Api_Middleware->response($request,
            function ($Request) {
                $user_id = (int)$Request->getAttribute('id');
                $results = $this->User_Info_Service->get($user_id, true);

                return [$results['body'], $results['code']];
            }, ['admin', 'edit']);
    }

    public function rest_user_Test($request) {
        return $this->Api_Middleware->response(
            $request,
            function ($Request) {
                return [[], 200];
            },
            []
        );
    }

}