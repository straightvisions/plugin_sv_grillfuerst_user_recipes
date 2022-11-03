<?php

namespace SV_Grillfuerst_User_Recipes;

use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;


final class App {

    public function __construct(
        Api_Middleware $Api_Middleware,
        User_Middleware $User_Middleware
    ) {}
}

