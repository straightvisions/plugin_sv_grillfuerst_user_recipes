<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

final class Recipe_Finder_Result {
    /**
     * @var Recipe_Reader_Item[]
     */
    public array $items = [];
    public int $page = 1;
    public int $totalPages = 0;
    public int $totalRows = 0;
}
