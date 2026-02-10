<?php
// Upload this file to your public_html or sub-domain root
// Access it via your browser: https://api.parq.ma/symlink_helper.php

$target = $_SERVER['DOCUMENT_ROOT'] . '/../storage/app/public'; 
// Adjust the path above if your 'storage' folder is in a different location relative to the public folder.
// Standard Laravel structure assumes public is inside the root, so storage is one level up (../)

$link = $_SERVER['DOCUMENT_ROOT'] . '/storage';

echo "Target: " . $target . "<br>";
echo "Link: " . $link . "<br>";

if(file_exists($link)) {
    echo "Link already exists.";
} else {
    if(symlink($target, $link)) {
        echo "Symlink created successfully.";
    } else {
        echo "Failed to create symlink. Check permissions.";
    }
}
?>
