<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

class Image_Model_Item {
    public int $id = 0;
    public ?string $url = null;
    public ?string $path = null;
    public ?string $filename = null;
    public ?string $type = 'image';
    public ?string $title = '';
    public ?string $description = '';
}
