<?php
namespace SV_Grillfuerst_User_Recipes\Middleware\Media\Service;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Data\Media_Item;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Media_Upload_Service {
    private Adapter $Adapter;

    public function __construct(Adapter $Adapter){
        $this->Adapter = $Adapter;
    }

    public function add($file): array{
        var_dump($file);die;
        $item = $this->Adapter->Filesystem->add($file);

        return $this->apply_data($item);
    }

    private function apply_data(array $item): Media_Item{

        foreach(new Media_Item() as $key => &$val){
            $val = isset($item[$key]) ? $item[$key] : $val;
        }

        return $this->Media;
    }
}
