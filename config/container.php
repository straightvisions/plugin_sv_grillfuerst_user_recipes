<?php

use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;

use function DI\create;

return [
    'User_Middleware' => create(User_Middleware::class),
    'Api_Middleware' => create(Api_Middleware::class),
    'Adapter_Middleware' => create(Adapter_Middleware::class),
];