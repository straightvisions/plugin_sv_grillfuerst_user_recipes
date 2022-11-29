<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;


use wp_upload_dir;
use wp_mkdir_p;
use trailingslashit;

final class Filesystem {
    private $plugin_folder = 'sv-grillfuerst-user-recipes';
    private $root = '';
    private $callbacks = [];

    public function __construct(){
        $wp_upload_dir = wp_upload_dir();

        $this->root = trailingslashit( $wp_upload_dir['basedir'] ) . $this->plugin_folder;

        // create plugin folder in wp-content uploads
        if(is_dir($this->root) === false){
            wp_mkdir_p($this->root);
        }

    }

    public function add($file): array {
        $file_array = [
            'id' => null,
            'path' => '',
            'url' => '',
            'filename' => ''
        ];

        var_dump($file);die;

        return $file_array;
    }

    public function remove($file_array) {
        $path = trailingslashit($this->root) . $file_array['path'];

        if(file_exists($path)){
            unlink($path);
        }else{
            error_log('Wordpress filesystem adapter: tried to delete file - file not found: ' . $path);
        }

    }
}