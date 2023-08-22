<?php
namespace SV_Grillfuerst_User_Recipes\Middleware\Media\Service;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Data\Media_Item;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Media_Export_Service {
    private Adapter $Adapter;

    public function __construct(Adapter $Adapter){
        $this->Adapter = $Adapter;
    }

    public function export_file($media_object): int|bool {
        $file = $this->get_file($media_object);
        $meta = $this->get_meta($media_object);

        return $this->Adapter->Media()->add($file, $meta);
    }

    public function export_files($media_objects_list): array {
        $data = [];

        foreach($media_objects_list as $media_object) {
            $data[] = $this->export_file($media_object);
        }

        return $data;
    }

    public function link(int $id, int|array $media_id): void{
        if(is_array($media_id)){
            foreach($media_id as $mid){
                $this->Adapter->Media()->link($id, $mid);
            }
        }else{
            $this->Adapter->Media()->link($id, $media_id);
        }
    }

    private function sync(){

    }

    private function get_file($media_object) {
        $localFilePath = $this->Adapter->Filesystem()->get_path($media_object->path.'/'. $media_object->filename);

        $fileName = basename($localFilePath);
        $fileType = mime_content_type($localFilePath);
        $fileSize = filesize($localFilePath);

        $file = [
            'name' => $fileName,
            'type' => $fileType,
            'tmp_name' => $localFilePath,
            'error' => 0, // No error
            'size' => $fileSize
        ];

        return $file;
    }

    private function get_meta($media_object) {
        return [
            'title' => $media_object->title,
            'description' => $media_object->description,
            'alt_text' => $media_object->alt_text,
            'caption' => $media_object->caption,
        ];
    }

}
