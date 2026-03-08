<?php

header("Content-Type: application/json");

$ip = $_SERVER["REMOTE_ADDR"];

$url = "https://ipinfo.io/{$ip}/json";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

$asn = null;
$org = null;

if(!empty($data["org"])){

 $parts = explode(" ", $data["org"], 2);

 if(str_starts_with($parts[0], "AS")){
   $asn = $parts[0];
   $org = $parts[1] ?? null;
 }else{
   $org = $data["org"];
 }

}

echo json_encode([
 "ip" => $ip,
 "city" => $data["city"] ?? null,
 "country" => $data["country"] ?? null,
 "asn" => $asn,
 "org" => $org
]);
