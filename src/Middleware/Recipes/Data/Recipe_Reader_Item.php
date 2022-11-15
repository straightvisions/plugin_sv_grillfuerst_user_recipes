<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;
use SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data\Recipe_Model_Item;

class Recipe_Reader_Item extends Recipe_Model_Item{
    public ?string $created = '1970-01-01 00:00:00';
    public ?string $edited = '1970-01-01 00:00:00';
    public ?string $state = 'draft';
}
