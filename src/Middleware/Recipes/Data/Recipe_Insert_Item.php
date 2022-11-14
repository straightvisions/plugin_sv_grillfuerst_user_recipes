<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Recipes\Data;

class Recipe_Insert_Item {
    public ?int $user_id = 0;
    public ?string $state = 'draft';
    public ?string $title = '';
    public ?string $excerpt = '';
    public ?array $categories = []; // obsolete?
    public ?string $portions = '1'; // obsolete ?
    public ?int $menu_type = 0;
    public ?int $kitchen_style = 0;
    public ?string $difficulty = 'easy';
    public ?int $preparation_time = 0;
    public ?int $cooking_time = 0;
    public ?int $waiting_time = 0;
    public ?array $ingredients = [];
    public ?array $steps = [];
    public ?string $created = 'NOW()';


}
