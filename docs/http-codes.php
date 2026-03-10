<?php
$title = "HTTP Status Codes – Complete Reference";
$description = "Overview of HTTP status codes including informational, success, redirect, client error and server error responses.";
?>

<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title><?php echo $title; ?> | Node403 Docs</title>

<meta name="description" content="<?php echo $description; ?>">
<meta name="robots" content="index, follow">

<link rel="canonical" href="https://node403.com/docs/http-codes.php">

<meta property="og:title" content="<?php echo $title; ?>">
<meta property="og:description" content="<?php echo $description; ?>">
<meta property="og:type" content="article">
<meta property="og:url" content="https://node403.com/docs/http-codes.php">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<link rel="stylesheet" href="style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191744023231140"
     crossorigin="anonymous"></script>
</head>

<body>

<div class="wrapper">

<?php include "templates/header.php"; ?>

<div class="header">

<h1>HTTP Status Codes</h1>

<div class="tagline">
Understanding HTTP responses and server communication
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

<h2>What HTTP Status Codes Are</h2>

<p>
HTTP status codes are standardized response messages returned by web servers
when a client sends a request. They indicate whether a request was processed
successfully, redirected, rejected, or failed due to server problems.
</p>

<p>
Each HTTP response includes a numeric status code that helps developers,
browsers, and automated systems understand how the server handled the request.
</p>

</div>


<div class="section">

<h2>HTTP Status Code Classes</h2>

<p>
HTTP status codes are grouped into five categories based on their first digit.
</p>

<ul>

<li><strong>1xx – Informational</strong> (request received, processing continues)</li>
<li><strong>2xx – Success</strong> (the request completed successfully)</li>
<li><strong>3xx – Redirection</strong> (additional actions required)</li>
<li><strong>4xx – Client Errors</strong> (problem with the request)</li>
<li><strong>5xx – Server Errors</strong> (problem on the server)</li>

</ul>

</div>


<?php include "templates/http-error-codes.php"; ?>


<div class="section">

<h2>Why Status Codes Matter</h2>

<p>
HTTP status codes play a critical role in how web applications,
browsers, APIs, and search engines interpret responses.
</p>

<p>
Developers rely on these codes to diagnose problems, implement
error handling, and design reliable systems that communicate clearly
with clients.
</p>

</div>


<div class="footer">
<?php include '../templates/footer.php'; ?>
</div>

</div>

</body>
</html>
