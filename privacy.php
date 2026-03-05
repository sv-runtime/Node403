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

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Privacy Policy — Node403</title>
<link rel="canonical" href="https://node403.com/privacy.htm">

<link rel="icon" type="image/x-icon" href="style/favicon.ico">

<meta name="description" content="Privacy policy explaining how technical data may be processed when visiting the Node403 interactive HTTP 403 security simulation website.">

<style>

body{
margin:0;
background:#050505;
color:#e6e6e6;
font-family:"IBM Plex Mono", monospace;
line-height:1.6;
}

.wrapper{
max-width:900px;
margin:auto;
padding:60px 24px;
}

.header{
margin-bottom:40px;
}

.header h1{
font-size:28px;
letter-spacing:2px;
font-weight:500;
margin-bottom:10px;
}

.header h1::before{
content:"> ";
color:#4da6ff;
}

.tagline{
color:#aaa;
font-size:14px;
margin-top:8px;
}

.section{
margin:50px 0;
}

.section h2{
font-size:16px;
letter-spacing:2px;
margin-bottom:14px;
color:#ddd;
}

.section h2::before{
content:"# ";
color:#4da6ff;
}

.terminal-box{
background:rgba(15,20,15,0.6);
border:1px solid rgba(255,255,255,0.08);
padding:20px;
margin-top:20px;
font-size:14px;
}

.footer{
margin-top:60px;
font-size:12px;
color:rgba(255,255,255,0.35);
text-align:center;
}

a{
color:#4da6ff;
text-decoration:none;
}

a:hover{
text-decoration:underline;
}

</style>

</head>

<body>

<div class="wrapper">

<?php include 'templates/header.php'; ?>

<div class="header">
<h1>Privacy Policy</h1>
<div class="tagline">
Node403 Data Handling Information
</div>
</div>


<div class="section">
<h2>Overview</h2>

<p>
Node403 is an interactive browser-based simulation that demonstrates authorization systems
and HTTP 403 access denial behavior inside a stylized terminal interface.
</p>

<p>
This privacy policy explains what limited technical information may be processed when
visiting the website and how that information is used.
</p>

</div>


<div class="section">
<h2>IP Address Processing</h2>

<p>
When you access Node403, the server may temporarily resolve your public IP address
in order to display it within the simulated terminal interface.
</p>

<p>
The IP address is obtained from the incoming HTTP request and returned to the browser
via a minimal API endpoint. The value is used only for visual display within the
simulation environment.
</p>

<p>
The IP address is not stored in a database, not linked to user identities and not
used for profiling within the Node403 application itself.
</p>

</div>


<div class="section">
<h2>Server Logs</h2>

<p>
For security and operational monitoring purposes, the Node403 server may store
limited technical request information in server log files. This information may
include the visitor IP address, timestamp, requested resource and browser user agent.
</p>

<p>
These logs are used exclusively for security monitoring, debugging and abuse
prevention in order to maintain the stability and integrity of the website.
</p>

<p>
Log files are stored on the server and are automatically deleted after a
maximum retention period of 30 days.
</p>

<p>
The information contained in these logs is not used for profiling, advertising
or user identification and is not shared with third parties.
</p>

</div>



<div class="section">
<h2>Analytics</h2>

<p>
Node403 uses Google Analytics to collect anonymized usage statistics about how visitors
interact with the website and the interactive simulation.
</p>

<p>
Analytics data may include information such as pages visited, approximate geographic
region, device type, browser information and interaction events inside the simulation
interface.
</p>

<p>
This information is used only to understand how the demonstration site is used and
to improve the project.
</p>

<p>
More information about how Google processes data can be found at:
<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
https://policies.google.com/privacy
</a>
</p>

</div>


<div class="section">
<h2>Cookies</h2>

<p>
Google Analytics may use cookies or similar technologies in order to measure website
traffic and visitor interactions.
</p>

<p>
These cookies are used only for aggregated statistics and are not used by the
Node403 project for advertising or behavioral profiling.
</p>

</div>


<div class="section">
<h2>Third-Party Services</h2>

<p>
The website uses the following external services:
</p>

<ul>
<li>Google Analytics – website usage statistics</li>
<li>Google Fonts – web font delivery</li>
</ul>

<p>
Requests to these services may transmit technical information such as IP address
and browser information to their respective providers.
</p>

</div>


<div class="section">
<h2>Purpose of the Website</h2>

<p>
Node403 is an experimental web demonstration designed to simulate authorization
systems, network policies and HTTP 403 access denial behavior.
</p>

<p>
The website does not implement real authentication systems, user accounts or
credential storage.
</p>

</div>


<div class="section">
<h2>Contact</h2>

<p>
If you have questions regarding this privacy policy you may contact the site owner
via email at <span id="emailLink"></span>.
</p>

<p>
Node403<br>
Built by S. Veenstra
</p>

</div>


<div class="footer">
<?php include 'templates/footer.php'; ?>
</div>

</div>


<script>

(function(){

const user = "webmaster";
const domain = "node403";
const tld = "com";

const email = user + "@" + domain + "." + tld;

const el = document.getElementById("emailLink");

if(el){
const a = document.createElement("a");
a.href = "mailto:" + email;
a.textContent = email;
el.appendChild(a);
}

})();

</script>

</body>
</html>
