<?php

function admin_log(string $event): void {

    $logDir = __DIR__ . '/../../node403-config/logs';

    if (!is_dir($logDir)) {
        mkdir($logDir,0755,true);
    }

    $file = $logDir . '/admin.log';

    $time = date('Y-m-d H:i:s');
    $ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $ua   = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

    $line = "$time | $ip | $event | $ua\n";

    file_put_contents($file,$line,FILE_APPEND | LOCK_EX);
}

