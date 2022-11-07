<?php

$settings = [
    'adapters' => [
        'Connection' => 'Wordpress_Adapter',
        // Wordpress CMS specific adapters
        'Action' => 'Wordpress_Adapter',
        'Shortcode' => 'Wordpress_Adapter',
        'Request' => 'Wordpress_Adapter',
    ]
];

return $settings;