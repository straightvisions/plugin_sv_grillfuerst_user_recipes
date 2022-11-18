<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User\Service;

final class User_Dashboard_Frontend_Service {

    public function get(array $atts) {
        ob_start();
        require(__DIR__ . '/../lib/templates/user_dashboard.php');

        return ob_get_clean();
    }

}