<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export\Models;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Service\Product_Finder_Service;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Image_Model_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Model_Item;

class Recipe_Exporter_Model extends Recipe_Model_Item{
    public ?string $created = '1970-01-01 00:00:00';
    public ?string $edited = '1970-01-01 00:00:00';
    public ?string $state = 'draft';
    private Product_Finder_Service $Product_Finder_Service;

    // useful functions to convert data before output
    public function __construct(array $data, Product_Finder_Service $Product_Finder_Service){
        parent::__construct();
        // object types
        $this->featured_image = new Image_Model_Item();
        $this->Product_Finder_Service = $Product_Finder_Service;
		$this->apply_data($data);
    }

	private function apply_data($data){
		foreach ($data as $key => $value) {
			if (property_exists($this, $key)) {
				$this->set($key, $value);
			}
		}
	}

    public function get(string $field, mixed $default = ''){
        return method_exists($this, 'get_'.$field) ? call_user_func([$this, 'get_'.$field]) : parent::get($field, $default);
    }

    private function get_ingredients(){
        $list = $this->ingredients;
        $output = [];
        foreach($list as $k => $d){
            $product = isset($d->products_id) ? $this->get_product($d->products_id) : null;
            $image = $this->get_product_thumb($product);

            $output[] =  [
                'acf_fc_layout' => 'ingredient',
                'ingredient' => $d->id,
                'amount' => (string) $this->get_amount4p($d),
                'comment' => $d->note,
                'differing_unit' => $d->unit,
                'shop_product_name' => $product ? $product->name : '',
                'shop_product_id' => $product ? (int) $product->products_id : 0,
                'shop_product_url' => $product ? $product->link : '',
                'shop_product_thumb' => $product ? $image  : '',
                'shop_product_sku' => $product ? $product->model : '',
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

            $image = $this->get_product_thumb($product);

            $output[] =  [
                'acf_fc_layout' => 'accessory',
                'shop_product_name' => $product->name,
                'shop_product_id' => (int) $product->products_id ?? 0,
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
            $output[] =  [
                'acf_fc_layout' => 'step',
                'description' => $d->description,
                'gallery' => $d->images,
            ];
        }

        return $output;
    }

    private function get_product_thumb($product) {
        if (!$product) {
            return null; // Return null if $product is null
        }

        if (!isset($product->images) || !isset($product->images[0])) {
            return null; // Return null if images array or images[0] is not set
        }

        return $product->images[0];
    }

    function get_amount4p($ingredient){
        // fallback for old recipes
        $servings = $this->servings;
        $factor = $servings / 4;
        $amount4p = isset($ingredient->amount4p) && !empty($ingredient->amount4p) ? $ingredient->amount4p : $ingredient->amount * $factor;

        return $ingredient->scalable ? $amount4p : $ingredient->amount;
    }

}
