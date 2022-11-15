<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Validator_Service;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Log\LoggerInterface;

final class Recipe_Updater_Service {
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
            ->addFileHandler('user_updater.log')
            ->createLogger();
    }

    public function update(array $data, int $recipe_id): void {
        // Input validation
        $this->Recipe_Validator->validate_update($recipe_id, $data);

        // Update item
        $this->repository->update($recipe_id, $data);

        // Logging
        $this->logger->info(sprintf('Recipe update successfully: %s', $id));

    }
}
