<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Model_Item;

class Recipe_Update_Item extends Recipe_Model_Item {
    public ?int $user_id = 0;
    public ?string $state = 'draft';
    public ?string $link = '';
    public string $voucher = '';
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
    public array|string $feedback = '[]';
    public int $legal_rights = 0;

    // useful functions to convert data before output
    public function __construct(){
        parent::__construct();
        // object types
        $this->featured_image = new Image_Model_Item();
        unset($this->id);
        unset($this->uuid);
    }

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

    public function unset(string $key){
        // check if attribute exists and check if key is NOT a function
        if(isset($this->{$key}) && method_exists($this, $key) === false){
            unset($this->{$key});
        }
    }

    public function to_json($val){

        if(!is_array($val) && !is_object($val)){
            return $val;
        }

        return json_encode($val);
    }

    public function get_array(){

    }

}
