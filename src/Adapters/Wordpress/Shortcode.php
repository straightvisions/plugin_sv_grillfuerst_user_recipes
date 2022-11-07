<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use function add_shortcode;

final class Shortcode {
    private $callbacks = [];

    public function add(string $tag, array $callback): void {
        // save origin
        $this->callbacks[$tag] = $callback;

        // add adapter callback
        add_shortcode($tag, [$this, 'handle']);
    }

    // handle wordpress callbacks
    public function handle($atts, $content, $shortcode_tag): string {
        if (isset($this->callbacks[$shortcode_tag])) {
            $call = $this->callbacks[$shortcode_tag];

            $response = call_user_func_array($call, array((array)$atts, (string)$content, (string)$shortcode_tag));

            return (string)$response;
        } else {
            // error middleware here later
            return 'callback not found for ' . $shortcode_tag;
        }
    }
}