<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Api;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Service\Api_Route_Service;

use function add_action;

final class Api_Middleware implements Middleware_Interface {
    //private Action_Adapter $Action_Adapter;
    private Api_Route_Service $Api_Route_Service;

    public function __construct(
        //Action_Adapter $Action_Adapter
    ) {
        //$this->Action_Adapter = $Action_Adapter;
        //$this->Action_Adapter->add('rest_api_init', [$this, 'init']);

        add_action('rest_api_init', [$this, 'init']);

        $this->Api_Route_Service = new Api_Route_Service();
    }

    // custom shortcode handler

    public function add(array $route): void {
        $this->Api_Route_Service->add($route);
    }

    public function init(): void {
        $this->Api_Route_Service->register_routes();
    }

    // more controller functions

}