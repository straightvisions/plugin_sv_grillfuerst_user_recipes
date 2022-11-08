<?php
//@todo add env support + specific default + wordpress config
$settings = [
    'adapters' => [
        // Wordpress CMS specific adapters
        'Action' => 'Wordpress_Adapter',
        'Shortcode' => 'Wordpress_Adapter',
        'Request' => 'Wordpress_Adapter',
    ],
];

$settings['db']['host'] = DB_HOST;
$settings['db']['database'] = DB_NAME;
$settings['db']['username'] = DB_USER;
$settings['db']['password'] = DB_PASSWORD;
$settings['db']['driver'] = \Cake\Database\Driver\Mysql::class;

return $settings;