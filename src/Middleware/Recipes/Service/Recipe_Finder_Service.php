<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Finder_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Finder_Result;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Finder_Repository;

final class Recipe_Finder_Service {
    private Recipe_Finder_Repository $repository;

    public function __construct() {
        $this->repository = new Recipe_Finder_Repository();
    }

    public function get_list(int $user_id = null): Recipe_Finder_Result {
        $rows = $user_id ? $this->repository->get_by_user_id($user_id) : $this->repository->get();

        return $this->create_result($rows);
    }

    private function create_result(array $rows): Recipe_Finder_Result {
        $result = new Recipe_Finder_Result();

        foreach ($rows as $row) {
            $item = new Recipe_Finder_Item();

            $result->items[] = $this->apply_data($item, $row);
        }

        return $result;
    }

    private function apply_data(Recipe_Finder_Item $item, array $row): Recipe_Finder_Item {
        foreach ($row as $key => $value) {
            if (property_exists($item, $key)) {
                $item->{$key} = $value;
            }
        }

        return $item;
    }
}
