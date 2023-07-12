<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Service;

use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Repository\Recipe_Repository;
use SV_Grillfuerst_User_Recipes\Factory\Logger_Factory;
use Psr\Log\LoggerInterface;

final class Recipe_Deleter_Service {
    private Recipe_Repository $Repository;
    private LoggerInterface $Logger;

    public function __construct(
        Recipe_Repository $Repository,
        Logger_Factory $Logger_Factory
    ) {
        $this->Repository       = $Repository;
        $this->Logger           = $Logger_Factory
            ->addFileHandler('recipe_deleter.log')
            ->createLogger();
    }

    //@todo implement media delete
    public function delete(int $uuid): bool{
        $this->Logger->info(sprintf('Recipe deleted successfully: %s', $uuid));
        return $this->Repository->delete($uuid);
    }

}
