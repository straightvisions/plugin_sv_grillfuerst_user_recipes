<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Jwt;
use SV_Grillfuerst_User_Recipes\Interfaces\Middleware_Interface;
use Psr\Container\ContainerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class Jwt_Middleware implements Middleware_Interface {
    private $settings;
    private $secret_key = "mysecretkey123"; //@todo ->ENV
    private $expiration_time = 3600; //@todo 7 days
    private $algo = 'HS256';

    public function __construct(
        ContainerInterface $container
    ) {
        $this->settings = $container->get('settings');
    }

    public function get(string $auth_header): array{
        $token = $this->extract($auth_header);

        return $this->validate($auth_header) ? (array) JWT::decode($token, new Key($this->secret_key, $this->algo)) : [];
    }

    public function create(array $payload = []){
        $payload['exp'] = time() + (int)$this->expiration_time;
        return JWT::encode($payload, $this->secret_key, $this->algo);
    }

    public function validate(string $auth_header): bool{
        try {
            $token = $this->extract($auth_header);
            // Validate the token and decode the payload data
            $decoded_data = (array)JWT::decode($token, new Key($this->secret_key, $this->algo));
        } catch (\Exception $e) {
            // invalid token
            return false;
        }

        return true;
    }

    private function extract(string $auth_header): string{
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

}