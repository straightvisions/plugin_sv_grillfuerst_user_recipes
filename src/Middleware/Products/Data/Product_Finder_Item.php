<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Products\Data;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Data\Product_Model_Item;

class Product_Finder_Item extends Product_Model_Item{
    public array|string $images = [];
    // set an "id" field for frontend (it's a duplicate of products_id
    public function setId($id){
        $this->id = (int)$id;
    }
    public function setLabel($name){
        $this->label = (string)$name;
    }

}
