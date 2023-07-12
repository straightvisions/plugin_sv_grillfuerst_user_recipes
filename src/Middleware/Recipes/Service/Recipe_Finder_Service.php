<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Finder_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Exporter_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Finder_Result;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Finder_Repository;

final class Recipe_Finder_Service {
    private Recipe_Finder_Repository $repository;
    private Recipe_Exporter_Item $Recipe_Exporter_Item;

    /**
     * @param Recipe_Finder_Repository     $repository
     */
    public function __construct(
        Recipe_Finder_Repository $repository,
        Recipe_Exporter_Item $Recipe_Exporter_Item
    ) {
        $this->repository = $repository;
        $this->Recipe_Exporter_Item = $Recipe_Exporter_Item;
    }

    public function get_list(int $user_id = null, array $params = []): Recipe_Finder_Result {
        $rows = $user_id ? $this->repository->get_by_user_id($user_id, $params) : $this->repository->get(null, $params);

        return $this->create_result($rows);
    }

    public function get(int $recipe_id, int $user_id = 0): Recipe_Finder_Result {
        $rows = $user_id ? $this->repository->get_by_recipe_id_and_user_id($recipe_id, $user_id) : $this->repository->get($recipe_id);

        return $this->create_result($rows);
    }

    //@todo check if this function is needed + naming convention
    public function getRaw(int $recipe_id): Recipe_Exporter_Item {
        $row = $this->repository->getRaw($recipe_id);
        $item = $this->Recipe_Exporter_Item;
        return $this->apply_data_raw($item, $row);
    }

    private function create_result(array $rows): Recipe_Finder_Result {
        $result = new Recipe_Finder_Result();

        foreach ($rows as $row) {
            $item = new Recipe_Finder_Item();

            $result->items[] = $this->apply_data($item, $row);
        }

        // apply totals for pagination
        $result->totalPages = $this->repository->get_total_pages();
        $result->totalRows = $this->repository->get_total_rows();
        $result->page = $this->repository->get_current_page();

        return $result;
    }

    private function apply_data(Recipe_Finder_Item $item, array $row): Recipe_Finder_Item {
        foreach ($row as $key => $value) {
            if (property_exists($item, $key)) {
                $item->set($key, $value);
            }
        }

        return $item;
    }

    private function apply_data_raw(Recipe_Exporter_Item $item, array $row): Recipe_Exporter_Item {
        foreach ($row as $key => $value) {
            if (property_exists($item, $key)) {
                $item->set($key, $value);
            }
        }

        return $item;
    }
}
