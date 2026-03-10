<?php
declare(strict_types=1);

header("Content-Type: application/json");

$chatDir  = __DIR__ . '/../../node403-config/chat';
$chatFile = $chatDir . '/messages.log';

if (!file_exists($chatFile)) {
    echo json_encode([]);
    exit;
}

$lines = file($chatFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

/* alleen laatste berichten laden */
$lines = array_slice($lines, -40);

$messages = [];

foreach ($lines as $line){

    $row = json_decode($line,true);
    if(!$row) continue;

    $time = "--:--:--";

    if(!empty($row['time'])){
        $t = strtotime($row['time']);
        if($t){
            $time = date("H:i:s",$t);
        }
    }

    $messages[] = [
        "time" => $time,
        "user" => $row["user"] ?? "unknown",
        "msg"  => $row["msg"]  ?? ""
    ];
}

echo json_encode($messages);

