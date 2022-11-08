<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User\Repository;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Insert_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Update_Item;
use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;
use DomainException;

final class Recipe_Repository {
    private Query_Factory $Query_Factory;

    /*
     * it is expected that all data input is validated beforehand
     * we do not handle validation here
     */

    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function insert_recipe(array $recipe): int {
        $Recipe_Item = new Recipe_Insert_Item();
       
        return (int)$this->Query_Factory->newInsert('svgfur_recipes', $this->to_row($recipe, $Recipe_Item))
                                       ->execute()
                                       ->lastInsertId();
    }

    public function get_recipe_by_id(int $recipe_id): array {
        $query = $this->Query_Factory->newSelect('svgfur_recipes');
        $query->select(
            [
                '*',
            ]
        );

        $query->where(['id' => $recipe_id]);

        $row = $query->execute()->fetch('assoc');

        if (!$row) {
            throw new DomainException(sprintf('Recipe not found: %s', $recipe_id));
        }

        return $row;
    }

    public function update_recipe(int $recipe_id, array $recipe): void {
        $Recipe_Item = new Recipe_Update_Item();

        $row = $this->to_row($recipe, $Recipe_Item);

        $this->Query_Factory->newUpdate('svgfur_recipes', $row)
                           ->where(['id' => $recipe_id])
                           ->execute();
    }

    public function exists_recipe_id(int $recipe_id): bool {
        $query = $this->Query_Factory->newSelect('svgfur_recipes');
        $query->select('id')->where(['id' => $recipe_id]);

        return (bool)$query->execute()->fetch('assoc');
    }

    public function delete_recipe_by_id(int $recipe_id): void {
        $this->Query_Factory->newDelete('svgfur_recipes')
                           ->where(['id' => $recipe_id])
                           ->execute();
    }

    private function to_row(array $recipe, $Recipe_Item): array {
        $output = [];

        foreach ($Recipe_Item as $key => $default_value) {
            $output[$key] = $recipe[$key] ?? $default_value;
        }

        return $output;
    }

}
