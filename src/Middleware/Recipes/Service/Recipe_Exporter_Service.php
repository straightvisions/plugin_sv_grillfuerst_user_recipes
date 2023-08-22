<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use Psr\Log\LoggerInterface;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Exporter_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Info_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Service\Media_Export_Service;
use Psr\Container\ContainerInterface;

//@todo this heavily relies on wordpress, so we need to refactor this to be more generic and add an adapter layer to it

final class Recipe_Exporter_Service {
    private Recipe_Repository $repository;
    private Recipe_Validator_Service $Recipe_Validator;
    private LoggerInterface $logger;
    private $uploadedMediaIDs = array();
    private $uploadedMediaMeta = array();
    private $response = ['message' => '', 'status' => 400];
    private $Recipe_Finder_Service;
    private Api_Middleware $Api_Middleware;
    private Media_Export_Service $Media_Export_Service;
    private $settings;
    private $_errors = [];

    public function __construct(
        Recipe_Repository $repository,
        Recipe_Validator_Service $Recipe_Validator,
        Recipe_Finder_Service $Recipe_Finder_Service,
        Logger_Factory $Logger_Factory,
        Api_Middleware $Api_Middleware,
        User_Info_Service $User_Info_Service,
        Media_Export_Service $Media_Export_service,
        ContainerInterface $container
    ) {
        $this->repository            = $repository;
        $this->Recipe_Validator      = $Recipe_Validator;
        $this->Recipe_Finder_Service = $Recipe_Finder_Service;
        $this->User_Info_Service     = $User_Info_Service;
        $this->logger                = $Logger_Factory
            ->addFileHandler('user_updater.log')
            ->createLogger();
        $this->Api_Middleware = $Api_Middleware;
        $this->Media_Export_Service = $Media_Export_service;
        $this->settings = $container->get('settings');

    }

    // controller fn -----------------------------------------------
    // controller fn -----------------------------------------------
    // controller fn -----------------------------------------------
    public function export(int $uuid): array {
        $post = null;

        if($this->check_config()){
            $item = $this->get_data($uuid);

            // export images
            foreach ($item->steps as $key => &$step) {
                $step->images = $this->Media_Export_Service->export_files($step->images); // list of ids
            }

            // export data
            $post = $this->export_data($item);

            // assign data to post if no errors
            if($post) $this->Media_Export_Service->link($post->ID, $this->uploadedMediaIDs);

            // Logging
            if ($this->errors()) {
                $this->logger->info(sprintf('Recipe exported successfully: %s', $uuid));
                $this->response = ['message' => sprintf('Recipe exported successfully: %s', $uuid), 'postId' => $post->ID, 'status' => 200];
            }
        }

        $this->logger->info(implode("\n\r", $this->errors()));

        return ['message' => $this->errors() ? sprintf('Recipe exported with errors: %s', $uuid) : sprintf('Recipe exported successfully: %s', $uuid),
                'post' => $post ?? null,
                'status' => $post ? 200 : 400,
                'errors' => $this->errors()
        ];
    }
    // controller fn -----------------------------------------------
    // controller fn -----------------------------------------------
    // controller fn -----------------------------------------------

    // process fns -----------------------------------------------
    private function check_config(): bool{
        if ( empty($this->settings['wordpress_export_url']) ) {#
            $this->response = ['message' => 'Config error - base url missing.', 'status' => 500];
            return false;
        }

        if ( empty($this->settings['wordpress_export_auth']) ) {
            $this->response = ['message' => 'Config error - recipes auth not set.', 'status' => 401];
            return false;
        }

        return true;
    }

    private function get_data(int $uuid){
        return $this->Recipe_Finder_Service->getRaw($uuid, true);
    }

    // @todo abstract this function with a new POST or DATA adapter
    private function export_data(Recipe_Exporter_Item $item) : mixed{
        $errors = [];
        // REST Post Array
        $feat_image = $item->get('featured_image');
        $feat_image_id = $this->Media_Export_Service->export_file($feat_image); // id|false

        $user = $this->User_Info_Service->get_raw($item->get('user_id'), true);

        $author = [
            'user_id'=>$item->get('user_id'),
            'username'=> $user ? $user['username'] : '',
            'firstname'=> $user ? $user['firstname'] : '',
            'lastname'=> $user ? $user['lastname'] : '',
            'voucher'=>$item->get('voucher'),
        ];

        $data = [
            'post_title'   => $item->get('title'),
            'post_status'  => 'publish',
            'post_content' => '<!-- wp:acf/sv-grillfuerst-custom-recipe-steps {"name":"acf/sv-grillfuerst-custom-recipe-steps","mode":"preview"} /-->',
            'post_excerpt' => $item->get('excerpt'),
            'post_type'    => 'grillrezepte',
            'meta_input'   => [] // non custom metas
        ];

        $metas = [ // Meta fields
            'cp_menutype'     => $item->get('menu_type'),
            'cp_kitchenstyle' => $item->get('kitchen_style'),
           // 'cp_source'       => [(int)$this->get_community_taxonomy_id()],
            'preparation_time' => $item->get('preparation_time'),
            'cooking_time'     => $item->get('cooking_time'),
            'waiting_time'     => $item->get('waiting_time'),
            'difficulty'       => $item->get('difficulty'),
            'ingredients'      => $item->get('ingredients'),
            'accessories'      => $item->get('accessories'),
            'steps'            => $item->get('steps'),
            'gf_community_recipe_is' => '1',
            'gf_community_recipe'   => [
                'uuid'    => $item->get('uuid'),
                'user_id' => $author['user_id'],
                'firstname' => $author['firstname'],
                'lastname' => $author['lastname'],
                'username' => $author['username'],
                'voucher' => $author['voucher'],
            ]
        ];

        $post_id = \wp_insert_post($data);
        $post = \get_post($post_id);
        
        if($post){
            // add feat image
            if($feat_image_id) \set_post_thumbnail( $post_id, $feat_image_id);

            // add metas
            foreach($metas as $key => $val){
                \update_field($key, $val, $post_id);
            }

            // add taxonomy
            \wp_set_object_terms($post_id, [$this->get_community_taxonomy_id()], 'cp_source');
        }else{
            $errors[] = 'Error exporting recipe - no post id';
        }

        $this->errors($errors);

        return empty($errors) ? $post : null;
    }

    //@todo refactor this function
    public function get_community_taxonomy_id(){
        return defined('GF_USER_RECIPES_TAXONOMY_ID') ? GF_USER_RECIPES_TAXONOMY_ID : 0;
    }

    private function errors(array $err = []): array{
        if(!empty($err)){
            $this->_errors = array_merge($this->_errors, $err);
        }

        return $this->_errors;
    }

    private function is_ok($res): bool{
        return $res['status'] >= 200 && $res['status'] <= 299;
    }

}
