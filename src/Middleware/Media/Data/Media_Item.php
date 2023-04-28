<?php

namespace SV_Grillfuerst_User_Recipes\Middleware\Media\Data;

final class Media_Item {
    public ?string $id = null;
    public ?string $url = null;
    public ?string $path = null;
    public ?string $filename = null;
    public string $title = '';
    public string $description = '';

    public function clean_up(){
        $this->id = null;
        $this->url = null;
        $this->path = null;
        $this->filename = null;
        $this->title = '';
        $this->description = '';
    }

    public function __serialize(){
        return [
            'id' => $this->id,
            'url' => $this->url,
            'path' => $this->path,
            'filename' => $this->filename,
            'title' => $this->title,
            'description' => $this->description,
        ];
    }
}
