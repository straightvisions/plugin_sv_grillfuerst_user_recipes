<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Products;

use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Service\Product_Import_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Service\Product_Finder_Service;

use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Products_Middleware implements Middleware_Interface {

    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private $settings;
    private Product_Import_Service $Product_Import_Service;
    private Product_Finder_Service $Product_Finder_Service;


    public function __construct(
        Api_Middleware $Api_Middleware,
        Adapter $Adapter,
        Product_Import_Service $Product_Import_Service,
        Product_Finder_Service $Product_Finder_Service,
        ContainerInterface $container
    ) {
        $this->Api_Middleware  = $Api_Middleware;
        $this->Adapter         = $Adapter;
        $this->Product_Import_Service = $Product_Import_Service;
        $this->Product_Finder_Service = $Product_Finder_Service;
        $this->settings        = $container->get('settings');

        // get product by id
        $this->Api_Middleware->add([
            'route' => '/products/(?P<id>\d+)',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_product'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/products/sync',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_sync_products'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/products/accessories',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_accessories'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/products/ingredients',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_ingredients'], 'permission_callback' => '__return_true']
        ]);

    }

    // GETTER ----------------------------------------------------------------------------
    public function rest_get_product($request) {}

    public function rest_get_accessories($request){
        return $this->Api_Middleware->response_public($request, function ($Request) {
            $results = $this->Product_Finder_Service->get_list(['filter'=>['is_food'=>0]]); //@todo replace filter when available
            return [$results, 200];
        },['client','view'], ['Cache-Control' => 'max-age=3600']);
    }

    public function rest_get_ingredients($request){
        return $this->Api_Middleware->response_public($request, function ($Request) {
            $results = $this->Product_Finder_Service->get_list(['filter'=>['is_food'=>1]]); //@todo replace filter when available
            return [$results, 200];
        },['client','view'], ['Cache-Control' => 'max-age=3600']);
    }

    // sync for cronjob
    //@todo secure this route with a token
    public function rest_sync_products($request){
        return $this->Api_Middleware->response_public($request, function ($Request) {
            $pageNum = 1;
            $lastPage = false;
            $items = [];

            while($items !== false){ // blocking
                $items = $this->get_remote_products($pageNum);
                if($items === false) break;

                $this->Product_Import_Service->import($items);
                $pageNum++;
            }

            return [['importedPages'=>$pageNum-1],200];
        });
    }

    private function get_remote_products(int $page = 1, int $entriesPerPage = 1000): mixed{
        $client  = $this->Api_Middleware->http();
        $response = $client->request(
            'POST',
            $this->settings['get_products_server_url'],
            [
                'content-type' => 'application/json',
                'headers'      => ['Authorization' => $this->settings['auth_header']],
                'json'         => ['page' => $page, 'entriesPerPage' => $entriesPerPage],
                'debug'        => false
            ]
        );

        $body        = json_decode($response->getBody(), true);
        $code        = $response->getStatusCode();
        $check       = true;

        // check response
        if(!isset($body['status']) || !isset($body['data'])){
            $check = false;
        }
        
        if($check && empty($body['data']) === true){
            $check = false;
        }
        
        if($check && empty($body['data']['products']) === true){
            $check = false;
        }
        
        if($check && $body['status'] !== 'success'){
            $check = false;
        }
        
        if($check && $code !== 200){
            $check = false;
        }
        
        return $check ? $body['data']['products'] : false;
    }

}