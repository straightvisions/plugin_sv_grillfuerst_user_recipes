<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Validator_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service\Recipe_Ingredients_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Service\Media_Update_Service;
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
        Media_Update_Service $Media_Update_Service,
        Logger_Factory $Logger_Factory
    ) {
        $this->repository = $repository;
        $this->Recipe_Validator = $Recipe_Validator;
        $this->Recipe_Ingredients_Finder_Service = $Recipe_Ingredients_Finder_Service;
        $this->Media_Update_Service = $Media_Update_Service;
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

		// =< PHP 7.3
	    // images
	    $data['featured_image'] = empty($data['featured_image']) ? $data['featured_image'] : $this->comparateFeaturedImage($data, $data['featured_image']);
	    $data['steps'] = empty($data['steps']) ? $data['steps'] : $this->comparateSteps($data, $data['steps']);

        return $data;
    }

    private function comparateIngredient(array $item, array $ingredients): array{
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

	// set title if available for featured image filename + title / alt text
	private function comparateFeaturedImage(array $item, array $featuredImage): array{
		$title = empty($item['title']) ? 'unknown' : $item['title'];
		$featuredImage['title'] = $title;
		$featuredImage['alt_text'] = empty($featuredImage['alt_text']) ? $title : $featuredImage['alt_text'];
		$featuredImage['newFilename'] = $title;

		return (array) $this->Media_Update_Service->update($featuredImage, $featuredImage['path']);
	}

	// set title if available for step image filename + title / alt text
	private function comparateSteps(array $item, array $steps): array{
		foreach($steps as &$step){
			$order = $step['order'];
			$step['images'] = empty($step['images']) ? $step['images'] : $this->comparateStepImages($item, $step['images'], (int) $order);
		}

		return $steps;
	}

	private function comparateStepImages(array $item, array $images, int $order): array{
		$title = empty($item['title']) ? 'unknown' : $item['title'];
		foreach($images as &$img){
			$img['title'] = $title;
			if(strpos('Schritt', $img['title']) === false){
				$img['title'] = empty($img['title']) ? 'Schritt 1' : $img['title'] . ' - Schritt ' . $order;
			}
			$img['alt_text'] = empty($img['alt_text']) ? $img['title'] : $img['alt_text'];
			$img['newFilename'] = $img['title'];
			$img = (array) $this->Media_Update_Service->update($img, $img['path']);
		}
		return $images;
	}
}
