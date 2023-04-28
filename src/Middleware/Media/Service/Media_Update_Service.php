<?php
namespace SV_Grillfuerst_User_Recipes\Middleware\Media\Service;
use SV_Grillfuerst_User_Recipes\Middleware\Media\Data\Media_Item;
use SV_Grillfuerst_User_Recipes\Adapters\Adapter;

final class Media_Update_Service {
    private Adapter $Adapter;

    public function __construct(Adapter $Adapter){
        $this->Adapter = $Adapter;
    }

    public function update(array $item, string $folder): Media_Item{
        $item = $this->renameFile($item, $folder);
        return $this->apply_data($item);
    }

    private function renameFile(array $item, string $folder): array {
        if (isset($item['newFilename']) && !empty($item['newFilename'])) {
            //@todo this should be part of the filesystem
            $filename = basename($item['filename']);
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $newFilename = basename($item['newFilename'], '.' . $extension);
            $newFilename .= '.' . $extension;

            $newFilename = $this->Adapter->Filesystem()->prepare_filename($newFilename, $folder);

            $oldPath = $item['path'] . '/' . $filename;
            $newPath = $folder . '/' . $newFilename; // using folder here prevents malicious path injection

            $_item = $item;
            $_item['filename'] = $newFilename;
            $_item = array_merge($_item, $this->Adapter->Filesystem()->prepare($_item, $folder, true));

            if( $this->Adapter->Filesystem()->rename($oldPath, $newPath) ){
                $item = $_item;
            }

        }
        return $item;
    }

    private function apply_data(array $item): Media_Item{
        $Media = new Media_Item();

        foreach($Media as $key => &$val){
            if($key === 'id' && empty($item[$key])){
                $item[$key] = $this->generateUniqueID($item);
            }
            $val = isset($item[$key]) ? $item[$key] : $val;
        }

        return $Media;
    }

    private function generateUniqueID(array $item): string{
        $salt = bin2hex(random_bytes(8));
        $item['_salt'] = $salt;

        $json = json_encode($item);
        $base64Id = base64_encode($json);

        // Remove any non-alphanumeric characters from the base64 representation
        $base64Id = preg_replace('/[^a-zA-Z0-9]/', '', $base64Id);

        // Generate a random 16-character substring from the modified base64
        $shortId = substr(str_shuffle($base64Id), 0, 16);

        return $shortId;
    }

}
