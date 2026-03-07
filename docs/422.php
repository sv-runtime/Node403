<?php
$title = "HTTP 422 Unprocessable Entity – Validation and Semantic Errors";
$description = "Technical documentation explaining the HTTP 422 Unprocessable Entity status code. Learn when servers return 422 responses and how validation errors are handled in modern APIs.";
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

<link rel="canonical" href="https://node403.com/docs/422.php">

<meta property="og:title" content="<?php echo $title; ?>">
<meta property="og:description" content="<?php echo $description; ?>">
<meta property="og:type" content="article">
<meta property="og:url" content="https://node403.com/docs/422.php">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<link rel="stylesheet" href="style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191744023231140"
     crossorigin="anonymous"></script>
</head>

<body>

<div class="wrapper">

<?php include "templates/header.php"; ?>

<div class="header">

<h1>HTTP 422 Unprocessable Entity</h1>

<div class="tagline">
Validation failures and semantic request errors
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

<h2>What the 422 Status Code Means</h2>

<p>
The <strong>HTTP 422 Unprocessable Entity</strong> status code indicates that
the server understands the request syntax and content type, but cannot
process the request because the instructions contained within it are
semantically invalid.
</p>

<p>
Unlike a <strong>400 Bad Request</strong>, which usually indicates malformed
syntax, a 422 response occurs when the request is structurally correct but
fails application-level validation rules.
</p>

</div>


<div class="section">

<h2>Common Causes of HTTP 422 Errors</h2>

<ul>

<li>Invalid form input or validation failures</li>
<li>Missing required fields in a request payload</li>
<li>Incorrect data formats (e.g. invalid email addresses)</li>
<li>Business rule violations in APIs</li>
<li>Attempting operations that violate application constraints</li>

</ul>

</div>


<div class="section">

<h2>Example of a 422 Response</h2>

<pre>
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json
</pre>

<p>
Many APIs return structured validation responses describing which fields
failed validation and why the request cannot be processed.
</p>

</div>


<div class="section">

<h2>Common API Scenario</h2>

<p>
A typical example of a 422 error occurs when submitting invalid form data
to an API.
</p>

<pre>
POST /users

{
  "email": "invalid-email",
  "password": "123"
}
</pre>

<p>
Although the JSON structure is valid, the email format or password length
may violate validation rules, causing the server to return a
<strong>422 Unprocessable Entity</strong> response.
</p>

</div>


<div class="section">

<h2>422 vs 400 Bad Request</h2>

<p>
The difference between <strong>400</strong> and <strong>422</strong> is
important in API design.
</p>

<ul>

<li>
<strong>400 Bad Request</strong> – the request syntax is malformed or
cannot be parsed.
</li>

<li>
<strong>422 Unprocessable Entity</strong> – the request syntax is valid,
but the data violates validation rules.
</li>

</ul>

</div>


<div class="section">

<h2>How Developers Diagnose 422 Errors</h2>

<ul>

<li>Inspect validation rules in the application</li>
<li>Check request payload structure</li>
<li>Review API error messages</li>
<li>Validate required fields and formats</li>

</ul>

</div>


<?php include "templates/http-error-codes.php"; ?>


<div class="section">

<h2>Summary</h2>

<p>
The <strong>HTTP 422 Unprocessable Entity</strong> status code indicates
that a request is syntactically valid but fails semantic validation rules
defined by the application.
</p>

<p>
It is widely used in modern web APIs to communicate detailed validation
errors and guide clients toward submitting correct data.
</p>

</div>


<div class="footer">
<?php include '../templates/footer.php'; ?>
</div>

</div>

</body>
</html>
