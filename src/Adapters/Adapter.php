<?php

namespace SV_Grillfuerst_User_Recipes\Adapters;
use Psr\Container\ContainerInterface;

class Adapter {
    private $container;
    private $adapters;

    public function __construct(ContainerInterface $container){
       $this->container = $container;
       $settings = $container->get('settings');
       $this->adapters = $settings['adapters'];
    }

    // get the right adapter from settings
    public function __call($name, $arguments){
        $adapters = $this->adapters;

        if(isset($adapters[$name])){
            $adapter = $this->container->get($adapters[$name]);

            return $adapter->{$name};
        }

        return null;
    }
}