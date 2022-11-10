<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Validator_Service;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Log\LoggerInterface;

final class Recipe_Creat_Service {
    private Recipe_Repository $repository;

    private Recipe_Validator_Service $Recipe_Validator;

    private LoggerInterface $logger;

    public function __construct(
        Recipe_Repository $repository,
        Recipe_Validator_Service $Recipe_Validator,
        Logger_Factory $Logger_Factory
    ) {
        $this->repository = $repository;
        $this->Recipe_Validator = $Recipe_Validator;
        $this->logger = $Logger_Factory
            ->addFileHandler('user_creator.log')
            ->createLogger();
    }

    public function create(array $data): int {
        // Input validation
        $this->Recipe_Validator->validate($data);

        // Insert user and get new user ID
        $Recipe_Id = $this->repository->insert($data);

        // Logging
        $this->logger->info(sprintf('User created successfully: %s', $Recipe_Id));

        return $Recipe_Id;
    }
}
