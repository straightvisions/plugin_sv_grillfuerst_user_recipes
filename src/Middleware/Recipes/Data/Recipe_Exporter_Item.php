<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Model_Item;

class Recipe_Exporter_Item extends Recipe_Model_Item{
    public ?string $created = '1970-01-01 00:00:00';
    public ?string $edited = '1970-01-01 00:00:00';
    public ?string $state = 'draft';

    // useful functions to convert data before output
    public function __construct(){
        parent::__construct();
        // object types
        $this->featured_image = new Image_Model_Item();
    }

    public function get(string $field, mixed $default = ''){
        return method_exists($this, 'get_'.$field) ? call_user_func([$this, 'get_'.$field]) : parent::get($field, $default);
    }

    private function get_ingredients(){
        $list = $this->ingredients;
        $output = [];
        foreach($list as $k => $d){
            $output[] =  [
                'acf_fc_layout' => 'ingredient',
                'ingredient' => $d->id,
                'amount' => $d->amount,
                'comment' => $d->note,
                'differing_unit' => $d->unit,
                'position'=>0,
            ];
        }

        return $output;
    }

    private function get_steps(){
        $list = $this->steps;
        $output = [];
        foreach($list as $k => $d){
            $image_ids = array_map(function($image) {
                return $image->id;
            }, $d->images);

            $output[] =  [
                'acf_fc_layout' => 'step',
                'description' => $d->description,
                'gallery' => $image_ids,
            ];
        }

        return $output;
    }

}
