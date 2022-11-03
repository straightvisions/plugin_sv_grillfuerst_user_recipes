<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Api;

use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Action_Adapter;
use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Service\Api_Route_Service;

final class Api_Middleware implements Middleware_Interface {
    private Action_Adapter $Action_Adapter;
    private Api_Route_Service $Api_Route_Service;

    public function __construct() {
        $this->Action_Adapter = new Action_Adapter();
        $this->Action_Adapter->add('rest_api_init', [$this, 'init']);

        $this->Api_Route_Service = new Api_Route_Service();
    }

    // custom shortcode handler
    public function init(): void {
        $this->Api_Route_Service->register_routes();
    }

    public function add(array $route): void {
        $this->Api_Route_Service->add($route);
    }

    // more controller functions

}