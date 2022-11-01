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

namespace SV_Grillfuerst_User_Recipes;

// If this file is called directly, then abort execution.
if ( ! defined('ABSPATH')) {
    exit;
}

final class App {
    public function __construct() {
    }
}

$SV_Grillfuerst_User_Recipes = new App();