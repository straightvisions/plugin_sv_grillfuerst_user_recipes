<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository;

use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;

final class Ingredients_Finder_Repository {
    private Query_Factory $Query_Factory;

    /**
     * @param Query_Factory     $Query_Factory
     */
    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function get($id = null): array {
        // @todo replace this with a custom query
        $items = \get_categories(array(
            'taxonomy' => 'cp_ingredient',
            'post_type' => 'grillrezepte',
            'hide_empty' => false,
        ));

        if (!empty($items) && !is_wp_error($items)) {
            foreach ($items as $item) {
                $string = get_field('name_multiple', $item);
                $item->name_multiple = $string ?? ''; // Replace 'your_acf_field_name' with the actual field name
            }
        }

        // clone wp term_id to id field for better frontend support
        foreach($items as &$item){
            $item->id = $item->term_id;
        }

        return $items;
        /*
        $query = $this->Query_Factory->newSelect('svgfur_ingredients');

        $query->select(
            [
                '*',
            ]
        );

        return $query->execute()->fetchAll('assoc') ?: [];
        */
    }
}
