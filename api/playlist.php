<?php

header("Content-Type: application/json");

$dir = __DIR__ . "/../assets/audio/";

$files = [];

foreach (scandir($dir) as $file) {

    if (pathinfo($file, PATHINFO_EXTENSION) === "mp3") {

        $files[] = [
            "title" => preg_replace('/\.mp3$/','',$file),
            "file"  => "assets/audio/" . $file
        ];

    }
}

echo json_encode($files);
