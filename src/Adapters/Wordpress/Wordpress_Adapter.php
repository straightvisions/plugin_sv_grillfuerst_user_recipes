<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Action;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Connection;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Request;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Shortcode;

final class Wordpress_Adapter extends Adapter{
    public Connection $Query;
    public Request $Request;
    public Shortcode $Shortcode;
    public Action $Action;

    public function __construct(
        Request $request,
        Connection $connection,
        Shortcode $shortcode,
        Action $action
    ){
        $this->Request = $request;
        $this->Query = $connection;
        $this->Shortcode = $shortcode;
        $this->Action = $action;
    }
}