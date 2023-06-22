<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Log\LoggerInterface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;


final class Recipe_Voucher_Service {
    private LoggerInterface $logger;
    private $settings;

    public function __construct(
        ContainerInterface $container,
        Api_Middleware $Api_Middleware,
        Logger_Factory $Logger_Factory
    ) {
        $this->settings = $container->get('settings');
        $this->Api_Middleware = $Api_Middleware;
        $this->logger = $Logger_Factory
            ->addFileHandler('user_updater.log')
            ->createLogger();
    }

    public function create($recipe = null): string {
        $url = $this->settings['voucher_create_server_url'];
        $client = $this->Api_Middleware->http();
        $payload = ['userId' => 0, 'link' => '', 'recipeUUID' => ''];

        if($recipe){
            $payload = [
              'userId' => $recipe->user_id,
              'link' => $recipe->link,
              'recipeUUID' => $recipe->uuid,
            ];

        }

        $response = $client->request('POST',
            $url,
            [
                'content-type' => 'application/json',
                'json' => $payload,
                'headers' => ['Authorization' => $this->settings['auth_header']],
                'debug'=>false
            ]);

        $body = json_decode($response->getBody(), true);
        $code = (int) $response->getStatusCode();

        return isset($body['couponCode']) ? $body['couponCode'] : '';
    }
}
