<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Jwt;

use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Container\ContainerInterface;
use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;

final class Jwt_Middleware implements Middleware_Interface {
	private $settings;
	private $cookie_key = 'svGrillfuerstUserRecipesToken';
	private $secret_key = null;
	private $expiration_time = 3600 * 24 * 7; //@todo 7 days
	private $algo = 'HS256';
	private $token = null;

	public function __construct(
		ContainerInterface $container
	) {
		$this->settings = $container->get('settings');
		// set the secret key or use the unsecure fallback
		$this->secret_key = isset($this->settings['auth']['secret']) ? $this->settings['auth']['secret'] : 'fallback_F1a0e4ebb2900D82B937525dE68d5Eef';
	}

	public function get(): array {
		$token = $this->token;

		return $this->validate() ? (array)JWT::decode($token, new Key($this->secret_key, $this->algo)) : [];
	}

	public function validate(): bool {
		try {
			$token = $this->token ? $this->token : '';
			// Validate the token and decode the payload data
			$decoded_data = (array)JWT::decode($token, new Key($this->secret_key, $this->algo));
		} catch (Exception $e) {
			// invalid token
			return false;
		}

		return true;
	}

	public function getValue(string $name) {
		$token = $this->get();

		return isset($token[$name]) ? $token[$name] : '';
	}

	public function create(array $payload = []): string {
		$payload['exp'] = isset($payload['exp']) ? time() + (int)$payload['exp'] : time() + (int)$this->expiration_time;
		//$payload['exp'] = time() + (int)20; // debug 20s
		// create token
		return JWT::encode($payload, $this->secret_key, $this->algo);
	}

	public function validateRequest($Request): bool {
		$auth_header = $Request->getHeader('Authorization');
		$this->setToken($auth_header);

		return $this->validate();
	}

	public function setToken(string $auth_header): void {
		$this->token = $this->extract($auth_header);
		// error handling?
	}

	private function extract(string $auth_header): string {
		$tokens = explode(',', $auth_header);
		$bearer = '';

		foreach ($tokens as $token) {
			if (preg_match('/^Bearer\s+(.*)$/i', $token, $matches)) {
				$bearer = $matches[1];
				break;
			}
		}

		return $bearer;
	}

	public function can(string $canDo = '') {
		$output = false;
		$token  = $this->get();

		if (isset($token['can']) && in_array($canDo, $token['can'])) {
			$output = true;
		}

		return $output;
	}

	public function isRole(string $role = 'user') {
		$output = false;
		$token  = $this->get();

		if (isset($token['role']) && $token['role'] === $role) {
			$output = true;
		}

		// overload for admins
		if (isset($token['role']) && $token['role'] === 'admin' && ($role === 'user' || $role === 'customer')) {
			$output = true;
		}

		return $output;
	}

	// obsolete but keep it if we want app auth later
	public function destroy() {
		if (isset($_COOKIE[$this->cookie_key])) {
			unset($_COOKIE[$this->cookie_key]);
			setcookie($this->cookie_key, '', time() - 3600, '/', '', true, true);
		}
	}

}