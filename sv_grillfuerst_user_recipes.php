<?php
/*
Version: 1.0.00
Plugin Name: SV Grillfuerst User Recipes
Text Domain: sv_grillfuerst_user_recipes
Description: Custom Plugin
Plugin URI: https://straightvisions.com
Author: straightvisions GmbH
Author URI: https://straightvisions.com
Domain Path: /languages
License: GPL-3.0-or-later
License URI: https://www.gnu.org/licenses/gpl-3.0-standalone.html
*/

// If this file is called directly, then abort execution.
if ( ! defined('ABSPATH')) {
    exit;
}
// activation
register_activation_hook( __FILE__, 'sv_grillfuerst_user_recipes_plugin_activation' );

function sv_grillfuerst_user_recipes_plugin_activation() {
    global $wpdb;
    $table_name = 'svgfur_recipes_products';
    // Check if the table exists
    if ($wpdb->get_var('SHOW TABLES LIKE \'' . $table_name . '\'') != $table_name) {
        // Table does not exist, create it
        $sql = 'CREATE TABLE ' . $table_name . ' (
        products_id mediumint(9) NOT NULL,
        model varchar(255) NOT NULL,
        ean varchar(255) NOT NULL,
        name varchar(255) NOT NULL, 
        brand varchar(255) NOT NULL,
        description_short text NOT NULL,
        images json NOT NULL DEFAULT \'[]\',
        link varchar(255) NOT NULL,
        PRIMARY KEY (products_id)) ' . $wpdb->get_charset_collate() . ';
        ALTER TABLE ' . $table_name . ' ADD INDEX (ean, name, brand);
        ';

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta($sql);
    }

}

// wordpress specific
add_action('init', 'sv_grillfuerst_user_recipes_rewrite_permalink_rules');

function sv_grillfuerst_user_recipes_rewrite_permalink_rules() {
    add_rewrite_rule('^user-recipes/(.+)?', 'index.php?pagename=user-recipes', 'top');
    //@todo check if this is needed for prod - might should be removed
    header('Access-Control-Allow-Origin: *');
}
/* // @todo add config based rewrite rules for wordpress
add_filter( 'generate_rewrite_rules', function ( $wp_rewrite ){
    $wp_rewrite->rules = array_merge(
        ['nutzerrezepte/(\d+)/?$' => 'index.php?dl_id=$matches[1]'],
        $wp_rewrite->rules
    );
} );*/


// namespace class autoloading
spl_autoload_register(function ($class) {
    $parts = explode('\\', $class);
    $path  = __DIR__ . '/src';

    // remove root
    unset($parts[0]);

    // form path
    foreach ($parts as $part) {
        $path .= '/' . $part;
    }

    if (file_exists($path . '.php')) {
        include $path . '.php';
    }
});

use SV_Grillfuerst_User_Recipes\Factory\Container_Factory;
use SV_Grillfuerst_User_Recipes\App;

require_once __DIR__ . '/vendor/autoload.php';

// Build DI Container instance
$SV_Grillfuerst_User_Recipes = (new Container_Factory())->createInstance();

// Create App instance
$SV_Grillfuerst_User_Recipes->get(App::class);
