<?php
declare(strict_types=1);
ini_set('display_errors', 1);
error_reporting(E_ALL);
date_default_timezone_set('Europe/Amsterdam');

/*
 Node403 Visitor Logger
 - dagelijkse logbestanden
 - automatische verwijdering na 30 dagen
 - proxy IP detectie
 - bot detectie
*/

$TRUSTED_PROXIES = [
    '127.0.0.1',
    '::1'
];

$LOG_DIR = __DIR__ . '/../logs';

// logbestand van vandaag
$LOG_FILE = $LOG_DIR . '/visitors-' . date('Y-m-d') . '.log';

// hoeveel seconden logs bewaard blijven
$LOG_RETENTION = 30 * 24 * 60 * 60;


// map maken indien nodig
if (!is_dir($LOG_DIR)) {
    mkdir($LOG_DIR, 0755, true);
}


// oude logs verwijderen
foreach (glob($LOG_DIR . '/visitors-*.log') as $file) {
    if (filemtime($file) < time() - $LOG_RETENTION) {
        unlink($file);
    }
}


// echte client IP bepalen
function getClientIp(array $server, array $trusted): array {

    $remote = $server['REMOTE_ADDR'] ?? 'unknown';
    $source = 'REMOTE_ADDR';
    $ip = $remote;

    if ($remote !== 'unknown' && in_array($remote, $trusted, true)) {

        if (!empty($server['HTTP_CF_CONNECTING_IP'])) {
            $ip = $server['HTTP_CF_CONNECTING_IP'];
            $source = 'CF_CONNECTING_IP';
        }

        elseif (!empty($server['HTTP_X_FORWARDED_FOR'])) {
            $parts = explode(',', $server['HTTP_X_FORWARDED_FOR']);
            $candidate = trim($parts[0]);
            if (filter_var($candidate, FILTER_VALIDATE_IP)) {
                $ip = $candidate;
                $source = 'X_FORWARDED_FOR';
            }
        }

        elseif (!empty($server['HTTP_X_REAL_IP'])) {
            $candidate = $server['HTTP_X_REAL_IP'];
            if (filter_var($candidate, FILTER_VALIDATE_IP)) {
                $ip = $candidate;
                $source = 'X_REAL_IP';
            }
        }
    }

    return [$ip, $source];
}

function botLevel(string $ua): int {

    $ua = strtolower($ua);

    if (strpos($ua, 'googlebot') !== false ||
        strpos($ua, 'bingbot') !== false ||
        strpos($ua, 'applebot') !== false) {
        return 1;
    }

    if (strpos($ua, 'claudebot') !== false ||
        strpos($ua, 'scrapy') !== false) {
        return 2;
    }

    if (strpos($ua, 'headless') !== false ||
        strpos($ua, 'curl') !== false ||
        strpos($ua, 'wget') !== false ||
        strpos($ua, 'python') !== false) {
        return 3;
    }

    return 0;
}

// bot detectie
function isBot(string $ua): bool {

    $ua = strtolower($ua);

    $bots = [
        'bot',
        'spider',
        'crawl',
        'slurp',
        'bingpreview',
        'facebookexternalhit',
        'headless',
        'curl',
        'wget',
        'python',
        'scrapy'
    ];

    foreach ($bots as $b) {
        if (strpos($ua, $b) !== false) {
            return true;
        }
    }

    return false;
}


// gegevens verzamelen
[$ip, $ipSource] = getClientIp($_SERVER, $TRUSTED_PROXIES);

// eigen netwerk niet loggen
$ignore_logging =
    strpos($ip, "2a02:a45e") === 0 ||
    $ip === "127.0.0.1" ||
    $ip === "::1";

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$referrer  = $_SERVER['HTTP_REFERER'] ?? '';
$path      = $_SERVER['REQUEST_URI'] ?? '';
$method    = $_SERVER['REQUEST_METHOD'] ?? '';
$host      = $_SERVER['HTTP_HOST'] ?? '';

$bot = botLevel($userAgent);

$entry = [
    'ts' => date('c'),
    'ip' => $ip,
    'ipSource' => $ipSource,
    'method' => $method,
    'host' => $host,
    'path' => $path,
    'ref' => $referrer,
    'ua' => $userAgent,
    'bot' => $bot
];

if (!$ignore_logging) {
    file_put_contents(
        $LOG_FILE,
        json_encode($entry, JSON_UNESCAPED_SLASHES) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );
}
