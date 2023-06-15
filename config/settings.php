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

$settings['db']['host'] = defined('DB_HOST') ? DB_HOST : 'localhost';
$settings['db']['database'] = defined('DB_NAME') ? DB_NAME : null;
$settings['db']['username'] = defined('DB_USER') ? DB_USER : null;
$settings['db']['password'] = defined('DB_PASSWORD') ? DB_PASSWORD : null;
$settings['db']['driver'] = \Cake\Database\Driver\Mysql::class;

// Path settings
$settings['root'] = dirname(__DIR__);
$settings['temp'] = $settings['root'] . '/tmp';
$settings['public'] = $settings['root'] . '/public';
$settings['template'] = $settings['root'] . '/templates';

// AUTH
$settings['basic_auth_header'] = defined('GF_USER_RECIPES_APP_BASIC_AUTH') ? GF_USER_RECIPES_APP_BASIC_AUTH : '';
$settings['bearer_auth_header'] = defined('GF_USER_RECIPES_APP_BEARER_AUTH') ? GF_USER_RECIPES_APP_BEARER_AUTH : '';
$settings['wordpress_export_auth'] = defined('GF_USER_RECIPES_WORDPRESS_EXPORT_AUTH') ? GF_USER_RECIPES_WORDPRESS_EXPORT_AUTH : ''; // format: "Basic base64String"
// combine auth headers to final header
$settings['auth_header'] = [];
$settings['auth_header'][] = $settings['basic_auth_header'] ? 'Basic ' . $settings['basic_auth_header'] : '';
$settings['auth_header'][] = $settings['bearer_auth_header'] ? 'Bearer ' . $settings['bearer_auth_header'] : '';
$settings['auth_header'] = implode(',', array_filter($settings['auth_header']));
// URLS
$settings['wordpress_domain'] = defined('GF_USER_RECIPES_APP_BASIC_AUTH') ? GF_USER_RECIPES_BASE_URL : '';
$settings['login_server_url'] = defined('GF_USER_RECIPES_LOGIN_SERVER_URL') ? GF_USER_RECIPES_LOGIN_SERVER_URL : '';
$settings['loggedin_server_url'] = defined('GF_USER_RECIPES_LOGGEDIN_SERVER_URL') ? GF_USER_RECIPES_LOGGEDIN_SERVER_URL : '';
$settings['reset_server_url'] = defined('GF_USER_RECIPES_RESET_SERVER_URL') ? GF_USER_RECIPES_RESET_SERVER_URL : '';
$settings['register_server_url'] = defined('GF_USER_RECIPES_REGISTER_SERVER_URL') ? GF_USER_RECIPES_REGISTER_SERVER_URL : '';
$settings['customer_info_server_url'] = defined('GF_USER_RECIPES_USER_INFO_SERVER_URL') ? GF_USER_RECIPES_USER_INFO_SERVER_URL : '';
$settings['voucher_create_server_url'] = defined('GF_USER_RECIPES_VOUCHER_CREATE_SERVER_URL') ? GF_USER_RECIPES_VOUCHER_CREATE_SERVER_URL : '';
$settings['voucher_check_server_url'] = defined('GF_USER_RECIPES_VOUCHER_CHECK_SERVER_URL') ? GF_USER_RECIPES_VOUCHER_CHECK_SERVER_URL : '';
$settings['get_products_server_url'] = defined('GF_USER_RECIPES_GET_PRODUCTS_URL') ? GF_USER_RECIPES_GET_PRODUCTS_URL : '';
$settings['wordpress_export_url'] = defined('GF_USER_RECIPES_WORDPRESS_EXPORT_URL') ? GF_USER_RECIPES_WORDPRESS_EXPORT_URL : '';
$settings['wordpress_export_media_url'] = defined('GF_USER_RECIPES_WORDPRESS_EXPORT_MEDIA_URL') ? GF_USER_RECIPES_WORDPRESS_EXPORT_MEDIA_URL : '';

$settings['logger'] = [
    'name' => 'app',
    'path' => $settings['root'] . '/logs',
    'filename' => 'app.log',
    'level' => \Monolog\Logger::INFO,
    'file_permission' => 0775,
];

$settings['mailer'] = [
    'mode' => defined('GF_USER_RECIPES_MAIL_MODE') ? GF_USER_RECIPES_MAIL_MODE : 'normal',
    'smtp' => [
        'type'=> '',
        'host'=> defined('GF_USER_RECIPES_MAIL_SMTP_HOST') ? GF_USER_RECIPES_MAIL_SMTP_HOST : null,
        'port'=> defined('GF_USER_RECIPES_MAIL_SMTP_PORT') ? GF_USER_RECIPES_MAIL_SMTP_PORT : null,
        'username'=> defined('GF_USER_RECIPES_MAIL_SMTP_USERNAME') ? GF_USER_RECIPES_MAIL_SMTP_USERNAME : null,
        'password'=> defined('GF_USER_RECIPES_MAIL_SMTP_PASSWORD') ? GF_USER_RECIPES_MAIL_SMTP_PASSWORD : null,
    ],
    'from' => defined('GF_USER_RECIPES_MAIL_FROM') ? GF_USER_RECIPES_MAIL_FROM : 'rezepte@grillfuerst.de',
];

return $settings;