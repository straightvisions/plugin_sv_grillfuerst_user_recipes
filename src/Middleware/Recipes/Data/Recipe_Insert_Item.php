<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

class Recipe_Insert_Item {
    public ?string $title = '';
    public ?int $user_id = 0;
    public ?string $state = 'draft';
    public ?array $categories = [];
    public ?string $info = '';
    public ?string $portions = '1';
    public ?string $preparation = '';
    public ?array $preparation_meta = [];
    public ?array $ingredients = [];
    public ?array $media = [];
    public ?string $created = 'NOW()';


}
