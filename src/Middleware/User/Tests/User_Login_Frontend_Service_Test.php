<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User\Tests;

use PHPUnit\Framework\TestCase;

final class User_Login_Frontend_Service_Test extends TestCase{

    public function test_get(): void {
        ob_start();
        require(__DIR__ . '/../lib/templates/login.php');

        $response = ob_get_clean();

        // test data type
        $this->assertIsString($response);
        // test emptiness
        $this->assertNotEmpty($response);
    }

}