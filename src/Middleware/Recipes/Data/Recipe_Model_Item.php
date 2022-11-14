<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

class Recipe_Model_Item {
    public ?int $id = 0;
    public ?int $user_id = 0;
    public ?string $state = 'draft';
    public ?string $title = '';
    public ?string $excerpt = '';
    public ?array $categories = []; // obsolete?
    public ?string $portions = '1'; // obsolete ?
    public ?string $featured_image = '{}';
    public ?int $menu_type = 0;
    public ?int $kitchen_style = 0;
    public ?string $difficulty = 'easy';
    public ?int $preparation_time = 0;
    public ?int $cooking_time = 0;
    public ?int $waiting_time = 0;
    public ?array $ingredients = [];
    public ?array $steps = [];
    public ?string $created = '1970-01-01 00:00:00';
    public ?string $edited = '1970-01-01 00:00:00';
    // debug entry
    public ?array $_errors = [];

    // useful functions to convert data before output
    // from database to response
    public function set($field, $value){

        if(isset($this->{$field})){
            $type = gettype($this->{$field});

            switch($type){
                case 'array': $value = $this->to_array($value);
            }

            $this->{$field} = $value;
        }
    }

    public function to_array(string $val){
        if(is_array(json_decode($val))){
            $val = json_decode($val);
        }else{
            $this->_errors[] = 'value is not a valid json string';
        }

        return $val;
    }

}
