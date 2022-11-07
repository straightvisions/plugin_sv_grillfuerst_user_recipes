<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Connection;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Shortcode;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Action;

final class Adapter {
    public $query;
    public $shorcode;
    public $action;

    public function __construct(){
        $this->query = new Connection();
        $this->shortcode = new Shortcode();
        $this->action = new Action();
    }
}