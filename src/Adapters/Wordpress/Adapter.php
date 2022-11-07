<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Connection;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Shortcode;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Action;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Request;

final class Adapter {
    public $Query;
    public $Shorcode;
    public $Action;
    public $Request;

    public function __construct(){
        $this->Query = new Connection();
        $this->Shortcode = new Shortcode();
        $this->Action = new Action();
        $this->Request = new Request();
    }
}