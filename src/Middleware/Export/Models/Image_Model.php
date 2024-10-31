<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Export\Models;

class Image_Model {
    public int $id = 0;
    public ?string $url = null;
    public ?string $path = null;
    public ?string $filename = null;
    public ?string $type = 'image';
    public ?string $title = '';
    public ?string $description = '';
}
