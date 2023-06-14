<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use function wp_enqueue_script;
use function wp_register_script;
use function wp_localize_script;
use function plugin_dir_url;

final class Asset {
    private $assets = [];

    public function add(string $handle, string $src, array $localize = []): void {
        $path = getcwd() . '/wp-content/plugins/' . plugin_dir_path('sv-grillfuerst-user-recipes/*') . 'src/Middleware/' . $src;
        $src = plugin_dir_url('sv-grillfuerst-user-recipes/*') . 'src/Middleware/' . $src;

        // save origin
        $this->assets[$handle] = $src;
        // wordpress specific
        wp_enqueue_script( $handle, $src, [], filemtime( $path ), true);

        if($localize){
            foreach($localize as $key => $script){
                wp_localize_script($handle, $handle.'_'.$key, $script);
            }

        }
    }
}