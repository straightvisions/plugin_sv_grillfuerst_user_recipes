<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes;

use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;
use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Email\Email_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Jwt\Jwt_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Creator_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Exporter_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Ingredients_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Kitchen_Styles_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Menu_Types_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Updater_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Voucher_Service;
use SV_Grillfuerst_User_Recipes\Middleware\User\Service\User_Info_Service;

final class Recipes_Middleware implements Middleware_Interface {
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private Recipe_Finder_Service $Recipe_Finder_Service;
    private Recipe_Creator_Service $Recipe_Creator_Service;
    private Recipe_Updater_Service $Recipe_Updater_Service;
    private Recipe_Exporter_Service $Recipe_Exporter_Service;
    private Recipe_Voucher_Service $Recipe_Voucher_Service;
    private Recipe_Kitchen_Styles_Finder_Service $Recipe_Kitchen_Styles_Finder_Service;
    private Recipe_Menu_Types_Finder_Service $Recipe_Menu_Types_Finder_Service;
    private Jwt_Middleware $Jwt_Middleware;
    private Email_Middleware $Email_Middleware;
    private User_Info_Service $User_Info_Service;
    private $settings;

    public function __construct(
        Api_Middleware $Api_Middleware,
        Adapter $Adapter,
        Recipe_Finder_Service $Recipe_Finder_Service,
        Recipe_Creator_Service $Recipe_Creator_Service,
        Recipe_Updater_Service $Recipe_Updater_Service,
        Recipe_Ingredients_Finder_Service $Recipe_Ingredients_Finder_Service,
        Recipe_Kitchen_Styles_Finder_Service $Recipe_Kitchen_Styles_Finder_Service,
        Recipe_Menu_Types_Finder_Service $Recipe_Menu_Types_Finder_Service,
        Recipe_Exporter_Service $Recipe_Exporter_Service,
        Recipe_Voucher_Service $Recipe_Voucher_Service,
        Jwt_Middleware $Jwt_Middleware,
        Email_Middleware $Email_Middleware,
        User_Info_Service $User_Info_Service,
        ContainerInterface $container

    ) {
        $this->Api_Middleware                       = $Api_Middleware;
        $this->Adapter                              = $Adapter;
        $this->Recipe_Finder_Service                = $Recipe_Finder_Service;
        $this->Recipe_Creator_Service               = $Recipe_Creator_Service;
        $this->Recipe_Updater_Service               = $Recipe_Updater_Service;
        $this->Recipe_Kitchen_Styles_Finder_Service = $Recipe_Kitchen_Styles_Finder_Service;
        $this->Recipe_Menu_Types_Finder_Service     = $Recipe_Menu_Types_Finder_Service;
        $this->Recipe_Ingredients_Finder_Service    = $Recipe_Ingredients_Finder_Service;
        $this->Recipe_Exporter_Service              = $Recipe_Exporter_Service;
        $this->Recipe_Voucher_Service               = $Recipe_Voucher_Service;
        $this->Jwt_Middleware                       = $Jwt_Middleware;
        $this->Email_Middleware                     = $Email_Middleware;
        $this->User_Info_Service                    = $User_Info_Service;
        $this->settings                             = $container->get('settings');

        // https://github.com/straightvisions/plugin_sv_appointment/blob/master/lib/modules/api.php
        // @todo add permissions
        // https://developer.wordpress.org/rest-api/extending-the-rest-api/routes-and-endpoints/#permissions-callback
        //
        //

        // GET ALL RECIPES
        $this->Api_Middleware->add([
            'route' => '/recipes',
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_recipes'], 'permission_callback' => '__return_true']
        ]);

        // GET / UPDATE A SPECIFIC RECIPE
        $this->Api_Middleware->add([
            'route' => '/recipes/(?P<uuid>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET, PUT', 'callback' => [$this, 'route_recipes_uuid'], 'permission_callback' => '__return_true']
        ]);

        $this->Api_Middleware->add([
            'route' => '/recipes/(?P<uuid>\d+)/feedback', // wordpress specific
            'args'  => ['methods' => 'PUT', 'callback' => [$this, 'rest_update_recipe_feedback'], 'permission_callback' => '__return_true']
        ]);

        // GET / CREATE RECIPES BASED ON USER ID
        $this->Api_Middleware->add([
            'route' => '/recipes/user/(?P<user_id>\d+)', // wordpress specific
            'args'  => ['methods' => 'GET, POST', 'callback' => [$this, 'route_recipes_user_id'], 'permission_callback' => '__return_true']
        ]);

        // Ingredients
        $this->Api_Middleware->add([
            'route' => '/recipes/ingredients', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_ingredients'], 'permission_callback' => '__return_true']
        ]);

        // Menu Types
        $this->Api_Middleware->add([
            'route' => '/recipes/menutypes', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_menu_types'], 'permission_callback' => '__return_true']
        ]);

        // Kitchen Styles
        $this->Api_Middleware->add([
            'route' => '/recipes/kitchenstyles', // wordpress specific
            'args'  => ['methods' => 'GET', 'callback' => [$this, 'rest_get_kitchen_styles'], 'permission_callback' => '__return_true']
        ]);

