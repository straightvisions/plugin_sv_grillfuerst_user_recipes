<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Revision_Finder_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Revision_Finder_Result;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Revisions_Finder_Repository;

final class Revisions_Finder_Service {
    private Revisions_Finder_Repository $repository;

    /**
     * @param Revisions_Finder_Repository     $repository
     */
    public function __construct(Revisions_Finder_Repository $repository) {
        $this->repository = $repository;
    }

    public function get_list(int $user_id = null): Revision_Finder_Result {
        $rows = $user_id ? $this->repository->get_by_user_id($user_id) : $this->repository->get();

        return $this->create_result($rows);
    }

    private function create_result(array $rows): Revision_Finder_Result {
        $result = new Revision_Finder_Result();

        foreach ($rows as $row) {
            $item = new Revision_Finder_Item();

            $result->items[] = $this->apply_data($item, $row);
        }

        return $result;
    }

    private function apply_data(Revision_Finder_Item $item, array $row): Revision_Finder_Item {
        foreach ($row as $key => $value) {
            if (property_exists($item, $key)) {
                $item->set($key, $value);
            }
        }

        return $item;
    }
}
