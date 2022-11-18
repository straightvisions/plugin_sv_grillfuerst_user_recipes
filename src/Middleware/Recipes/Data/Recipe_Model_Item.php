<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Image_Model_Item;

class Recipe_Model_Item {
    public ?int $id = 0;
    public ?int $uuid = 0;
    public ?int $user_id = 0;
    public ?string $title = '';
    public ?string $excerpt = '';
    public array|string $categories = []; // obsolete?
    public ?int $servings = 1; // obsolete ?
    public object|string $featured_image;
    public ?int $menu_type = 0;
    public ?int $kitchen_style = 0;
    public ?string $difficulty = 'easy';
    public ?int $preparation_time = 0;
    public ?int $cooking_time = 0;
    public ?int $waiting_time = 0;
    public array|string $ingredients = [];
    public array|string $steps = [];
    public bool $newsletter = false;

    // useful functions to convert data before output
    public function __construct(){
        // object types
        $this->featured_image = new Image_Model_Item();
    }

    // from database to response
    public function set($field, $value){

        if(isset($this->{$field})){
            $type = gettype($this->{$field});

            switch($type){
                case 'array': $value = $this->to_array($value);break;
                case 'object': $value = $this->to_object($value);break;
            }

            $this->{$field} = $value;
        }
    }

    public function get($field){
        return $this->{$field};
    }

    public function to_array($val){

        if(is_array($val)){
            return $val;
        }

        if(is_array(json_decode($val))){
            $val = json_decode($val);
        }else{
            $this->_errors[] = 'value is not a valid json string';
        }

        return $val;
    }

    public function to_object($val){

        // instanceof is 3 times faster than is_object
        if($val instanceof \stdClass){
            return $val;
        }

        if((json_decode($val)) instanceof \stdClass){
            $val = json_decode($val);
        }else{
            $this->_errors[] = 'value is not a valid json string';
        }

        return $val;
    }

}
