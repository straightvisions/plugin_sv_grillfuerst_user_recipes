<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Validator_Service;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Log\LoggerInterface;

final class Recipe_Creator_Service {
    private Recipe_Repository $Repository;
    private Recipe_Validator_Service $Validator;
    private LoggerInterface $Logger;

    public function __construct(
        Recipe_Repository $Repository,
        Recipe_Validator_Service $Validator,
        Logger_Factory $Logger_Factory
    ) {
        $this->Repository       = $Repository;
        $this->Validator        = $Validator;
        $this->Logger           = $Logger_Factory
            ->addFileHandler('user_creator.log')
            ->createLogger();
    }

    public function insert(array $data, int $user_id): int {
        // Input validation
        $this->Validator->validate_insert($data);

        // sets foreign key for user by route param
        $data['user_id'] = $user_id;
        $data['uuid']    = $this->generate_uuid();

        // Insert item and get new item ID
        $id = $this->Repository->insert($data);

        // Logging
        $this->Logger->info(sprintf('Recipe created successfully: %s', $id));

        return $data['uuid'];
    }

    public function generate_uuid() {
        $uuid = rand(11111, 99999);
        $try_count = 0;

        while($this->Repository->exists_uuid($uuid)){
            // break blocking loop after 20 attempts
            if($try_count >= 20){
                // error handling here
                return '696';
            }

            $uuid = rand(1111, 99999);
            $try_count++;
        }

        return $uuid;
    }

}
