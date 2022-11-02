<?php

namespace SV_Grillfuerst_User_Recipes;

use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;

final class App {
    private $stack;

    public function __construct() {
        // stack is redundant - useful for migration to onion pattern
        $this->stack = [
            new  User_Middleware(),
        ];
    }
}

