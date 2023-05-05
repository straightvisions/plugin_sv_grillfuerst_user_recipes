<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use Psr\Log\LoggerInterface;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Exporter_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use Psr\Container\ContainerInterface;

//@todo this heavily relies on wordpress, so we need to refactor this to be more generic and add an adapter layer to it

final class Recipe_Exporter_Service {
    private Recipe_Repository $repository;
    private Recipe_Validator_Service $Recipe_Validator;
    private LoggerInterface $logger;
    private $uploadedMediaIDs = array();
    private $response = ['message' => '', 'status' => 400];
    private $Recipe_Finder_Service;
    private Api_Middleware $Api_Middleware;
    private $settings;
    private $_errors = [];

    public function __construct(
        Recipe_Repository $repository,
        Recipe_Validator_Service $Recipe_Validator,
        Recipe_Finder_Service $Recipe_Finder_Service,
        Logger_Factory $Logger_Factory,
        Api_Middleware $Api_Middleware,
        ContainerInterface $container
    ) {
        $this->repository            = $repository;
        $this->Recipe_Validator      = $Recipe_Validator;
        $this->Recipe_Finder_Service = $Recipe_Finder_Service;
        $this->logger                = $Logger_Factory
            ->addFileHandler('user_updater.log')
            ->createLogger();
        $this->Api_Middleware = $Api_Middleware;
        $this->settings = $container->get('settings');
    }

