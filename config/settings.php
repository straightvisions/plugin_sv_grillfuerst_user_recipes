<?php
//@todo add env support + specific default + wordpress config
$settings = [
    'env' => defined('GF_USER_RECIPES_ENV') ? GF_USER_RECIPES_ENV : 'production',
    'debug' => defined('GF_USER_RECIPES_DEBUG') ? GF_USER_RECIPES_DEBUG : false,
    'adapters' => [
        // Wordpress CMS specific adapters
        'Action' => 'Wordpress_Adapter',
        'Shortcode' => 'Wordpress_Adapter',
        'Request' => 'Wordpress_Adapter',
        'Asset' => 'Wordpress_Adapter',
        'Filesystem' => 'Wordpress_Adapter',
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

// AUTH
$settings['basic_auth_header'] = GF_USER_RECIPES_APP_BASIC_AUTH;
$settings['bearer_auth_header'] = GF_USER_RECIPES_APP_BEARER_AUTH;
$settings['wordpress_export_auth'] = GF_USER_RECIPES_WORDPRESS_EXPORT_AUTH; // format: "Basic base64String"
// combine auth headers to final header
$settings['auth_header'] = [];
$settings['auth_header'][] = $settings['basic_auth_header'] ? 'Basic ' . $settings['basic_auth_header'] : '';
$settings['auth_header'][] = $settings['bearer_auth_header'] ? 'Bearer ' . $settings['bearer_auth_header'] : '';
$settings['auth_header'] = implode(',', $settings['auth_header']);
// URLS
$settings['wordpress_domain'] = GF_USER_RECIPES_BASE_URL;
$settings['login_server_url'] = GF_USER_RECIPES_LOGIN_SERVER_URL;
$settings['loggedin_server_url'] = GF_USER_RECIPES_LOGGEDIN_SERVER_URL;
$settings['reset_server_url'] = GF_USER_RECIPES_RESET_SERVER_URL;
$settings['register_server_url'] = GF_USER_RECIPES_REGISTER_SERVER_URL;
$settings['customer_info_server_url'] = GF_USER_RECIPES_USER_INFO_SERVER_URL;
$settings['voucher_create_server_url'] = GF_USER_RECIPES_VOUCHER_CREATE_SERVER_URL;
$settings['voucher_check_server_url'] = GF_USER_RECIPES_VOUCHER_CHECK_SERVER_URL;
$settings['get_products_server_url'] = GF_USER_RECIPES_GET_PRODUCTS_URL;
$settings['wordpress_export_url'] = GF_USER_RECIPES_WORDPRESS_EXPORT_URL;
$settings['wordpress_export_media_url'] = GF_USER_RECIPES_WORDPRESS_EXPORT_MEDIA_URL;

$settings['logger'] = [
    'name' => 'app',
    'path' => $settings['root'] . '/logs',
    'filename' => 'app.log',
    'level' => \Monolog\Logger::INFO,
    'file_permission' => 0775,
];

$settings['mailer'] = [
    'mode' => GF_USER_RECIPES_MAIL_MODE,
    'smtp' => [
        'type'=> '',
        'host'=> GF_USER_RECIPES_MAIL_SMTP_HOST,
        'port'=> GF_USER_RECIPES_MAIL_SMTP_PORT,
        'username'=> GF_USER_RECIPES_MAIL_SMTP_USERNAME,
        'password'=> GF_USER_RECIPES_MAIL_SMTP_PASSWORD,
    ],
    'from' => 'noreply@grillfuerst.de'
];

return $settings;