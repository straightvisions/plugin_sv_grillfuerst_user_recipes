<?php

namespace SV_Grillfuerst_User_Recipes\Factory;

use DI\Container;
use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;

/**
 * Container Factory.
 */
final class Container_Factory {
    /**
     * Get container.
     *
     * @return ContainerInterface|Container The container
     */
    public function createInstance(): ContainerInterface {
        $containerBuilder = new ContainerBuilder();

        // Set up settings
        $containerBuilder->addDefinitions(__DIR__ . '/../../config/container.php');

        // Build PHP-DI Container instance
        return $containerBuilder->build();
    }
}
