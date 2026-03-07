<?php
$logDir = __DIR__ . "/../node403-config/logs";
$file = $logDir . "/visitors-" . date("Y-m-d") . ".log";

$entries = [];

if (file_exists($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $lines = array_slice($lines, -300);

    foreach ($lines as $line) {
        $data = json_decode($line, true);
        if ($data) {
            $entries[] = $data;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Node403 Live Monitor</title>
<meta http-equiv="refresh" content="5">

<style>
body{
    background:#050505;
    color:#e6e6e6;
    font-family:"IBM Plex Mono", monospace;
    margin:0;
}
.wrapper{
    max-width:1000px;
    margin:40px auto;
    padding:20px;
}
.title{
    font-size:18px;
    margin-bottom:20px;
    letter-spacing:2px;
}
.title::before{
    content:"> ";
    color:#4da6ff;
}
.table{
    width:100%;
    border-collapse:collapse;
    font-size:13px;
}
.table th,
.table td{
    padding:8px 10px;
    border-bottom:1px solid rgba(255,255,255,0.08);
    text-align:left;
}
.table th{
    color:#aaa;
    font-weight:normal;
}
.bot{
    color:#ffcc66;
}
.good{
    color:#66ff99;
}
.path{
    color:#4da6ff;
}
</style>
</head>
<body>
<div class="wrapper">
    <div class="title">Node403 Live Monitor (real traffic)</div>

    <table class="table">
        <tr>
            <th>Time</th>
            <th>Country</th>
            <th>Path</th>
            <th>Bot</th>
        </tr>

        <?php if (empty($entries)): ?>
        <tr>
            <td colspan="4">No live entries yet.</td>
        </tr>
        <?php endif; ?>

        <?php foreach (array_reverse($entries) as $e): ?>
        <tr>
            <td>
                <?php
                $rawTime = $e["time"] ?? null;
                $safeTime = "-";
                if ($rawTime) {
                    $ts = strtotime($rawTime);
                    if ($ts !== false) {
                        $safeTime = date("H:i", $ts);
                    }
                }
                echo htmlspecialchars($safeTime);
                ?>
            </td>

            <td><?php echo htmlspecialchars($e["geo"]["country"] ?? "-"); ?></td>

            <td class="path"><?php echo htmlspecialchars($e["request"]["path"] ?? "-"); ?></td>

            <td class="<?php echo !empty($e["client"]["bot"]) ? 'bot' : 'good'; ?>">
                <?php echo !empty($e["client"]["bot"]) ? 'bot' : 'human'; ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</div>
</body>
</html>
