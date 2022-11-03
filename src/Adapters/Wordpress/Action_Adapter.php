<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use function add_action;

final class Action_Adapter {
    private $callbacks = [];

    public function add(string $hook_name, array $callback, int $priority = 10, int $accepted_args = 1): void {
        // save origin
        $this->callbacks[$hook_name] = $callback;

        // add adapter callback
        add_action($hook_name,
            function($att1 = null, $att2 = null, $att3 = null){
            }
            , $priority, $accepted_args);
    }

    // handle wordpress callbacks
    public function handle($hook_name, $att1 = null, $att2 = null, $att3 = null): string {
        if (isset($this->callbacks[$hook_name])) {
            $call = $this->callbacks[$shortcode_tag];

            $response = call_user_func_array($call, array((array)$atts, (string)$content, (string)$shortcode_tag));

            return (string)$response;
        } else {
            // error middleware here later
            return 'callback not found for ' . $shortcode_tag;
        }
    }
}