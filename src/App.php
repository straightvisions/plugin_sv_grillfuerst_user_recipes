<?php

namespace SV_Grillfuerst_User_Recipes;

use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Admin\Admin_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Recipes_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Media_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Products_Middleware;

final class App {

    // add new middleware here + config/container
    public function __construct(
        Api_Middleware $Api_Middleware,
        User_Middleware $User_Middleware,
        Admin_Middleware $Admin_Middleware,
        Recipes_Middleware $Recipes_Middleware,
        Media_Middleware $Media_Middleware,
        Products_Middleware $Products_Middlewaree,
    ) {}
}

