<?php

header("Content-Type: application/json");

$logDir = __DIR__ . "/../../node403-config/logs/";

$files = glob($logDir . "visitors-*.log");

if (!$files) {
    echo json_encode([]);
    exit;
}

usort($files, function($a, $b) {
    return filemtime($b) - filemtime($a);
});

$latestLog = $files[0];

$lines = array_slice(file($latestLog), -10);

$data = [];

foreach ($lines as $line) {

    $json = json_decode(trim($line), true);

    if ($json) {
        $data[] = $json;
    }

}

echo json_encode($data);
