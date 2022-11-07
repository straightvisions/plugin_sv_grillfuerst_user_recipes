<?php

$settings = [
    'adapters' => [
        'connection' => 'Wordpress_Adapter',
        // Wordpress CMS specific adapters
        'action' => 'Wordpress_Adapter',
        'shortcode' => 'Wordpress_Adapter',
    ]
];

return $settings;