<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository;

use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;

final class Ingredient_Finder_Repository {
    private Query_Factory $Query_Factory;

    /**
     * @param Query_Factory     $Query_Factory
     */
    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function get($id = null): array {
        // @todo replace this with a custom query
        return (array) \get_categories('taxonomy=cp_ingredient&post_type=grillrezepte');

        $query = $this->Query_Factory->newSelect('svgfur_ingredients');

        $query->select(
            [
                '*',
            ]
        );

        return $query->execute()->fetchAll('assoc') ?: [];
    }
}
