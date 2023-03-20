<?php
namespace SV_Grillfuerst_User_Recipes\Middleware\Products\Data;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Data\Product_Model_Item;

class Product_Insert_Item extends Product_Model_Item {
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
