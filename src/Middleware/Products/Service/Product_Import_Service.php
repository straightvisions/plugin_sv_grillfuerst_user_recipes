<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Products\Service;
use SV_Grillfuerst_User_Recipes\Middleware\Products\Repository\Product_Repository;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Log\LoggerInterface;

final class Product_Import_Service {
    private Product_Repository $Repository;
    private LoggerInterface $Logger;


    public function __construct(
        Product_Repository $Repository,
        Logger_Factory $Logger_Factory
    ) {
        $this->Repository = $Repository;
        $this->Logger     = $Logger_Factory
            ->addFileHandler('product_import.log')
            ->createLogger();
    }

    public function import(array $list): void {
        // Insert item and get new item ID
        $this->Repository->import($list);

        // Logging
        $this->Logger->info(sprintf('%s Products imported successfully: ', count($list)));
    }

}