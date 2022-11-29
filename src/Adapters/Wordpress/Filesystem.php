<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use WP_REST_Response;
use wp_send_json;
use wp_upload_dir;
use wp_mkdir_p;
use trailingslashit;
use sanitize_file_name;
use sanitize_text_field;
use wp_handle_upload;
use get_site_url;

final class Filesystem {
    private $allowed_types = ['image'];
    private $allowed_size = 10000000; // in KB ~ 10MB
    private $plugin_folder = 'sv-grillfuerst-user-recipes';
    private $root = '';
    private $url = '';
    private $callbacks = [];

    public function __construct(){
        $wp_upload_dir = wp_upload_dir();

        $this->root = trailingslashit( $wp_upload_dir['basedir'] ) . trailingslashit( $this->plugin_folder );
        $this->url = get_site_url(null, '/wp-content/uploads/' . $this->plugin_folder);

        // create plugin folder in wp-content uploads
        if(is_dir($this->root) === false){
            wp_mkdir_p($this->root);
        }

    }

    public function add(array $file, string $folder): array {
        // validate file first
        if($this->validate($file) === false) $this->_throw([], 422);
        // get file array
        $file_array = $this->prepare($file, $folder);
        // get absolute destination path
        $path = $this->get_path($file_array['path']);
        // create destination folder(s) if not exist
        if($this->dir_exists($path) === false) wp_mkdir_p($path);
        // move file to destination
        move_uploaded_file($file['tmp_name'], $path . $file_array['filename']);

        return $file_array;
    }

    private function prepare($file, $folder): array{
        $folder = sanitize_text_field($folder);

        $file_array = [
            'path' => $folder,
            'url' => trailingslashit($this->url) . trailingslashit($folder),
            'filename' => sanitize_file_name($file['name'])
        ];

        // complete file url
        $file_array['url'] .= $file_array['filename'];

        return $file_array;
    }

    public function remove($file_array) {
        $path = $this->root . $file_array['path'];

        if(file_exists($path)){
            unlink($path);
        }else{
            error_log('Wordpress filesystem adapter: tried to delete file - file not found: ' . $path);
        }

    }

    private function get_path(string $appendix = ''){
        return trailingslashit( trailingslashit($this->root) . trailingslashit($appendix) );
    }

    public function dir_exists(string $dir): bool{
        return is_dir($this->root . $dir);
    }

    //@todo this should be a validator service, ready for unit testing
    private function validate($file){
        $valid = true;
        $type = explode('/', $file['type']);

        // check file type
        if(in_array((string)$type[0], $this->allowed_types) === false){
            $valid = false;
        }

        // check file size
        if($this->allowed_size <= (int) $file['size']){
            $valid = false;
        }

        return $valid;
    }

    private function _throw(array $errors, int $code = 500): void{
        $Response = new \WP_REST_Response($errors, $code);
        \wp_send_json($Response);
    }

}