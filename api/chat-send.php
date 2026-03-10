<?php
declare(strict_types=1);

header("Content-Type: application/json");

/*
 NODE403 CHAT MESSAGE ENDPOINT

 - accepteert POST JSON
 - sanitize username + message
 - slaat bericht tijdelijk op
 - bewaart max 250 berichten
 - verwijdert berichten ouder dan 24 uur
*/

if (
    $_SERVER['REQUEST_METHOD'] !== 'POST' ||
    !str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')
){
    http_response_code(400);
    echo json_encode(['ok'=>false,'error'=>'invalid_request']);
    exit;
}

/* ================================
 CONFIG
================================ */

$chatDir  = __DIR__ . '/../../node403-config/chat';
$chatFile = $chatDir . '/messages.log';

$maxMessages = 250;
$maxAge      = 86400; // 24 uur


/* ================================
 DIRECTORY CHECK
================================ */

if (!is_dir($chatDir)) {
    mkdir($chatDir,0755,true);
}


/* ================================
 INPUT
================================ */

$input = json_decode(file_get_contents("php://input"), true);

$user = trim((string)($input['user'] ?? ''));
$msg  = trim((string)($input['msg'] ?? ''));


/* ================================
 SANITIZE
================================ */

$user = preg_replace('/[^a-zA-Z0-9_-]/','',$user);
$user = substr($user,0,20);

$msg  = substr($msg,0,200);


/* ================================
 VALIDATE
================================ */

if ($user === '' || $msg === '') {
    http_response_code(400);
    echo json_encode(['ok'=>false,'error'=>'empty']);
    exit;
}


/* ================================
 LOAD EXISTING MESSAGES
================================ */

$lines = [];

if (file_exists($chatFile)) {
    $lines = file($chatFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
}


/* ================================
 REMOVE OLD MESSAGES
================================ */

$filtered = [];
$now = time();

foreach ($lines as $line){

    $row = json_decode($line,true);
    if(!$row) continue;

    $timestamp = strtotime($row['time'] ?? '');

    if($timestamp && ($now - $timestamp) < $maxAge){
        $filtered[] = $line;
    }
}


/* ================================
 ADD NEW MESSAGE
================================ */

$entry = [
    'time' => date('c'),
    'user' => $user,
    'msg'  => $msg
];

$filtered[] = json_encode($entry, JSON_UNESCAPED_SLASHES);


/* ================================
 LIMIT TOTAL MESSAGES
================================ */

if(count($filtered) > $maxMessages){
    $filtered = array_slice($filtered, -$maxMessages);
}


/* ================================
 WRITE FILE
================================ */

file_put_contents(
    $chatFile,
    implode(PHP_EOL, $filtered) . PHP_EOL,
    LOCK_EX
);


/* ================================
 RESPONSE
================================ */

echo json_encode(['ok'=>true]);


