<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Admin\Service;

final class Admin_Dashboard_Frontend_Service {

    public function get(array $atts) {
        ob_start();
        require(__DIR__ . '/../lib/templates/admin_dashboard.php');

        return ob_get_clean();
    }

}