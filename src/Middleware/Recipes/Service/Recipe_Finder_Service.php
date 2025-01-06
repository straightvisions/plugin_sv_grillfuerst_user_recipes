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

	public function get(array $params = []): Recipe_Finder_Result {
		return $this->create_result($this->repository->get($params));
	}

	// alias function
    public function get_list(array $params = []): Recipe_Finder_Result {
        return $this->get($params);
    }

	// only for internal use // workaround function due the fact the repository getters are not supporting complex queries
	public function get_queried_list(string $query){
		return $this->create_result($this->repository->get_queried($query));
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
