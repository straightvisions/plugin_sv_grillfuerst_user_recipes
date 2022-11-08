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

    public function get(): array {
        $query = $this->Query_Factory->newSelect('recipes');

        $query->select(
            [
                '*',
            ]
        );

        // Add more "use case specific" conditions to the query
        // ...

        return $query->execute()->fetchAll('assoc') ?: [];
    }

    public function get_by_user_id($id): array {
        $query = $this->Query_Factory->newSelect('recipes');

        $query->select(
            [
                '*',
            ]
        );

        $query->where(['user_id' => (int)$id]);

        return $query->execute()->fetchAll('assoc') ?: [];
    }
}
