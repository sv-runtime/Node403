<?php
declare(strict_types=1);

header("Content-Type: application/json");

$chatDir = __DIR__ . '/../../node403-config/chat';
$presenceDir = $chatDir . '/presence';

if (!is_dir($presenceDir)) {
    mkdir($presenceDir, 0755, true);
}

/* ================================
 INPUT
================================ */

$input = json_decode(file_get_contents("php://input"), true);

$user = trim((string)($input['user'] ?? ''));
$token = trim((string)($input['token'] ?? ''));

$user = preg_replace('/[^a-zA-Z0-9_-]/', '', $user);
$user = substr($user, 0, 20);

if ($user === '') {
    echo json_encode(['ok' => false]);
    exit;
}

$now = time();


/* ================================
 CLEANUP (oude users verwijderen)
================================ */

foreach (glob($presenceDir . '/*.json') as $file) {

    $data = json_decode(file_get_contents($file), true);

    if (!$data) {
        @unlink($file);
        continue;
    }

    if (($data['time'] ?? 0) < $now - 5) {
        @unlink($file);
    }
}


/* ================================
 USER FILE
================================ */

$userFile = $presenceDir . '/' . $user . '.json';
$existing = null;

if (file_exists($userFile)) {

    $existing = json_decode(file_get_contents($userFile), true);

    if (!$existing) {
        @unlink($userFile);
        $existing = null;
    }
}


/* ================================
 USERNAME CHECK
================================ */

if ($existing && ($existing['time'] ?? 0) >= $now - 30) {

    $existingToken = (string)($existing['token'] ?? '');

    /* andere gebruiker -> blokkeren */

    if ($token === '' || $existingToken === '' || !hash_equals($existingToken, $token)) {

        echo json_encode([
            'ok' => false,
            'error' => 'username_taken'
        ]);

        exit;
    }
}


/* ================================
 TOKEN GENEREREN / HERGEBRUIKEN
================================ */

if ($existing && !empty($existing['token']) && $token !== '' && hash_equals($existing['token'], $token)) {

    $tokenToStore = $existing['token'];

} else {

    $tokenToStore = bin2hex(random_bytes(16));

}


/* ================================
 PRESENCE OPSLAAN
================================ */

file_put_contents(
    $userFile,
    json_encode([
        'user'  => $user,
        'time'  => $now,
        'token' => $tokenToStore
    ]),
    LOCK_EX
);


/* ================================
 ONLINE USERS
================================ */

$users = [];

foreach (glob($presenceDir . '/*.json') as $file) {

    $data = json_decode(file_get_contents($file), true);

    if (!$data) {
        continue;
    }

    $users[] = $data['user'] ?? basename($file, '.json');
}

sort($users);


/* ================================
 RESPONSE
================================ */

echo json_encode([
    'ok'    => true,
    'token' => $tokenToStore,
    'users' => $users
]);
