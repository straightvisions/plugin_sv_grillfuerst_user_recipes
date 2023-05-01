<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Model_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Service\Product_Finder_Service;

class Recipe_Exporter_Item extends Recipe_Model_Item{
    public ?string $created = '1970-01-01 00:00:00';
    public ?string $edited = '1970-01-01 00:00:00';
    public ?string $state = 'draft';
    private Product_Finder_Service $Product_Finder_Service;

    // useful functions to convert data before output
    public function __construct(Product_Finder_Service $Product_Finder_Service){
        parent::__construct();
        // object types
        $this->featured_image = new Image_Model_Item();
        $this->Product_Finder_Service = $Product_Finder_Service;
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
                'shop_product_name' => $d->label,
                'shop_product_id' => $d->id ?? '',
                'shop_product_url' => $d->url ?? '',
                'shop_product_thumb' => $d->image ?? '',
                'shop_product_sku' => $d->sku ?? '',
                'position'=>0,
            ];
        }

        return $output;
    }

    private function get_accessories(){
        $list = $this->accessories;
        $output = [];

        foreach($list as $k => $d){
            //@todo load product from custom database table
            $product = $this->get_product($d->id);
            // skip if empty
            if(!$product) continue;

            $image = !isset($product->images[0]) ?? '';
            $output[] =  [
                'acf_fc_layout' => 'accessory',
                'shop_product_name' => $product->name,
                'shop_product_id' => $product->products_id ?? '',
                'shop_product_url' => $product->link ?? '',
                'shop_product_thumb' => $image,
                'shop_product_sku' => $product->model ?? '',
                'position'=>0,
            ];
        }

        return $output;
    }

    private function get_product(int $id){
        $results = $this->Product_Finder_Service->get($id);
        return $results->items[0] ?? null;
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
