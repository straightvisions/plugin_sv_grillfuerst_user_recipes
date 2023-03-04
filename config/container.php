<?php

use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\User_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Admin\Admin_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Recipes_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Media_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Jwt\Jwt_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Email\Email_Middleware;
use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Adapters\Wordpress\Wordpress_Adapter;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;
use Cake\Database\Connection;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

use function DI\autowire;

return [
    'settings' => function () {
        return require __DIR__ . '/settings.php';
    },

    // middleware
    Api_Middleware::class => autowire(Api_Middleware::class),
    User_Middleware::class => autowire(User_Middleware::class),
    Admin_Middleware::class => autowire(Admin_Middleware::class),
    Recipes_Middleware::class => autowire(Recipes_Middleware::class),
    Media_Middleware::class => autowire(Media_Middleware::class),
    Jwt_Middleware::class => autowire(Jwt_Middleware::class),
    Transport::class => function () {
        //return Transport::fromDsn('smtp://localhost');
        return Transport::fromDsn('smtp://localhost');
    },

    Mailer::class => function (ContainerInterface $container) {
        $settings = $container->get('settings');

        if (isset($settings['mailer'])) {
            $smtp = $settings['mailer']['smtp'] ?? false;

            $dsn = $smtp ? sprintf(
                '%s://%s:%s@%s:%s',
                $smtp['type'],
                $smtp['username'],
                $smtp['password'],
                $smtp['host'],
                $smtp['port']
            ) : 'sendmail://default';
        } else {
            $dsn = 'null://null';
        }

        return new Mailer(Transport::fromDsn($dsn));
    },

    Email_Middleware::class => function (ContainerInterface $container) {
        return new Email_Middleware(
            $container->get(Mailer::class),
            $container->get(Environment::class),
            $container->get(Logger_Factory::class),
            $container
        );
    },

    Environment::class  => function (ContainerInterface $container) {
        // Set up Twig's filesystem loader
        $loader = new FilesystemLoader(__DIR__ . '/../src/Templates');
        // Add the loader to Twig's environment
        $twig = new Environment($loader);
        // Add the Symfony Bridge to Twig's environment
        $twig->addExtension(new \Twig\Extension\DebugExtension());
        return $twig;
    },

    // adapters
    Adapter::class => autowire(Adapter::class),

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