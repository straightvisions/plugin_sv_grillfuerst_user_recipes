<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Action;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Request;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Shortcode;

final class Wordpress_Adapter{
    public Request $Request;
    public Shortcode $Shortcode;
    public Action $Action;
    public Asset $Asset;

    public function __construct(
        Request $request,
        Shortcode $shortcode,
        Action $action,
        Asset $asset
    ){
        $this->Request = $request;
        $this->Shortcode = $shortcode;
        $this->Action = $action;
        $this->Asset = $asset;
    }
}