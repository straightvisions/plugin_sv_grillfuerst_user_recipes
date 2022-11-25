<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository;

use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;

final class Revisions_Finder_Repository {
    private Query_Factory $Query_Factory;

    /**
     * @param Query_Factory     $Query_Factory
     */
    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function get($id = null): array {
        $query = $this->Query_Factory->newSelect('svgfur_recipes_revisions');

        $query->select(
            [
                '*',
            ]
        );

        // filter by recipe id
        if($id){
            $query->where(['recipe_id' => (int)$id]);
        }

        return $query->execute()->fetchAll('assoc') ?: [];
    }
}
