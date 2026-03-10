<?php
$title = "HTTP 405 Method Not Allowed – Invalid HTTP Methods";
$description = "Technical documentation explaining the HTTP 405 Method Not Allowed status code. Learn why servers reject unsupported HTTP methods and how developers diagnose method errors.";
?>

<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title><?php echo $title; ?> | Node403 Docs</title>

<meta name="description" content="<?php echo $description; ?>">
<meta name="robots" content="index, follow">

<link rel="canonical" href="https://node403.com/docs/doc-405.php">

<meta property="og:title" content="<?php echo $title; ?>">
<meta property="og:description" content="<?php echo $description; ?>">
<meta property="og:type" content="article">
<meta property="og:url" content="https://node403.com/docs/405.php">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<link rel="stylesheet" href="style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191744023231140"
     crossorigin="anonymous"></script>
</head>

<body>

<div class="wrapper">

<?php include "templates/header.php"; ?>

<div class="header">

<h1>HTTP 405 Method Not Allowed</h1>

<div class="tagline">
Unsupported HTTP methods and request restrictions
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

<h2>What the 405 Status Code Means</h2>

<p>
The <strong>HTTP 405 Method Not Allowed</strong> status code indicates that
the server received the request and recognized the target resource, but the
HTTP method used in the request is not supported for that resource.
</p>

<p>
In other words, the URL exists, but the request method such as
<strong>POST</strong>, <strong>PUT</strong>, or <strong>DELETE</strong> is not
allowed for the requested endpoint.
</p>

</div>


<div class="section">

<h2>Common Causes of HTTP 405 Errors</h2>

<ul>

<li>Sending a POST request to a read-only endpoint</li>
<li>Using GET when the API requires POST</li>
<li>Incorrect routing configuration in web frameworks</li>
<li>Server restrictions on specific HTTP methods</li>
<li>Security filters blocking unsafe methods</li>

</ul>

</div>


<div class="section">

<h2>Example of a 405 Response</h2>

<pre>
HTTP/1.1 405 Method Not Allowed
Allow: GET, HEAD
Content-Type: text/html
</pre>

<p>
Servers often include an <strong>Allow</strong> header which lists the
HTTP methods supported by the requested resource.
</p>

</div>


<div class="section">

<h2>Common HTTP Methods</h2>

<ul>

<li><strong>GET</strong> – retrieve a resource</li>
<li><strong>POST</strong> – submit data to the server</li>
<li><strong>PUT</strong> – replace a resource</li>
<li><strong>PATCH</strong> – partially update a resource</li>
<li><strong>DELETE</strong> – remove a resource</li>

</ul>

<p>
If a client sends a method that is not supported for a particular resource,
the server may return a 405 response.
</p>

</div>


<div class="section">

<h2>How Developers Diagnose 405 Errors</h2>

<ul>

<li>Check the HTTP method used in the request</li>
<li>Review API documentation</li>
<li>Inspect server routing configuration</li>
<li>Verify allowed methods for the endpoint</li>

</ul>

</div>


<?php include "templates/http-error-codes.php"; ?>


<div class="section">

<h2>Summary</h2>

<p>
The <strong>HTTP 405 Method Not Allowed</strong> status code indicates that
the server understands the request but does not allow the HTTP method used
for the requested resource.
</p>

<p>
Ensuring that clients use the correct HTTP methods for each endpoint is
essential when designing REST APIs and web services.
</p>

</div>


<div class="footer">
<?php include '../templates/footer.php'; ?>
</div>

</div>

</body>
</html>
