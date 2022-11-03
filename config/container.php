<?php

use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;

use function DI\create;

return [
    'settings' => function () {
        return require __DIR__ . '/settings.php';
    },

    'User_Middleware' => create(User_Middleware::class),
    'Api_Middleware'  => create(Api_Middleware::class),
];