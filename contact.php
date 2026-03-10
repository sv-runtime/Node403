<!DOCTYPE html>

<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Contact — Node403</title>
<link rel="canonical" href="https://node403.com/contact.php">

<link rel="icon" type="image/x-icon" href="style/favicon.ico">

<meta name="description" content="Contact information for the Node403 interactive HTTP 403 security simulation project.">

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
<h1>Contact</h1>
<div class="tagline">
Node403 Project Information
</div>

</div>

<div class="section">
<h2>Project</h2>

<div class="terminal-box">

<p>Project: Node403</p>
<p>Type: Experimental Web Project</p>

</div>

</div>

<div class="section">
<h2>Contact Information</h2>

<p>
For general inquiries, feedback or project-related communication,
you may contact the project owner via email.
</p>

<div class="terminal-box">

<p>Email: <span id="contactEmail"></span></p>

</div>

<p>
Please note that response times may vary as Node403 is an independent
experimental project maintained on a limited basis.
</p>

</div>

<div class="section">
<h2>About the Project</h2>

<p>
Node403 is an independent demonstration project exploring
security aesthetics, terminal interfaces and generative
web-based system simulations.
</p>

<p>
The website presents a stylized representation of an
HTTP 403 authorization process inside a simulated
system environment.
</p>

</div>

<div class="section">
<h2>Responsible Use</h2>

<p>
Node403 is a visual simulation of authorization and HTTP 403
access control behavior. It does not provide real security
services and should not be interpreted as an active
security system.
</p>

</div>

<div class="footer">
<?php include 'templates/footer.php'; ?>
</div>

</div>

<script>

(function(){

const user = "webmaster";
const domain = "node" + "403";
const tld = "com";

const email = user + "@" + domain + "." + tld;

const container = document.getElementById("contactEmail");

if(container){
  const a = document.createElement("a");
  a.href = "mailto:" + email;
  a.textContent = email;
  container.appendChild(a);
}

})();

</script>

</body>
</html>
