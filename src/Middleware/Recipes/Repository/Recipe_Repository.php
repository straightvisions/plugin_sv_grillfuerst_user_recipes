<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Insert_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Update_Item;
use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;
use DomainException;

final class Recipe_Repository {
    private Query_Factory $Query_Factory;
    private $table = 'svgfur_recipes';

    /*
     * it is expected that all data input is validated beforehand
     * we do not handle validation here
     */

    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function insert(array $recipe): int {
        $Recipe_Item = new Recipe_Insert_Item();

        return (int)$this->Query_Factory->newInsert($this->table, $this->to_row($recipe, $Recipe_Item))
                                       ->execute()
                                       ->lastInsertId();
    }


    public function get_by_id(int $recipe_id): array {
        $query = $this->Query_Factory->newSelect($this->table);
        $query->select(
            [
                '*',
            ]
        );

        $query->where(['uuid' => $recipe_id]);

        $row = $query->execute()->fetch('assoc');

        return $row ? $row : [];
    }

    public function update(int $recipe_id, array $recipe): void {
        $Recipe_Item = new Recipe_Update_Item();

        $row = $this->to_row($recipe, $Recipe_Item);

        $this->Query_Factory->newUpdate($this->table, $row)
                           ->where(['uuid' => $recipe_id])
                           ->execute();
    }

    public function exists_id(int $recipe_id): bool {
        $query = $this->Query_Factory->newSelect($this->table);
        $query->select('uuid')->where(['uuid' => $recipe_id]);

        return (bool)$query->execute()->fetch('assoc');
    }

    public function exists_uuid(int $uuid): bool {
        $query = $this->Query_Factory->newSelect($this->table);
        $query->select('uuid')->where(['uuid' => $uuid]);

        return (bool)$query->execute()->fetch('assoc');
    }

    public function delete(int $uuid): bool {
        //@todo update ORM to return useful insights if operation was successful
        $query = $this->Query_Factory->newDelete($this->table)
                           ->where(['uuid' => $uuid])
                           ->execute();

        return empty($this->get_by_id($uuid)); // if empty, the row was deleted
    }

    private function to_row(array $recipe, $Recipe_Item): array {
        $data = [];

        foreach($Recipe_Item as $key => $default_value) {
            // don't add non-existing values to the update array, otherwise we will overwrite database
            // rows with default data. defaults should only be used in the inserter / creator
            if(isset($recipe[$key])){
                $data[$key] = $Recipe_Item->set($key, $recipe[$key]);
            }
        }

        return $data;
    }

}
