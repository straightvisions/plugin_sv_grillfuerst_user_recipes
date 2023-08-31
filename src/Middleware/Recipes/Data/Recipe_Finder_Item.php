<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

class Recipe_Finder_Item extends Recipe_Model_Item{
    public ?string $created = '1970-01-01 00:00:00';
    public ?string $edited = '1970-01-01 00:00:00';
    public ?string $state = 'draft';

    // useful functions to convert data before output
    public function __construct(){
        parent::__construct();
        // object types
        $this->featured_image = new Image_Model_Item();
        $this->user_meta = new User_Model_item();
        $this->app_meta = new \stdClass();
        unset($this->id);
    }

}
