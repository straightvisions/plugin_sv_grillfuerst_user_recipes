<?php
namespace SV_Grillfuerst_User_Recipes\Middleware\Media\Service;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Data\Media_Item;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Media_Upload_Service {
    private Adapter $Adapter;

    public function __construct(Adapter $Adapter){
        $this->Adapter = $Adapter;
    }

    public function add_multiple(array $files, string $folder = ''): array{
        $folder = empty($folder) ? $this->get_hashed_folder_name() : $folder;
        $items = [];

        foreach($files as $key => $file){
            $items[] = $this->add($file, $folder);
        }

        return $items;
    }

    public function add(array $file, string $folder = ''): Media_Item{
        $folder = empty($folder) ? $this->get_hashed_folder_name() : $folder;
        $item = $this->Adapter->Filesystem()->add($file, $folder);

        return $this->apply_data($item);
    }

    private function apply_data(array $item): Media_Item{
        $Media = new Media_Item();

        foreach($Media as $key => &$val){
            $val = isset($item[$key]) ? $item[$key] : $val;
        }

        return $Media;
    }

    private function get_hashed_folder_name(int $length = 32): string{
        $key = '';
        $keys = array_merge(range(0, 9), range('a', 'z'));

        for ($i = 0; $i < $length; $i++) {
            $key .= $keys[array_rand($keys)];
        }

        // do a round trip when dir already exists
        return $this->Adapter->Filesystem()->dir_exists($key) ? $this->get_hashed_folder_name($length) : $key;
    }
}
