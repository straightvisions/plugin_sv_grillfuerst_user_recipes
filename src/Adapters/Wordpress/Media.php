<?php
namespace SV_Grillfuerst_User_Recipes\Adapters\Wordpress;

final class Media {

    public function add($file, $meta = []): int {
    
        if ($file && $file['type'] !== 'directory') {
            $uploadDir = wp_upload_dir();
            $filePath = $uploadDir['path'] . '/' . $file['name'];

            // Move the file from the temporary location to the uploads directory
            if (copy($file['tmp_name'], $filePath)) {
                // Prepare image data for WordPress Media Library
                $attachment = array(
                    'post_title' => $file['name'],
                    'post_content' => '',
                    'post_status' => 'inherit',
                    'post_mime_type' => mime_content_type($filePath),
                );

                // Insert the image into the WordPress Media Library
                $attachmentId = wp_insert_attachment($attachment, $filePath);

                if ($attachmentId) {
                    require_once(ABSPATH . 'wp-admin/includes/image.php');
                    // Add image meta data
                    wp_update_attachment_metadata($attachmentId, wp_generate_attachment_metadata($attachmentId, $filePath));
                    // Add post meta data
                    wp_update_post([
                        'ID' => $attachmentId,
                        'post_title' => $meta['title'] ?? '',
                        'post_excerpt' => $meta['caption'] ?? '',
                        'post_content' => $meta['description'] ?? '',
                    ]);
                    // Add alt text
                    update_post_meta($attachmentId, '_wp_attachment_image_alt', $meta['alt_text']);

                } else {
                    error_log('Error while adding media file: ' . $file['name'] . ' to media library. -> ID is false');
                }
            } else {
                error_log('Error while moving media file: ' . $file['name'] . ' to uploads directory.');
            }
        }

        return $attachmentId ?? false;
    }

    public function link(int $postId, int $mediaId): int|bool{
        // add media to post
        $result = wp_update_post([
            'ID' => $mediaId,
            'post' => $postId,
        ]); // int|WP_Error
        return is_numeric($result) ? $result : false;
    }

}
