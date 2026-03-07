<?php
require "auth.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<script>
fetch("/api/log-visitor.php", {
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
page: window.location.pathname
})
}).catch(()=>{});
</script>

<title>Node403 Admin Console</title>

<style>

body{
margin:0;
background:#050505;
color:#e6e6e6;
font-family:"IBM Plex Mono", monospace;
}

.wrapper{
max-width:900px;
margin:auto;
padding:50px 24px;
}

.title{
font-size:22px;
margin-bottom:20px;
letter-spacing:2px;
}

.title::before{
content:"> ";
color:#4da6ff;
}

.terminal{
background:rgba(15,20,15,0.7);
border:1px solid rgba(255,255,255,0.08);
padding:20px;
min-height:320px;
}

.line{
margin-bottom:6px;
white-space:pre-wrap;
}

.prompt{
color:#4da6ff;
}

a{
color:#4da6ff;
text-decoration:none;
}

a:hover{
text-decoration:underline;
}

.commands{
margin-top:20px;
border-top:1px solid rgba(255,255,255,0.08);
padding-top:16px;
}

.commands a{
display:block;
margin-top:6px;
}

</style>

</head>

<body>

<div class="wrapper">

<div class="title">Node403 Admin Console</div>

<div class="terminal" id="terminal"></div>

<div class="commands">

<div class="prompt">> available commands</div>

<a href="logs.php">view admin logs</a>
<a href="../logs/">open logs directory</a>
<a href="monitor.php">Visitor Monitor</a>
<a href="logout.php">logout</a>

</div>

</div>

<script>

const lines = [
"boot sequence initialized",
"loading node403 admin interface",
"verifying session token",
"access level: administrator",
"security modules: active",
"logging subsystem: online",
"system ready"
];

const terminal = document.getElementById("terminal");

let i = 0;

function addLine(){

if(i >= lines.length) return;

const div = document.createElement("div");
div.className = "line";
div.innerHTML = "<span class='prompt'>&gt;</span> " + lines[i];

terminal.appendChild(div);

i++;

setTimeout(addLine,500);

}

addLine();

</script>
</body>
</html>
