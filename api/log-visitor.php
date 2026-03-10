<?php
declare(strict_types=1);

/* ================================
   REQUEST VALIDATION
================================ */

if (
 $_SERVER['REQUEST_METHOD'] !== 'POST' ||
 !str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')
){
 http_response_code(400);
 exit;
}

date_default_timezone_set('Europe/Amsterdam');

/*
 Node403 Visitor Logger
 - dagelijkse logbestanden
 - automatische cleanup (30 dagen)
 - proxy IP detectie
 - bot detectie
 - GeoIP lookup
*/

require_once __DIR__ . '/../vendor/autoload.php';

use GeoIp2\Database\Reader;


/* ================================
   CONFIG
================================ */

$LOG_DIR = __DIR__ . '/../../node403-config/logs';

$LOG_RETENTION_SECONDS = 30 * 24 * 60 * 60;

$LOG_FILE = $LOG_DIR . '/visitors-' . date('Y-m-d') . '.log';

$TRUSTED_PROXIES = [
    '127.0.0.1',
    '::1'
];

$GEOIP_CITY_DB = __DIR__ . '/../data/geoip/GeoLite2-City.mmdb';
$GEOIP_ASN_DB  = __DIR__ . '/../data/geoip/GeoLite2-ASN.mmdb';


/* ================================
   GEOIP INIT
================================ */

$geoCityReader = file_exists($GEOIP_CITY_DB) ? new Reader($GEOIP_CITY_DB) : null;
$geoAsnReader  = file_exists($GEOIP_ASN_DB)  ? new Reader($GEOIP_ASN_DB)  : null;


/* ================================
   LOG DIRECTORY
================================ */

if (!is_dir($LOG_DIR)) {
    mkdir($LOG_DIR, 0755, true);
}


/* ================================
   CLEANUP OLD LOGS
================================ */

$cleanupMarker = $LOG_DIR . '/.cleanup';

if (!file_exists($cleanupMarker) || filemtime($cleanupMarker) < time() - 3600) {

    foreach (glob($LOG_DIR . '/visitors-*.log') as $file) {

        if (filemtime($file) < time() - $LOG_RETENTION_SECONDS) {
            @unlink($file);
        }

    }

    touch($cleanupMarker);

}


/* ================================
   CLIENT IP DETECTION
================================ */

function getClientIp(array $server, array $trustedProxies): array {

    $remote = $server['REMOTE_ADDR'] ?? 'unknown';
    $source = 'REMOTE_ADDR';
    $ip = $remote;

    if ($remote !== 'unknown' && in_array($remote, $trustedProxies, true)) {

        if (!empty($server['HTTP_CF_CONNECTING_IP'])) {

            $candidate = $server['HTTP_CF_CONNECTING_IP'];

            if (filter_var($candidate, FILTER_VALIDATE_IP)) {
                $ip = $candidate;
                $source = 'CF_CONNECTING_IP';
            }

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


/* ================================
   BOT DETECTION
================================ */

function botLevel(string $ua): int {

    $ua = strtolower($ua);

    if (
        str_contains($ua, 'googlebot') ||
        str_contains($ua, 'bingbot') ||
        str_contains($ua, 'applebot')
    ) {
        return 1;
    }

    if (
        str_contains($ua, 'claudebot') ||
        str_contains($ua, 'scrapy')
    ) {
        return 2;
    }

    if (
        str_contains($ua, 'headless') ||
        str_contains($ua, 'curl') ||
        str_contains($ua, 'wget') ||
        str_contains($ua, 'python')
    ) {
        return 3;
    }

    return 0;

}


/* ================================
   GEO LOOKUP
================================ */

function geoCityLookup(string $ip, ?Reader $reader): array {

    if (!$reader) {
        return [
            'country'=>null,
            'region'=>null,
            'city'=>null,
            'lat'=>null,
            'lon'=>null
        ];
    }

    try {

        $r = $reader->city($ip);

        return [
            'country' => $r->country->name ?? null,
            'region'  => $r->mostSpecificSubdivision->name ?? null,
            'city'    => $r->city->name ?? null,
            'lat'     => $r->location->latitude ?? null,
            'lon'     => $r->location->longitude ?? null
        ];

    } catch (Throwable) {

        return [
            'country'=>null,
            'region'=>null,
            'city'=>null,
            'lat'=>null,
            'lon'=>null
        ];

    }

}

function geoAsnLookup(string $ip, ?Reader $reader): array {

    if (!$reader) {
        return [
            'asn'=>null,
            'org'=>null
        ];
    }

    try {

        $r = $reader->asn($ip);

        return [
            'asn' => $r->autonomousSystemNumber ?? null,
            'org' => $r->autonomousSystemOrganization ?? null
        ];

    } catch (Throwable) {

        return [
            'asn'=>null,
            'org'=>null
        ];

    }

}


/* ================================
   REQUEST DATA
================================ */

[$ip, $ipSource] = getClientIp($_SERVER, $TRUSTED_PROXIES);

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$referrer  = $_SERVER['HTTP_REFERER'] ?? '';
$path = $_SERVER['REQUEST_URI'] ?? '';

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['page'])) {
 exit;
}

$path = $input['page'];
$method    = $_SERVER['REQUEST_METHOD'] ?? '';
$host      = $_SERVER['HTTP_HOST'] ?? '';

$bot = botLevel($userAgent);


/* ================================
   GEO DATA
================================ */

$geo1 = $ip !== 'unknown'
    ? geoCityLookup($ip, $geoCityReader)
    : ['country'=>null,'region'=>null,'city'=>null,'lat'=>null,'lon'=>null];

$geo2 = $ip !== 'unknown'
    ? geoAsnLookup($ip, $geoAsnReader)
    : ['asn'=>null,'org'=>null];


/* ================================
   INTERNAL NETWORK FILTER
================================ */

$ignoreIps = [
    "127.0.0.1",
    "::1",
    "86.82.205.209"
];

$ignoreLogging =
    str_starts_with($ip, "2a02:a45e") ||
    in_array($ip, $ignoreIps, true);


/* ================================
   LOG ENTRY
================================ */

$entry = [

    'time' => date('c'),

    'ip' => [
        'address' => $ip,
        'source'  => $ipSource
    ],

    'geo' => $geo1,

    'network' => $geo2,

    'request' => [
        'method' => $method,
        'host'   => $host,
        'path'   => $path,
        'ref'    => $referrer
    ],

    'client' => [
        'ua'  => $userAgent,
        'bot' => $bot
    ]

];


/* ================================
   WRITE LOG
================================ */

if (!$ignoreLogging) {

    file_put_contents(
        $LOG_FILE,
        json_encode($entry, JSON_UNESCAPED_SLASHES) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

}
