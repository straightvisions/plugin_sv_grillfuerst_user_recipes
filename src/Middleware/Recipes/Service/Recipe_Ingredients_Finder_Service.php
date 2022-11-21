<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Common_Finder_Result;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Ingredient_Finder_Repository;

final class Recipe_Ingredients_Finder_Service {
    private Ingredient_Finder_Repository $repository;

    public function __construct(Ingredient_Finder_Repository $repository) {
        $this->repository = $repository;
    }

    public function get_list(int $user_id = null): Common_Finder_Result {
        $rows = $this->repository->get();

        return $this->create_result($rows);
    }

    private function create_result(array $rows): Common_Finder_Result {
        $result = new Common_Finder_Result();
        $result->items = array_values($rows);

        return $result;
    }

}
