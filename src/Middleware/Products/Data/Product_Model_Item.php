<?php
namespace SV_Grillfuerst_User_Recipes\Middleware\Products\Data;

class Product_Model_Item {
    public int $products_id = 0;
    public string $model = '';
    public string $ean = '';
    public string $name = '';
    public string $brand = '';
    public string $description_short = '';
    public array|string $images = '[]';
    public string $link = '';

    // useful functions to convert data before output
    public function __construct(){}

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

    public function get(string $field, mixed $default = ''){
        return property_exists($this, $field) ? $this->{$field} : $default;
    }

    public function to_array($val){

        if(is_array($val)){
            return $val;
        }

        if(is_array(json_decode($val))){
            $val = json_decode($val);
        }else{
            //$this->_errors[] = 'array value is not a valid json string';
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
            //$this->_errors[] = 'object value is not a valid json string';
        }

        return $val;
    }

}
