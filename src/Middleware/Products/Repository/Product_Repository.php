<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Products\Repository;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Data\Product_Insert_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Data\Product_Update_Item;
use SV_Grillfuerst_User_Recipes\Factory\Query_Factory;
use DomainException;

final class Product_Repository {
    private Query_Factory $Query_Factory;
    private $table = 'svgfur_recipes_products';

    public function __construct(Query_Factory $Query_Factory) {
        $this->Query_Factory = $Query_Factory;
    }

    public function import(array $items): void{

        $importItems = [];

        foreach($items as $key => $item){
            $Product_Item = new Product_Insert_Item();
            $importItems[] = $this->to_row($item, $Product_Item);
        }

        $this->Query_Factory->newBulkInsert($this->table, $importItems);
    }
    
    public function insert(array $product): int {
        $Product_Item = new Product_Insert_Item();

        return (int)$this->Query_Factory->newInsert($this->table, $this->to_row($product, $Product_Item))
                                       ->execute()
                                       ->lastInsertId();
    }
    
    public function get_by_id(int $product_id): array {
        $query = $this->Query_Factory->newSelect($this->table);
        $query->select(
            [
                '*',
            ]
        );

        $query->where(['products_id' => $product_id]);

        $row = $query->execute()->fetch('assoc');

        if (!$row) {
            throw new DomainException(sprintf('Product not found: %s', $product_id));
        }

        return $row;
    }

    public function update(int $product_id, array $product): void {
        $Product_Item = new Product_Update_Item();

        $row = $this->to_row($product, $Product_Item);

        $this->Query_Factory->newUpdate($this->table, $row)
                           ->where(['products_id' => $product_id])
                           ->execute();
    }

    public function exists_id(int $product_id): bool {
        $query = $this->Query_Factory->newSelect($this->table);
        $query->select('products_id')->where(['products_id' => $product_id]);

        return (bool)$query->execute()->fetch('assoc');
    }

    public function exists_uuid(int $uuid): bool {
        $query = $this->Query_Factory->newSelect($this->table);
        $query->select('products_id')->where(['products_id' => $uuid]);

        return (bool)$query->execute()->fetch('assoc');
    }

    public function delete_by_id(int $product_id): void {
        $this->Query_Factory->newDelete($this->table)
                           ->where(['products_id' => $product_id])
                           ->execute();
    }

    private function to_row(array $product, $Product_Item): array {
        $data = [];

        foreach($Product_Item as $key => $default_value) {
            // don't add non-existing values to the update array, otherwise we will overwrite database
            // rows with default data. defaults should only be used in the inserter / creator
            if(isset($product[$key])){
                $data[$key] = $Product_Item->set($key, $product[$key]);
            }

        }

        return $data;
    }

}
