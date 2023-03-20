<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Api\Service;
use GuzzleHttp\Client;

final class Api_Http_Service {
    private $client = null;

    public function __construct(){

    }

    public function get_client(): Client {
        // create client on demand
        //@todo add base uri via env
        $this->client = new Client([
            // Base URI is used with relative requests
            //@todo add env based default
            'base_uri' => 'localhost',
            // You can set any number of default request options.
            'timeout'  => 30.0,
            'http_errors' => false,
        ]);

        // no further abstraction for now
        // @todo might abstract with interface to support http client switch?
        return $this->client;
    }

}