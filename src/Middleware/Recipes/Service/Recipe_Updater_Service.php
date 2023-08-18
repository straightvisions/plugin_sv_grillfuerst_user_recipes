<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Validator_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Ingredients_Finder_Service;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Log\LoggerInterface;

final class Recipe_Updater_Service {
    private Recipe_Repository $repository;
    private Recipe_Validator_Service $Recipe_Validator;
    private Recipe_Ingredients_Finder_Service $Recipe_Ingredients_Finder_Service;
    private LoggerInterface $logger;

    public function __construct(
        Recipe_Repository $repository,
        Recipe_Validator_Service $Recipe_Validator,
        Recipe_Ingredients_Finder_Service $Recipe_Ingredients_Finder_Service,
        Logger_Factory $Logger_Factory
    ) {
        $this->repository = $repository;
        $this->Recipe_Validator = $Recipe_Validator;
        $this->Recipe_Ingredients_Finder_Service = $Recipe_Ingredients_Finder_Service;
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
        $this->logger->info(sprintf('Recipe update successfully: %s', $recipe_id));

    }

    public function comparate(array $data){
        $ingredients = $this->Recipe_Ingredients_Finder_Service->get_list()->items;

        // PHP >= 7.4
        $data['ingredients'] = array_map(function($item) use ($ingredients){
            return $this->comparateIngredient($item, $ingredients);
        }, $data['ingredients']);

        return $data;
    }

    private function comparateIngredient($item, $ingredients){
        foreach($ingredients as $i){
            $cleanedItemLabel = strtolower(str_replace(' ', '', $item['label']));
            $cleanedIngredientName = strtolower(str_replace(' ', '', $i->name));

            if($cleanedItemLabel === $cleanedIngredientName){
                $item['id'] = $i->id;
                $item['label'] = $i->name;
                $item['custom'] = false;
                return $item;
            }
        }

        return $item;
    }
}
