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
        // Validate file first
        if ($this->validate($file) === false) {
            $this->_throw([], 422);
        }

        // Get file array
        $file_array = $this->prepare($file, $folder);

        // Get absolute destination path
        $path = $this->get_path($file_array['path']);

        // Create destination folder if not exist

        if(is_dir($path)){
            // Move file to destination
            move_uploaded_file($file['tmp_name'], $path . $file_array['filename']);
        }else{
            wp_mkdir_p($path);
            return $this->add($file, $folder);
        }

        return $file_array;
    }

    public function rename(string $oldPath, string $newPath){
        return !file_exists($this->get_path($newPath)) ? rename($this->get_path($oldPath), $this->get_path($newPath)) : false;
    }

    public function prepare($file, $folder, bool $skipFilename = false): array{
        $folder = sanitize_text_field($folder);

        $file_array = [
            'path' => $folder,
            'url' => trailingslashit($this->url) . trailingslashit($folder),
            'filename' => isset($file['filename']) ? sanitize_file_name($file['filename']) : sanitize_file_name($file['name'])
        ];

        // check for duplicates and rename the file if necessary -> NAME(n).EXTENSION
        $file_array['filename'] = $skipFilename ? $file_array['filename'] : $this->prepare_filename($file_array['filename'], $folder);

        // complete file url
        $file_array['url'] .= $file_array['filename'];

        return $file_array;
    }

    public function prepare_filename(string $filename, string $folder){
		//var_dump($filename);
		$filename = sanitize_file_name($filename);
	    //var_dump($filename);
		//var_dump(file_exists($this->get_path($folder) . '/' . $filename));
        if (file_exists($this->get_path($folder) . '/' . $filename)) {
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $filenameWithoutExtension = pathinfo($filename, PATHINFO_FILENAME);
            $counter = 1;
            $newFilename = $filenameWithoutExtension . $counter  . '.' . $extension;
	        //var_dump("---------------");
	        //var_dump($newFilename);
            while (file_exists($this->get_path($folder) . '/' . $newFilename)) {
                $counter++;
                $newFilename = $filenameWithoutExtension . $counter . '.' . $extension;
	            //var_dump($newFilename);
            }

            $filename = $newFilename;
        }

        return $filename;
    }

    public function remove($file_array) {
        $path = $this->root . $file_array['path'];

        if(file_exists($path)){
            unlink($path);
        }else{
            error_log('Wordpress filesystem adapter: tried to delete file - file not found: ' . $path);
        }

    }

    public function get_path(string $appendix = ''){
        $path = trailingslashit($this->root) . $appendix;
        return is_dir($path) ? trailingslashit($path) : $path; // !is_dir = file, don't add slash
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