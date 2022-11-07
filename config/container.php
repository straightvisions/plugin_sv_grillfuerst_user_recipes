<?php

use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Wordpress_Adapter;
use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;
use Psr\Container\ContainerInterface;

use function DI\create;

return [
    'settings' => function () {
        return require __DIR__ . '/settings.php';
    },

    // middleware
    Api_Middleware::class  => function(ContainerInterface $container){
        return new Api_Middleware();
    },

    User_Middleware::class => function(ContainerInterface $container){
        /*      $settings = $container->get('settings');
              $adapters = $settings['adapters'];
              $Adapter = $container->get($adapters['shortcode']); // fake load adapter
      */
        return new User_Middleware($container->get(Api_Middleware::class), $container->get(Wordpress_Adapter::class));
    },
    
    // adapters
    Wordpress_Adapter::class => function(ContainerInterface $container){
        return new Wordpress_Adapter();
    },

    // other stuff
    Query_Factory::class => function(ContainerInterface $container){
        $settings = $container->get('settings');
        $adapters = $settings['adapters'];
        $Adapter = $container->get($adapters['connection']);

        return new Query_Factory($Adapter);
    },

];