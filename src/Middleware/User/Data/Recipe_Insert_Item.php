<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\User\Data;

class Recipe_Insert_Item {
    public ?string $title = '';
    public ?string $state = 'draft';
    public ?string $categories = '{}';
    public ?string $info = '';
    public ?string $portions = '1';
    public ?string $preparation = '';
    public ?string $preparation_meta = '{}';
    public ?string $ingredients = '{}';
    public ?string $media = '{}';
}
