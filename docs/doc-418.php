<?php
$title = "HTTP 418 I'm a teapot – The Hyper Text Coffee Pot Control Protocol";
$description = "Technical documentation explaining the HTTP 418 I'm a teapot status code. Learn the origin of this humorous HTTP response and its place in developer culture.";
?>

<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title><?php echo $title; ?> | Node403 Docs</title>

<meta name="description" content="<?php echo $description; ?>">
<meta name="robots" content="index, follow">

<link rel="canonical" href="https://node403.com/docs/418.php">

<meta property="og:title" content="<?php echo $title; ?>">
<meta property="og:description" content="<?php echo $description; ?>">
<meta property="og:type" content="article">
<meta property="og:url" content="https://node403.com/docs/doc-418.php">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<link rel="stylesheet" href="style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191744023231140"
     crossorigin="anonymous"></script>
</head>

<body>

<div class="wrapper">

<?php include "templates/header.php"; ?>

<div class="header">

<h1>HTTP 418 I'm a teapot</h1>

<div class="tagline">
An RFC joke that became part of internet culture
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

<h2>What the 418 Status Code Means</h2>

<p>
The <strong>HTTP 418 I'm a teapot</strong> status code originates from the
<strong>Hyper Text Coffee Pot Control Protocol (HTCPCP)</strong>, defined in
<a href="https://datatracker.ietf.org/doc/html/rfc2324" target="_blank">RFC 2324</a>.
The specification was published as an April Fools’ joke in 1998.
</p>

<p>
According to the RFC, the 418 response should be returned when a
<strong>teapot receives a request to brew coffee</strong>.
</p>

</div>


<div class="section">

<h2>Origin of the Status Code</h2>

<p>
The code was introduced as part of a humorous protocol describing how
network-connected coffee machines could be controlled using HTTP-like
requests.
</p>

<p>
In the fictional protocol, a teapot must refuse a request to brew coffee,
because it is only capable of preparing tea. In such cases, the server
responds with:
</p>

<pre>
HTTP/1.1 418 I'm a teapot
</pre>

</div>


<div class="section">

<h2>Use in Real Systems</h2>

<p>
Although the code was originally intended as a joke, it has become a
well-known reference within developer communities.
</p>

<ul>

<li>Used in playful API responses</li>
<li>Included in developer documentation</li>
<li>Referenced in programming tutorials</li>
<li>Implemented in some web frameworks</li>

</ul>

<p>
Several platforms and web services include optional support for returning
a 418 response as an Easter egg.
</p>

</div>


<div class="section">

<h2>Why the Code Still Exists</h2>

<p>
Despite its humorous origin, the status code became part of internet
culture and is widely recognized by developers.
</p>

<p>
When the HTTP specification was revised, the code was intentionally
left documented rather than removed, acknowledging its long-standing
presence in developer communities.
</p>

</div>


<div class="section">

<h2>Example of a 418 Response</h2>

<pre>
HTTP/1.1 418 I'm a teapot
Content-Type: text/plain
</pre>

<p>
This response is rarely used in production systems but remains a
popular cultural reference among developers.
</p>

</div>


<?php include "templates/http-error-codes.php"; ?>


<div class="section">

<h2>Summary</h2>

<p>
The <strong>HTTP 418 I'm a teapot</strong> status code is a humorous
addition to the HTTP ecosystem originating from an April Fools RFC.
While not used in serious production environments, it has become a
recognizable part of developer culture and internet history.
</p>

</div>


<div class="footer">
<?php include '../templates/footer.php'; ?>
</div>

</div>

</body>
</html>
