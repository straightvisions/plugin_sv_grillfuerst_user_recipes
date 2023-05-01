<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use Psr\Log\LoggerInterface;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Exporter_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use Psr\Container\ContainerInterface;

final class Recipe_Exporter_Service {
    private Recipe_Repository $repository;
    private Recipe_Validator_Service $Recipe_Validator;
    private LoggerInterface $logger;
    private $uploadedMediaIDs = array();
    private $response = ['message' => '', 'status' => 400];
    private $Recipe_Finder_Service;
    private Api_Middleware $Api_Middleware;
    private $settings;

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
            $post = $this->export_data($item);
            var_dump($post);die;
            // link images to post
            $this->map_media_to_post($post);
            // Logging
            if (isset($post->id)) {
                $this->logger->info(sprintf('Recipe exported successfully: %s', $uuid));
                $this->response = ['message' => sprintf('Recipe exported successfully: %s', $uuid), 'postId' => $post->id, 'status' => 200];
            }
        }

        return $this->response;
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
        foreach ($images as $key => &$image) {
            $image->id = $this->export_media($image);
        }

        return $images;
    }

    private function export_media($image): int {
        $url = $image->url;
        $title = $image->title ?? '';
        $description = $image->description ?? '';

        if (empty($url)) {
            return 0;
        }

        $file = file_get_contents($url);
        $auth = str_replace('Basic ', '', base64_decode($this->settings['wordpress_export_auth']));

        $c = curl_init($this->settings['wordpress_domain'] . '/wp-json/wp/v2/media');
        curl_setopt($c, CURLOPT_USERPWD, $auth);
        curl_setopt($c, CURLOPT_TIMEOUT, 30);
        curl_setopt($c, CURLOPT_POST, 1);
        curl_setopt($c, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($c, CURLOPT_RETURNTRANSFER, true);

        $data = array(
            'file' => $file,
            'title' => $title,
            'description' => $description
        );

        curl_setopt($c, CURLOPT_POSTFIELDS, $data);
        curl_setopt($c, CURLOPT_HTTPHEADER, [
            'Content-Disposition: form-data; filename="' . basename($url) . '"',
            'Content-Length: ' . strlen($file)
        ]);

        $r = (object) json_decode(curl_exec($c));
        curl_close($c);

        // Logging
        if (property_exists($r, 'id')) {
            $this->logger->info(sprintf('Media exported successfully: %s', $url));
            $this->uploadedMediaIDs[] = $r->id;
        }

        return property_exists($r,'id') ? $r->id : 0;
    }


    private function export_data(Recipe_Exporter_Item $item){

        // REST Post Array
        $payload = [
            'title'           => $item->get('title'),
            'status'          => 'publish',
            'content'         => '<!-- wp:acf/sv-grillfuerst-custom-recipe-steps {"name":"acf/sv-grillfuerst-custom-recipe-steps","mode":"preview"} /-->',
            'excerpt'         => $item->get('excerpt'),
            'featured_media'  => $this->export_media($item->get('featured_image')),
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

        $body = json_decode($response->getBody(), true);
        $code = $response->getStatusCode();

        return [
            'body'=>$body,
            'status'=>$code,
            'errors'=> [] // implement errors here
        ];
    }

    private function map_media_to_post($post) {
        // no data
        if (count($this->uploadedMediaIDs) === 0) return;
        // broken post
        if(isset($post->id)) return;
        // map
        foreach ($this->uploadedMediaIDs as $ID) {
            // REST Media Array
            $d = json_encode([
                'post' => $post->id,
            ]);

            //hotfix for curl - remove after API Client implementation here
            $auth = str_replace('Basic ', '', base64_decode($this->settings['wordpress_export_auth']));

            $c = curl_init($this->settings['wordpress_domain'] . '/wp-json/wp/v2/media/' . $ID);
            curl_setopt($c, CURLOPT_USERPWD, $auth);
            curl_setopt($c, CURLOPT_TIMEOUT, 30);
            curl_setopt($c, CURLOPT_POST, 1);
            curl_setopt($c, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($c, CURLOPT_RETURNTRANSFER, true);

            curl_setopt($c, CURLOPT_POSTFIELDS, $d);
            curl_setopt($c, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($d)
            ]);

            $r = json_decode(curl_exec($c));
            curl_close($c);
        }
    }
}
