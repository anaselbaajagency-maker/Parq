<?php
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size: " . ini_get('post_max_size') . "\n";
echo "storage_path: " . storage_path() . "\n";
echo "is_writable(storage/app/public): " . (is_writable(storage_path('app/public')) ? 'YES' : 'NO') . "\n";
echo "public/storage link: " . (file_exists(public_path('storage')) ? 'EXISTS' : 'MISSING') . "\n";
