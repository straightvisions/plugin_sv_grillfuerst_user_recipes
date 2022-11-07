<?php

use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Recipes_Middleware;
use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;
use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Wordpress_Adapter;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

use function DI\create;
use function DI\autowire;

return [
    'settings' => function () {
        return require __DIR__ . '/settings.php';
    },

    // middleware
    Api_Middleware::class  => function(ContainerInterface $container){
        return new Api_Middleware();
    },
    //@todo autowire user middleware
    User_Middleware::class => function(ContainerInterface $container){
        $settings = $container->get('settings');
        $adapters = $settings['adapters'];
        $Adapter = $container->get($adapters['Shortcode']); // fake load adapter
        $Api = $container->get(Api_Middleware::class);

        return new User_Middleware($Api, $Adapter);
    },

    Recipes_Middleware::class => autowire(Recipes_Middleware::class),

    // adapters
    Adapter::class => function(ContainerInterface $container){
        return new SV_Grillfuerst_User_Recipes\Adapters\Adapter($container);
    },

    'Wordpress_Adapter' => autowire(Wordpress_Adapter::class),

    //@todo autowire query factory
    // other stuff
    Query_Factory::class => function(ContainerInterface $container){
        $settings = $container->get('settings');
        $adapters = $settings['adapters'];
        $Adapter = $container->get($adapters['Connection']);

        return new Query_Factory($Adapter);
    },

];