        // Export
        // GET / CREATE RECIPES BASED ON USER ID
        $this->Api_Middleware->add([
            'route' => '/recipes/(?P<uuid>\d+)/export', // wordpress specific
            'args'  => ['methods' => 'PUT', 'callback' => [$this, 'rest_recipe_export'], 'permission_callback' => '__return_true']
        ]);

        // Test
        if($this->settings['debug'] === true || $this->settings['env'] === 'development'){
            $this->Api_Middleware->add([
                'route' => '/test/email', // wordpress specific
                'args'  => ['methods' => 'GET', 'callback' => [$this, 'test_send_email_recipe_published'], 'permission_callback' => '__return_true']
            ]);

            $this->Api_Middleware->add([
                'route' => '/test/voucher', // wordpress specific
                'args'  => ['methods' => 'GET', 'callback' => [$this, 'test_create_voucher'], 'permission_callback' => '__return_true']
            ]);

            $this->Api_Middleware->add([
                'route' => '/test/voucher/check', // wordpress specific
                'args'  => ['methods' => 'GET', 'callback' => [$this, 'test_check_voucher'], 'permission_callback' => '__return_true']
            ]);

            $this->Api_Middleware->add([
                'route' => '/test/user/info', // wordpress specific
                'args'  => ['methods' => 'GET', 'callback' => [$this, 'test_get_user_info'], 'permission_callback' => '__return_true']
            ]);
        }

    }

    // ROUTER ----------------------------------------------------------------------------
    public function route_recipes_user_id($request) {
        $Request = $this->Adapter->Request()->set($request);

        switch ($Request->getMethod()) {
            case 'POST' :
                return $this->rest_create_recipe($request);
            case 'PUT' :
                return $this->rest_update_recipe($request);
            case 'GET' :
                return $this->rest_get_recipes_by_user_id($request);
        }

        return [];
    }

    public function rest_create_recipe($request) {
        return $this->Api_Middleware->response(
            $request,
            function ($Request) {
                $user_id = $Request->getAttribute('user_id');
                $data    = $Request->getJSONParams();

                $recipe_uuid = $this->Recipe_Creator_Service->insert($data, $user_id);
                $results     = $this->Recipe_Finder_Service->get($recipe_uuid, $user_id);
                $results     = $results->items[0]; //hotfix // @todo replace the results with ReaderService

                return [$results, 200];
            },
            [
                'customer',
                'edit',
                fn($Request) => (int)$Request->getAttribute('user_id') === (int)$this->Jwt_Middleware->getValue(
                        'userId'
                    )
            ]
        );
    }

    public function rest_update_recipe($request) {
        return $this->Api_Middleware->response(
            $request,
            function ($Request) {
                $uuid = $Request->getAttribute('uuid');
                $data = $Request->getJSONParams();

                if (is_array($data) && empty($data) === false) {
                    $this->Recipe_Updater_Service->update($data, $uuid);
                }

                return [[], 200];
            },
            [
                'customer',
                'edit',
                fn($Request) => $this->Jwt_Middleware->isRole('admin') || (int)$Request->getAttribute(
                        'user_id'
                    ) === (int)$this->Jwt_Middleware->getValue('userId')
            ]
        );
    }

    public function rest_update_recipe_feedback($request) {
        $Request = $this->Adapter->Request()->set($request);
        $uuid    = $Request->getAttribute('uuid');
        $results = $this->Recipe_Finder_Service->get($uuid);
        $recipe  = $results->items[0];
        $user_id = $recipe->get('user_id');
        $info = $this->User_Info_Service->get($user_id, true);
        $user = $info['body']['data'];
        $url = rtrim(GF_USER_RECIPES_APP_ROOT, '/') . '/edit/'.$uuid;
        $errors = [];

        $email = [
            'to'           => $user['email'],
            'subject'      => 'Neues Feedback erhalten',
            'name'         => $user['salutation'] . ' ' . $user['lastname'],
            'recipe_name'  => $recipe->title,
            'recipe_url'     => $url
        ];

        $errors = array_merge($errors, $this->send_email_recipe_feedback($email));

        return $this->rest_update_recipe($request);
    }
    // GETTER ----------------------------------------------------------------------------

    public function rest_get_recipes_by_user_id($request) {
        return $this->Api_Middleware->response(
            $request,
            function ($Request) {
                $params  = $Request->getParams();
                $user_id = (int)$Request->getAttribute('user_id');
                $results = $this->Recipe_Finder_Service->get_list($user_id, $params);

                return [$results, 200];
            },
            [
                'customer',
                'view',
                fn($Request) => (int)$Request->getAttribute('user_id') === (int)$this->Jwt_Middleware->getValue(
                        'userId'
                    )
            ]
        );
    }

    public function route_recipes_uuid($request) {
        $Request = $this->Adapter->Request()->set($request);

        switch ($Request->getMethod()) {
            case 'PUT' :
                return $this->rest_update_recipe($request);
            case 'GET' :
                return $this->rest_get_recipes_by_uuid($request);
        }

        return [];
    }

    public function rest_get_recipes_by_uuid($request) {
        return $this->Api_Middleware->response($request, function ($Request) {
            $uuid = $Request->getAttribute('uuid');

            if ($this->Jwt_Middleware->isRole('admin')) {
                $results = $this->Recipe_Finder_Service->get($uuid);
            } else {
                $token_user_id = (int)$this->Jwt_Middleware->getValue('userId');
                $results       = $this->Recipe_Finder_Service->get($uuid, $token_user_id);
            }

            $results = isset($results->items[0]) ? $results->items[0] : [];

            return [$results, 200];
        }, ['customer', 'view']);
    }

    public function rest_recipe_export($request) {
        return $this->Api_Middleware->response($request, function ($Request) {
            $uuid    = $Request->getAttribute('uuid');
            $results = $this->Recipe_Exporter_Service->export($uuid);
            $errors  = $results['errors'];

            if ($results['status'] === 200 || $results['status'] === 201) {
                $body = $results['body'];
                // change state to published + add link to post
                $this->Recipe_Updater_Service->update(
                    [
                    'state' => 'published',
                    'link' => $body['link']
                    ], $uuid);

                $errors = array_merge(
                    $errors,
                    $this->handle_after_recipe_published($uuid)
                ); // should be its own service
            }

            $results['errors'] = $errors;

            return [$results, $results['status']];
        }, ['admin', 'export']);
    }

    public function rest_get_recipes($request) {
        return $this->Api_Middleware->response($request, function ($Request) {
            $params = $Request->getParams();

            if ($this->Jwt_Middleware->isRole('admin')) {
                $results = $this->Recipe_Finder_Service->get_list(0, $params);
            } else {
                $token_user_id = (int)$this->Jwt_Middleware->getValue('userId');
                $results       = $this->Recipe_Finder_Service->get_list($token_user_id, $params);
            }

            return [$results, 200];
        }, ['customer', 'view']);
    }

    public function rest_get_ingredients($request) {
        return $this->Api_Middleware->response($request, function ($Request) {
            $results = $this->Recipe_Ingredients_Finder_Service->get_list();

            return [$results, 200];
        }, ['customer', 'view'], ['Cache-Control' => 'max-age=3600']);
    }

    public function rest_get_menu_types($request) {
        return $this->Api_Middleware->response($request, function ($Request) {
            $results = $this->Recipe_Menu_Types_Finder_Service->get_list();

            return [$results, 200];
        }, ['customer', 'view'], ['Cache-Control' => 'max-age=3600']);
    }

    public function rest_get_kitchen_styles($request) {
        return $this->Api_Middleware->response($request, function ($Request) {
            $results = $this->Recipe_Kitchen_Styles_Finder_Service->get_list();

            return [$results, 200];
        }, ['customer', 'view'], ['Cache-Control' => 'max-age=3600']);
    }

    // handler ----------------------------------------------------------------------------
    // @todo these should be services
    private function handle_after_recipe_published(int $uuid) {
        $errors  = [];
        $results = $this->Recipe_Finder_Service->get($uuid);
        $recipe  = $results->items[0];
        $user_id = $recipe->get('user_id');

        // get the data
        $info = $this->User_Info_Service->get($user_id, true);
        $user = $info['body']['data'];
        $voucher = $this->Recipe_Voucher_Service->create();

        if ($voucher !== '') {
            $email = [
                'to'           => $user['email'],
                'subject'      => 'Ihr Rezept wurde freigeschaltet',
                'name'         => $user['salutation'] . ' ' . $user['lastname'],
                'recipe_name'  => $recipe->title,
                'voucher_code' => $voucher,
                'shop_url'     => 'https://grillfuerst.de', //@todo move this to settings
            ];

            $errors = array_merge($errors, $this->send_email_recipe_published($email));
            // no error handling for this operation, sry
            $this->Recipe_Updater_Service->update(['voucher' => $voucher], $uuid);
        } else {
            $errors[] = ['Gutscheincode konnte nicht erstellt werden.'];
        }

        return $errors;
    }

    // EMAILS ----------------------------------------------------------------------------
    private function send_email_recipe_published(array $params): array {
        $params['template'] = 'published';
        return $this->Email_Middleware->send($params);
    }

    private function send_email_recipe_feedback(array $params): array {
        $params['template'] = 'feedback';
        return $this->Email_Middleware->send($params);
    }

    // TEST FUNCTIONS ----------------------------------------------------------------------------
    public function test_send_email_recipe_published() {
        $params = [
            'to'      => 'dennis-heiden@straightvisions.com',
            'subject' => 'test',
            'name'    => 'Herr Dennis Heiden',
            'voucher_code' => 12345,
            'shop_url' => 'https://google.com',
            'template' => 'published'
        ];

        if($this->settings['debug'] || $this->settings['env'] === 'development') {
            $this->Email_Middleware->send($params);
        }

    }

    public function test_get_user_info() {
        if($this->settings['debug'] || $this->settings['env'] === 'development') {
            $info = $this->User_Info_Service->get(30, true);
            $user = $info['body']['data'];
            var_dump($user);
        }
    }

}