<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User\Service;

final class User_Login_Frontend_Service {

    public function get(array $atts) {
        ob_start();
        require(__DIR__ . '/../lib/templates/login.php');

        return ob_get_clean();
    }

}