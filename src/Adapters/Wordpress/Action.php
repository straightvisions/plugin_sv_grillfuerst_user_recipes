<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

use function add_action;

final class Action {
	public function add(string $hook_name, array $callback, int $priority = 10, int $accepted_args = 0): void {
		// add adapter callback
		add_action(
			$hook_name,
			$callback,
			$priority,
			$accepted_args
		);
	}

}