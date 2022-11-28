<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Media;

use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use SV_Grillfuerst_User_Recipes\Middleware\Api\Api_Middleware;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Service\Media_Upload_Service;

use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Media_Middleware implements Middleware_Interface {
    private Api_Middleware $Api_Middleware;
    private $Adapter;
    private Media_Upload_Service $Media_Upload_Service;


    public function __construct(
        Api_Middleware $Api_Middleware,
        Adapter $Adapter,
        Media_Upload_Service $Media_Upload_Service,
    ) {
        $this->Api_Middleware = $Api_Middleware;
        $this->Adapter = $Adapter;
        $this->Media_Upload_Service = $Media_Upload_Service;

        // https://github.com/straightvisions/plugin_sv_appointment/blob/master/lib/modules/api.php
        // @todo add permissions
        // https://developer.wordpress.org/rest-api/extending-the-rest-api/routes-and-endpoints/#permissions-callback
        //
        //

        $this->Api_Middleware->add([
            'route' => '/media/upload',
            'args'  => ['methods' => 'POST, GET', 'callback' => [$this, 'rest_upload_media']]
        ]);


    }

    // SETTER ----------------------------------------------------------------------------
    public function rest_upload_media( $request ) {
        $Request = $this->Adapter->Request()->set($request);
        $user_id = $Request->getAttribute('user_id');
        $data = $Request->getBody();

        var_dump($data);


        $response = new \WP_REST_Response($data, 201);
        // implement wp_response adapter + services
        return $response; // @todo remove this when adapter is available
    }

}