<?php
/*
Version: 2.0.00
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
    if ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") != $table_name) {
        // Table does not exist, create it
        $sql = "
        CREATE TABLE {$table_name} (
            products_id mediumint(9) NOT NULL,
            model varchar(255) NOT NULL,
            ean varchar(255) NOT NULL,
            name varchar(255) NOT NULL, 
            brand varchar(255) NOT NULL,
            description_short text NOT NULL,
            images json NOT NULL DEFAULT '[]',
            link varchar(255) NOT NULL,
            is_food int(1) NOT NULL DEFAULT 0,
            PRIMARY KEY (products_id)
        ) {$wpdb->get_charset_collate()};
        ";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        $wpdb->query($sql);
    }

    $table_name = 'svgfur_recipes_recipes';
    if ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") != $table_name) {
        // Table does not exist, create it
        $sql = "
        CREATE TABLE {$table_name} (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            uuid int(11) UNSIGNED NOT NULL,
            user_id bigint(20) UNSIGNED NOT NULL,
            user_meta longtext NOT NULL DEFAULT '{}',
            title varchar(256) NOT NULL,
            state enum('draft','review_pending','reviewed','published') NOT NULL DEFAULT 'draft',
            link text NOT NULL,
            voucher varchar(256) NOT NULL,
            excerpt text NOT NULL,
            servings int(5) NOT NULL DEFAULT 4,
            featured_image longtext NOT NULL DEFAULT '{}',
            menu_type longtext NOT NULL DEFAULT '[]',
            kitchen_style longtext NOT NULL DEFAULT '[]',
            difficulty varchar(20) NOT NULL DEFAULT 'easy',
            preparation_time int(5) NOT NULL DEFAULT 0,
            cooking_time int(5) NOT NULL DEFAULT 0,
            waiting_time int(5) NOT NULL DEFAULT 0,
            ingredients longtext NOT NULL DEFAULT '[]',
            ingredients_custom_wish text NOT NULL,
            accessories longtext NOT NULL DEFAULT '[]',
            steps longtext NOT NULL DEFAULT '[]',
            newsletter tinyint(1) NOT NULL DEFAULT 0,
            feedback longtext NOT NULL DEFAULT '[]',
            legal_rights tinyint(1) NOT NULL DEFAULT 0,
            created timestamp NOT NULL DEFAULT current_timestamp(),
            edited timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
            PRIMARY KEY (id),
            UNIQUE KEY uuid (uuid)
        ) {$wpdb->get_charset_collate()};
        ";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        $wpdb->query($sql);
    }

}

// wordpress specific
add_action('init', 'sv_grillfuerst_user_recipes_rewrite_permalink_rules');

function sv_grillfuerst_user_recipes_rewrite_permalink_rules() {
    add_rewrite_rule('^user-recipes/(.+)?', 'index.php?pagename=user-recipes', 'top');
    //@todo check if this is needed for prod - might should be removed
    header('Access-Control-Allow-Origin: *');
}

// routing
function custom_rewrite_rules() {
    add_rewrite_rule(
        '^community-rezepte/edit/([0-9]+)/?$',
        'index.php?pagename=community-rezepte',
        'top'
    );

    add_rewrite_rule(
        '^community-rezepte/register?$',
        'index.php?pagename=community-rezepte',
        'top'
    );

    add_rewrite_rule(
        '^community-rezepte/reset?$',
        'index.php?pagename=community-rezepte',
        'top'
    );

    add_rewrite_rule(
        '^community-rezepte/admin/edit/([0-9]+)/?$',
        'index.php?pagename=admin',
        'top'
    );
}
add_action('init', 'custom_rewrite_rules');



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
