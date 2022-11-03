<?php

namespace SV_Grillfuerst_User_Recipes;

use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;

final class App {

    public function __construct() {
        // implement container stack + dispatcher here if needed later
        $Api_Middleware  = new  Api_Middleware();
        $User_Middleware = new  User_Middleware($Api_Middleware);
    }
}

