<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Products\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Products\Data\Product_Finder_Item;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Data\Product_Finder_Result;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Repository\Product_Repository;

final class Product_Finder_Service {
    private Product_Repository $repository;

    public function __construct(Product_Repository $repository) {
        $this->repository = $repository;
    }

    public function get_list(array $params = []): Product_Finder_Result {
        $rows = $this->repository->get($params);

        return $this->create_result($rows);
    }

    public function get(int $products_id): Product_Finder_Result {
        $rows = [$this->repository->get_by_id($products_id)];

        return $this->create_result($rows);
    }

    private function create_result(array $rows): Product_Finder_Result {
        $result = new Product_Finder_Result();

        foreach ($rows as $row) {
            $item = new Product_Finder_Item();

            $result->items[] = $this->apply_data($item, $row);
        }

        return $result;
    }

    private function apply_data(Product_Finder_Item $item, array $row): Product_Finder_Item {
        foreach ($row as $key => $value) {
            if (property_exists($item, $key)) {
                $item->set($key, $value);
            }

            // custom
            if($key === 'products_id'){
                $item->setId($value);
            }

            if($key === 'name'){
                $item->setLabel($value);
            }
        }

        return $item;
    }

}
