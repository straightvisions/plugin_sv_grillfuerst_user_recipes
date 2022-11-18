<?php
//@todo add env support + specific default + wordpress config
$settings = [
    'adapters' => [
        // Wordpress CMS specific adapters
        'Action' => 'Wordpress_Adapter',
        'Shortcode' => 'Wordpress_Adapter',
        'Request' => 'Wordpress_Adapter',
        'Asset' => 'Wordpress_Adapter',
    ],
];

$settings['db']['host'] = DB_HOST;
$settings['db']['database'] = DB_NAME;
$settings['db']['username'] = DB_USER;
$settings['db']['password'] = DB_PASSWORD;
$settings['db']['driver'] = \Cake\Database\Driver\Mysql::class;

// Path settings
$settings['root'] = dirname(__DIR__);
$settings['temp'] = $settings['root'] . '/tmp';
$settings['public'] = $settings['root'] . '/public';
$settings['template'] = $settings['root'] . '/templates';

$settings['logger'] = [
    'name' => 'app',
    'path' => $settings['root'] . '/logs',
    'filename' => 'app.log',
    'level' => \Monolog\Logger::INFO,
    'file_permission' => 0775,
];

return $settings;