<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User\Data;

class Recipe_Read_Item {
    public ?string $id = null;
    public ?string $title = '';
    public ?string $state = 'draft';
    public ?string $categories = '{}';
    public ?string $info = '';
    public ?string $portions = '1';
    public ?string $preparation = '';
    public ?string $preparation_meta = '{}';
    public ?string $ingredients = '{}';
    public ?string $media = '{}';
    public ?string $created = '1970-01-01 00:00:00';
    public ?string $edited = '1970-01-01 00:00:00';
}
