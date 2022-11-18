<?php

use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Recipes_Middleware;
use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Wordpress_Adapter;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;
use Cake\Database\Connection;

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

    User_Middleware::class => autowire(User_Middleware::class),

    Recipes_Middleware::class => autowire(Recipes_Middleware::class),

    // adapters
    Adapter::class => function(ContainerInterface $container){
        return new SV_Grillfuerst_User_Recipes\Adapters\Adapter($container);
    },

    'Wordpress_Adapter' => autowire(Wordpress_Adapter::class),

    // factories
    Query_Factory::class => autowire(Query_Factory::class),

    Logger_Factory::class => function (ContainerInterface $container) {
        return new Logger_Factory($container->get('settings')['logger']);
    },

    // Database connection
    Connection::class => function (ContainerInterface $container) {
        return new Connection($container->get('settings')['db']);
    },

    PDO::class => function (ContainerInterface $container) {
        $db = $container->get(Connection::class);
        $driver = $db->getDriver();
        $driver->connect();

        return $driver->getConnection();
    },

];