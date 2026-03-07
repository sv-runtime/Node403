<?php
$title = "HTTP 415 Unsupported Media Type – Invalid Content-Type Requests";
$description = "Technical documentation explaining the HTTP 415 Unsupported Media Type status code. Learn why servers reject requests with unsupported content types and how developers diagnose media type errors.";
?>

<!DOCTYPE html>

<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KGB3F6B4FS"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-KGB3F6B4FS', {
  anonymize_ip: true
});
</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title><?php echo $title; ?> | Node403 Docs</title>

<meta name="description" content="<?php echo $description; ?>">
<meta name="robots" content="index, follow">

<link rel="canonical" href="https://node403.com/docs/415.php">

<meta property="og:title" content="<?php echo $title; ?>">
<meta property="og:description" content="<?php echo $description; ?>">
<meta property="og:type" content="article">
<meta property="og:url" content="https://node403.com/docs/415.php">

<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<link rel="stylesheet" href="style.css">

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191744023231140"
     crossorigin="anonymous"></script>

</head>

<body>

<div class="wrapper">

<?php include "templates/header.php"; ?>

<div class="header">

<h1>HTTP 415 Unsupported Media Type</h1>

<div class="tagline">
Explanation of unsupported request content types
</div>

<ins class="adsbygoogle"
  style="display:block;width:100%;"
  data-ad-client="ca-pub-4191744023231140"
  data-ad-slot="7043251880"
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>

<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>

</div>

<div class="section">

<h2>What the 415 Status Code Means</h2>

<p>
The <strong>HTTP 415 Unsupported Media Type</strong> status code belongs
to the <strong>4xx client error category</strong> of the HTTP specification.
These responses indicate that the server refuses to process a request
because the request payload uses a media format that the server does
not support.
</p>

<p>
A <strong>415 Unsupported Media Type</strong> response typically occurs
when the client sends data using a <code>Content-Type</code> that the
server does not recognize or accept.
</p>

<p>
This error frequently appears in API environments where servers expect
specific content formats such as JSON or XML but receive an unsupported
or incorrect media type instead.
</p>

</div>

<div class="section">

<h2>Common Causes of HTTP 415 Errors</h2>

<ul>

<li>Incorrect <code>Content-Type</code> request header</li>
<li>Sending JSON data with an incorrect media type</li>
<li>Uploading files using unsupported formats</li>
<li>API endpoints expecting specific payload formats</li>
<li>Client libraries misconfiguring request headers</li>

</ul>

</div>

<div class="section">

<h2>Example of a 415 Response</h2>

<pre>
HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json
</pre>

<p>
Servers may reject requests when the <code>Content-Type</code> header
does not match the media formats accepted by the endpoint.
</p>

</div>

<div class="section">

<h2>Typical API Scenario</h2>

<p>
Many modern APIs require requests to be submitted using specific
content formats.
</p>

<pre>
POST /api/users
Content-Type: application/xml
</pre>

<p>
If the server only accepts JSON payloads, the request may be rejected
with a <strong>415 Unsupported Media Type</strong> response.
</p>

<pre>
Expected Content-Type: application/json
</pre>

</div>

<div class="section">

<h2>How Developers Diagnose 415 Errors</h2>

<ul>

<li>Verify the <code>Content-Type</code> header in the request</li>
<li>Confirm the media formats accepted by the API</li>
<li>Inspect request payload formatting</li>
<li>Review API documentation for supported content types</li>
<li>Check server-side validation rules</li>

</ul>

<p>
Proper API documentation and validation rules help prevent clients
from submitting requests using unsupported media formats.
</p>

</div>

<?php include "templates/http-error-codes.php"; ?>

<div class="section">

<h2>Summary</h2>

<p>
The <strong>HTTP 415 Unsupported Media Type</strong> status code indicates
that a server refused to process a request because the request body
uses a media type that the server does not support.
</p>

<p>
Ensuring that requests include the correct <code>Content-Type</code>
header and compatible payload formats helps prevent 415 errors when
interacting with APIs and web services.
</p>

</div>

<div class="footer">
<?php include '../templates/footer.php'; ?>
</div>

</div>

</body>
</html>

