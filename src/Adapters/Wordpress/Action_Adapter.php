<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use function add_action;

final class Action_Adapter {
    private $callbacks = [];

    public function add(string $hook_name, array $callback, int $priority = 10, int $accepted_args = 1): void {
        // save origin
        $this->callbacks[$hook_name] = $callback;

        // add adapter callback
        add_action(
            $hook_name,
            [$this, 'handle_rest_api_init'],
            $priority,
            $accepted_args
        );
    }

    // handle wordpress callbacks
    public function handle_rest_api_init($att1 = null, $att2 = null, $att3 = null): string {
        if (isset($this->callbacks['rest_api_init'])) {
            $call = $this->callbacks['rest_api_init'];

            $response = call_user_func_array($call, array($att1));

            return (string)$response;
        } else {
            // error middleware here later
            return 'callback not found for ' . 'rest_api_init';
        }
    }
}