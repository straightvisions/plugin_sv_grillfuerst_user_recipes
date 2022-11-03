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

require_once __DIR__ . '/src/vendor/autoload.php';

// Build DI Container instance
$SV_Grillfuerst_User_Recipes = (new Container_Factory())->createInstance();

// Create App instance
$SV_Grillfuerst_User_Recipes->get(App::class);
