<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User\Service;

use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Jwt\Jwt_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\Data\User_Read_Item;


final class User_Info_Service {
    private Jwt_Middleware $Jwt_Middleware;
    private Api_Middleware $Api_Middleware;
    private $settings;

    public function __construct(
        Api_Middleware $Api_Middleware,
        Jwt_Middleware $Jwt_Middleware,
        ContainerInterface $container
    ) {
        $this->settings = $container->get('settings');
        $this->Api_Middleware = $Api_Middleware;
        $this->Jwt_Middleware = $Jwt_Middleware;

    }

    public function get(int $user_id, bool $trusted = false) {
        // token must be set beforehand
        $client = $this->Api_Middleware->http();

        $response = $client->request('POST',
            $this->settings['customer_info_server_url'] ,
            [
                'content-type' => 'application/json',
                'json' => ['customerId'=>$user_id],
                'headers' => ['Authorization' => $this->settings['auth_header']],
                'debug'=>false
            ]);

        $body = json_decode($response->getBody(), true);

        $code = $response->getStatusCode();
        $body['isLoggedIn'] = true;
        $body['userId'] = $user_id;

        // @todo implement a model
        $body_data = isset($body['data']) ? $body['data'] : null;

        // map data to meet frontend user model
        if($body_data){
            $data = [];
            $data['firstname'] = isset($body_data['customers_firstname']) ? $body_data['customers_firstname'] : '';
            $data['lastname'] = isset($body_data['customers_lastname']) ? $body_data['customers_lastname'] : '';
            $data['username'] = isset($body_data['customer_username']) ? $body_data['customer_username'] : '';
            $data['gender'] = isset($body_data['customers_gender']) ? $body_data['customers_gender'] : '';
            $data['avatar'] = isset($body_data['customers_avatar']) ? $body_data['customers_avatar'] : '';
            $body['salutation'] = '';
            // SECRET DATA ONLY FOR BACKEND PROCESSING
            if($trusted === true){
                $data['email'] = $body_data['customers_email_address'];
            }

            switch($data['gender']){
                case 'm': $data['salutation'] = 'Herr'; break;
                case 'f': $data['salutation'] = 'Frau'; break;
                case 'c': $data['salutation'] = ''; break;
            }

            // remove all unnecessary and private user info
            $body['data'] = $data;
        }

        // id = 0 returns an error from remote, we have to compensate that
        if(isset($body['status']) && $body['status'] === 'error'){
            $body['status'] = 'success';
            $body['isLoggedIn'] = false;
        }

       return ['body'=>$body, 'status' => $code];
    }

    public function get_raw(int $user_id, bool $trusted = false){
        $response = $this->get($user_id, $trusted);
        return $response['status'] === 200 || $response['status'] === 201 ? $response['body']['data'] : null;
    }

    public function validate_user_meta($d, $id){
        // check if set
        if(!isset($d['user_meta'])) return $this->get_raw($id, true) ?? [];
        // check if string
        if(is_string($d['user_meta'])) return $this->get_from_string($d['user_meta'], $id) ?? [];

        return $this->assign_data($d['user_meta']);
    }

    private function get_from_string(string $d, int $id = 0){
        $json = json_decode($d, true);
        if (!$json) {
            return $this->get_raw($id, true) ?? [];
        }

        return $json;
    }

    private function assign_data(array $d){
        $model = new User_Read_Item();
        foreach($model as $key => $value){
            if(isset($d[$key])){
                $model->$key = $d[$key];
            }
        }

        return (array)$model;
    }

}