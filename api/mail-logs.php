<?php

$LOG_DIR = __DIR__ . '/../logs';
$TO = "webmaster@node403.com";

$files = glob($LOG_DIR . '/visitors-*.log');

if (!$files) {
    exit;
}

$body = "Node403 visitor logs\n\n";

foreach ($files as $file) {

    $name = basename($file);

    $body .= "===== $name =====\n";
    $body .= file_get_contents($file);
    $body .= "\n\n";
}

mail(
    $TO,
    "Node403 Daily Visitor Logs",
    $body
);
