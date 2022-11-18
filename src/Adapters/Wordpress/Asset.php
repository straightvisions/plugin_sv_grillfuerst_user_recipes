<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use function wp_enqueue_script;
use function wp_register_script;
use function plugin_dir_url;

final class Asset {
    private $assets = [];

    public function add(string $handle, string $src): void {
        $src = plugin_dir_url('sv-grillfuerst-user-recipes/*') . 'src/Middleware/' . $src;
        // save origin
        $this->assets[$handle] = $src;

        // wordpress specific
        wp_register_script( $handle, $src, [], '1', true);
        wp_enqueue_script( $handle, $src);
    }
}