    // controller fn -----------------------------------------------
    // controller fn -----------------------------------------------
    // controller fn -----------------------------------------------
    public function export(int $uuid): array {
        if($this->check_config()){
            $item = $this->get_data($uuid);

            // export images
            foreach ($item->steps as $key => &$step) {
                $step->images = $this->export_images($step->images);
            }

            // export data
            $res_post = $this->export_data($item);

            $post = $res_post['errors'] ? null : $res_post['body'];
            // link images to post
            $this->map_media_to_post($post);
            // Logging
            if ($this->errors()) {
                $this->logger->info(sprintf('Recipe exported successfully: %s', $uuid));
                $this->response = ['message' => sprintf('Recipe exported successfully: %s', $uuid), 'postId' => $post->id, 'status' => 200];
            }
        }

        $this->logger->info(implode("\n\r", $this->errors()));

        return ['message' => $this->errors() ? sprintf('Recipe exported with errors: %s', $uuid) : sprintf('Recipe exported successfully: %s', $uuid),
                'postId' => $post ?? 0,
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

    private function export_images(array $images): array {
        // remove empty images
        $_images = [];

            foreach ($images as $key => $image) {
                $res = $this->export_media($image);
                if($this->is_ok($res)){
                    $_images[] = $image;
                }
            }

        return $_images;
    }

    private function export_media($image){
        $res = [
            'body'=> '',
            'status'=> 400, //@todo check if any better code available
            'errors'=> [] // implement errors here
        ];

        if(empty($image->url)) {
            $res['errors'][] = sprintf('Error uploading image - no image url: %s', $image->id ?? 0);
        }else{

            $client = $this->Api_Middleware->http();
            $file = file_get_contents($image->url);

            $response = $client->request(
                'POST',
                $this->settings['wordpress_export_media_url'],
                [
                    'multipart' => [
                        [
                            'name' => 'file',
                            'contents' => $file,
                            'filename' => basename($image->url)
                        ]
                    ],
                    'headers'      => ['Authorization' => $this->settings['wordpress_export_auth']],
                    'debug'        => false
                ]
            );

            $res['body'] = json_decode($response->getBody(), true);
            $res['status'] = $response->getStatusCode();

            if($this->is_ok($res)){
                $image->id = $res['body']['id'];
                $image->url = $res['body']['source_url'];
                // add to array of uploaded media
                $this->uploadedMediaIDs[] = $image->id;
            }else{
                $res['errors'][] = sprintf('Error uploading image: %s', $image->url);
            }
        }

        $this->errors($res['errors']);

        return $res;
    }

    private function export_data(Recipe_Exporter_Item $item){
        // REST Post Array
        $feat_image = $item->get('featured_image');
        $feat_image_res = $this->export_media($feat_image);
        /*
        echo "item";
var_dump($item);
echo "-------------------- data -...........";
var_dump(['preparation_time' => $item->get('preparation_time'),
          'cooking_time'     => $item->get('cooking_time'),
          'waiting_time'     => $item->get('waiting_time'),
          'difficulty'       => $item->get('difficulty'),
          'ingredients'      => $item->get('ingredients'),
          'accessories'      => $item->get('accessories'),
          'steps'            => $item->get('steps'),]);die;*/
        $payload = [
            'title'           => $item->get('title'),
            'status'          => 'publish',
            'content'         => '<!-- wp:acf/sv-grillfuerst-custom-recipe-steps {"name":"acf/sv-grillfuerst-custom-recipe-steps","mode":"preview"} /-->',
            'excerpt'         => $item->get('excerpt'),
            'featured_media'  => $this->is_ok($feat_image_res) ? $feat_image_res['body']['id'] : 0,
            'cp_menutype'     => $item->get('menu_type'),
            'cp_kitchenstyle' => $item->get('kitchen_style'),
            'acf'             => [
                'preparation_time' => $item->get('preparation_time'),
                'cooking_time'     => $item->get('cooking_time'),
                'waiting_time'     => $item->get('waiting_time'),
                'difficulty'       => $item->get('difficulty'),
                'ingredients'      => $item->get('ingredients'),
                'accessories'      => $item->get('accessories'),
                'steps'            => $item->get('steps'),
                'gf_user_recipe'   => [
                    'gf_user_recipe_uuid'    => $item->get('uuid'),
                    'gf_user_recipe_user_id' => $item->get('user_id')
                ]
            ]
        ];

        $client = $this->Api_Middleware->http();

        $response = $client->request(
            'POST',
            $this->settings['wordpress_export_url'],
            [
                'content-type' => 'application/json',
                'json'         => $payload, // don't encode manually, client does it for us
                'headers'      => ['Authorization' => $this->settings['wordpress_export_auth']],
                'debug'        => false
            ]
        );

        $res = [
            'body'=> (object) json_decode($response->getBody(), true),
            'status'=>$response->getStatusCode(),
            'errors'=> []
        ];

        if(!isset($res['body']->id)){
            $res['errors'][] = 'Error exporting recipe - no post id';
        }

        $this->errors($res['errors']);

        return $res;
    }

    private function map_media_to_post($post): array {
        $res = [
            'body'=> '',
            'status'=> 200,
            'errors'=> [] // implement errors here
        ];

        // Broken post
        if (!$post || !isset($post->id) || !$post->id) {
            $res['status'] = 400;
            $res['errors'][] = 'Error mapping media to post - no post id';
        }else{
            // Map
            foreach ($this->uploadedMediaIDs as $ID) {
                // REST Media Array
                $payload = [
                    'post' => $post->id,
                ];

                // Make the request
                $client = $this->Api_Middleware->http();

                $response = $client->request(
                    'POST',
                    $this->settings['wordpress_export_media_url'] . '/' . $ID,
                    [
                        'content-type' => 'application/json',
                        'json'         => $payload, // don't encode manually, client does it for us
                        'headers'      => ['Authorization' => $this->settings['wordpress_export_auth']],
                        'debug'        => false
                    ]
                );

                // Handle the response
                $loop_res = [
                    'body'=> json_decode($response->getBody(), true),
                    'status'=> $response->getStatusCode(),
                    //'errors'=> []
                ];

                // Handle errors (if any)
                if (!$this->is_ok($loop_res)) {
                    $res['errors'][] = sprintf('Error linking media to post: %s', $loop_res['body']['message']);
                }
            }
        }

        $this->errors($res['errors']);

        return $res;
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
