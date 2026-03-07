<?php
require "auth.php";

$logDir = __DIR__ . "/../../node403-config/logs";

$files = glob($logDir . "/*.log");
rsort($files);
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Node403 Logs</title>

<style>
body{
background:#050505;
color:#e6e6e6;
font-family:"IBM Plex Mono", monospace;
}

.wrapper{
max-width:900px;
margin:40px auto;
}

a{
color:#4da6ff;
text-decoration:none;
}

a:hover{
text-decoration:underline;
}

.file{
margin-bottom:10px;
}
</style>

</head>

<body>

<div class="wrapper">

<h2>> Node403 Log Files</h2>

<?php foreach ($files as $f): ?>

<div class="file">
<a href="../logs/<?php echo basename($f); ?>">
<?php echo basename($f); ?>
</a>
</div>

<?php endforeach; ?>

</div>

</body>
</html>
