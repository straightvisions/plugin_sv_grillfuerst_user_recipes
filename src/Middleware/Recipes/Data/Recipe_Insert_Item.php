<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Model_Item;

class Recipe_Insert_Item extends Recipe_Model_Item {
    public ?int $uuid = 0;
    public ?int $user_id = 0;
    public ?string $state = 'draft';
    public ?string $title = '';
    public ?string $excerpt = '';
    public ?int $servings = 4;
    public array|string $menu_type = '[]';
    public array|string $kitchen_style = '[]';
    public ?string $difficulty = 'easy';
    public ?int $preparation_time = 0;
    public ?int $cooking_time = 0;
    public ?int $waiting_time = 0;
    public array|string $ingredients = '[]';
    public array|string $steps = '[]';
    public int $newsletter = 0;

// useful functions to convert data before output

    // from database to response
    public function set($field, $value){
        if(isset($this->{$field})){
            $type = gettype($value);

            switch($type){
                case 'array': $value = $this->to_json($value);break;
                case 'object': $value = $this->to_json($value);break;
            }

            $this->{$field} = $value;
        }

        return $this->get($field);
    }

    public function to_json($val){
        if(!is_array($val) && !is_object($val)){
            return $val;
        }

        return json_encode($val);
    }

}
