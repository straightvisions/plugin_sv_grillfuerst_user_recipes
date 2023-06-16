<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Api;

use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Service\Api_Route_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Service\Api_Http_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Jwt\Jwt_Middleware;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

use function add_action;

final class Api_Middleware implements Middleware_Interface {
    private Api_Route_Service $Api_Route_Service;
    private Api_Http_Service $Api_Http_Service;
    private Jwt_Middleware $Jwt_Middleware;
    private $Adapter;
    private $settings;

    public function __construct(
        Adapter $Adapter,
        Jwt_Middleware $Jwt_Middleware,
        ContainerInterface $container
    ) {
        $this->settings = $container->get('settings');

        add_action('rest_api_init', [$this, 'init']); //@todo move this to an adapter
        $this->Api_Route_Service = new Api_Route_Service();
        $this->Api_Http_Service = new Api_Http_Service();
        $this->Adapter = $Adapter;
        $this->Jwt_Middleware = $Jwt_Middleware;

        \add_filter( 'rest_authentication_errors', [$this, 'allow_custom_routes']);

        if(isset($this->settings['api_key_generation']) && $this->settings['api_key_generation'] === true){
            $this->add([
                'route' => '/api/key',
                'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_api_key_generate'], 'permission_callback' => '__return_true']
            ]);
        }

    }

    public function allow_custom_routes($result){
        if(empty($result)){return $result;}
        $allowed_routes = $this->Api_Route_Service->get_list();
        $request_route = $_SERVER['REQUEST_URI'];

        //@todo extend this
        if(strpos($request_route, 'sv-grillfuerst-user-recipes') !== false){
            $result->set_status(200);
            $result->is_success = true;
            return $result;
        }

        return $result;
    }

    // custom shortcode handler
    public function add(array $route): void {
        $this->Api_Route_Service->add($route);
    }

    public function init(): void {
        $this->Api_Route_Service->register_routes();
    }

    // more controller functions
    public function http(){
        return $this->Api_Http_Service->get_client();
    }

    public function response($request, $callback, array $perms = [], array $headers = []){
        //@todo refactor to align with RFC 7807 https://tools.ietf.org/html/rfc7807
        $Request = $this->Adapter->Request()->set($request);
        $JWT = $this->Jwt_Middleware;
        $response = null;

        // validate api key // disabled for the moment, maybe we need it later
        /*if($this->validate_api_key($Request) === false){
            $response = new \WP_REST_Response(['status'=>'error', 'message'=>'X-API-KEY invalid'], 200);
        }*/

        // validate access token
        $validateRequest    = $JWT->validateRequest($Request);
        // optional validation
        $validateRole       = isset($perms[0]) && $perms[0] !== '*' ? $JWT->isRole($perms[0]) : true;
        $validateCan        = isset($perms[1]) && $perms[0] !== '*' ? $JWT->can($perms[1]) : true;
        $validateCustom     = isset($perms[2]) ? $perms[2]($Request) : true;

        if($response === null){
            if(
                $validateRequest
                && $validateRole
                && $validateCan
                && $validateCustom
            ){
                $res = (array) $callback($Request);
                $res[0] = (array) $res[0];
                $res[0]['status'] = isset($res[0]['status']) ? $res[0]['status'] : 'success';

                $response = new \WP_REST_Response($res[0], isset($res[1]) ? $res[1] : 200);

            }else{
                $response = new \WP_REST_Response(['status'=>'error', 'message'=>'Access denied'], 200);
            }
        }

        $response->set_headers(array_merge($response->get_headers(), $headers));

        return $response;
    }

    // public api route without any validation -> login route for example
    public function response_public($request, $callback){
        $Request = $this->Adapter->Request()->set($request);
        $res = (array) $callback($Request);

        $res[0]['status'] = isset($res[0]['status']) ? $res[0]['status'] : 'success';

        return new \WP_REST_Response($res[0], isset($res[1]) ? $res[1] : 200);
    }

    private function validate_api_key($Request){
        $output = false;
        $key = $Request->getHeader('X-API-KEY');

        if(isset($this->settings['api_keys']) && in_array($key, $this->settings['api_keys'])){
            $output = true;
        }

        return $output;
    }

    // dev api route
    /*
     * allowed params:
     * exp -> expiration time in seconds
     * role -> consumer | admin
     */
    public function rest_api_key_generate($request) {
        return $this->response_public($request, function ($Request) {
            $length = 32;
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $apiKey = '';

            for ($i = 0; $i < $length; $i++) {
                if ($i > 0 && $i % 6 === 0) {
                    $apiKey .= '-';
                }
                $randomIndex = random_int(0, strlen($characters) - 1);
                $apiKey .= $characters[$randomIndex];
            }

            return [['key'=>$apiKey, 'message'=>'Set this key in the X-API-KEY header for your app. The key needs to be added to the server config of the API itself.'], 200];
        });
    }

}