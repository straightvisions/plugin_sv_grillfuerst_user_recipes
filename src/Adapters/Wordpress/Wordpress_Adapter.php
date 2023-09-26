<?php

namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

final class Wordpress_Adapter{
    public Request $Request;
    public Shortcode $Shortcode;
    public Action $Action;
    public Asset $Asset;
    public Filesystem $Filesystem;
    public Media $Media;
    public Cache $Cache;

    // add new adapters here + config/settings
    public function __construct(
        Request $request,
        Shortcode $shortcode,
        Action $action,
        Asset $asset,
        Filesystem $filesystem,
        Media $media,
        Cache $cache
    ){
        $this->Request = $request;
        $this->Shortcode = $shortcode;
        $this->Action = $action;
        $this->Asset = $asset;
        $this->Filesystem = $filesystem;
        $this->Media = $media;
        $this->Cache = $cache;

    }
}