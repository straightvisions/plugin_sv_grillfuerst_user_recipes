<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository;

use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;

final class Recipe_Finder_Repository {
    private Query_Factory $Query_Factory;

    /**
     * @param Query_Factory     $Query_Factory
     */
    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function get($id = null): array {
        $query = $this->Query_Factory->newSelect('svgfur_recipes');

        $query->select(
            [
                '*',
            ]
        );

        // filter by recipe id
        if($id){
            $query->where(['uuid' => (int)$id]);
        }

        return $query->execute()->fetchAll('assoc') ?: [];
    }

    public function get_by_user_id($id): array {
        $query = $this->Query_Factory->newSelect('svgfur_recipes');

        $query->select(
            [
                '*',
            ]
        );

        // filter by user id
        $query->where(['user_id' => (int)$id]);

        return $query->execute()->fetchAll('assoc') ?: [];
    }

    public function get_by_recipe_id_and_user_id($id1, $id2): array {
        $query = $this->Query_Factory->newSelect('svgfur_recipes');

        $query->select(
            [
                '*',
            ]
        );

        // filter by recipe id + user id
        $query->where(['uuid' => (int)$id1, 'user_id' => (int)$id2]);

        return $query->execute()->fetchAll('assoc') ?: [];
    }
}
