<?php

declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,
    'secure'   => true,
    'samesite' => 'Strict'
]);

session_start();
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
require __DIR__ . '/admin-log.php';

/* al ingelogd */
if (!empty($_SESSION["admin_logged_in"])) {
    header("Location: index.php");
    exit;
}

/* config laden */
$config = require __DIR__ . '/../../node403-config/admin.php';

$error = "";
?>
<script> fetch("/api/log-visitor.php",{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ page: "/admin/login.php" }) }).catch(()=>{}); </script>
<?php

/* =========================
   BRUTE FORCE PROTECTION
========================= */

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bfDir = __DIR__ . '/../../node403-config/logs';

if (!is_dir($bfDir)) {
    mkdir($bfDir, 0755, true);
}

$bfFile = $bfDir . '/bruteforce-' . md5($ip) . '.json';

$maxAttempts = 5;
$window = 300; // 5 minuten

$attempts = 0;
$lastTime = 0;

if (file_exists($bfFile)) {

    $data = json_decode(file_get_contents($bfFile),true);

    if ($data && time() - $data['time'] < $window) {
        $attempts = $data['attempts'];
        $lastTime = $data['time'];
    }

}

if ($attempts >= $maxAttempts) {
    $error = "Too many login attempts. Try again later.";
}


/* =========================
   CSRF TOKEN
========================= */

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}


/* =========================
   LOGIN HANDLER
========================= */
if (!empty($_POST['website'])) {

    admin_log("honeypot triggered");

    sleep(2);

    die("Access denied");

}

if ($_SERVER["REQUEST_METHOD"] === "POST" && $attempts < $maxAttempts) {

    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf'] ?? '')) {
        die("Invalid request");
    }

    $username = trim($_POST["username"] ?? "");
    $password = $_POST["password"] ?? "";

    if (
        hash_equals($config["username"], $username) &&
        password_verify($password,$config["password_hash"])
    ){

        session_regenerate_id(true);

        $_SESSION["admin_logged_in"] = true;
        $_SESSION["admin_user"] = $username;

        if (file_exists($bfFile)) {
            unlink($bfFile);
        }

        admin_log("login success: $username");

        header("Location: index.php");
        exit;
    }

    /* login fout */

    $attempts++;

    file_put_contents($bfFile,json_encode([
        'attempts'=>$attempts,
        'time'=>time()
    ]));

    admin_log("login failed: $username");

    $error = "Invalid username or password";
    sleep(1);
}
?>

<style>

body{
margin:0;
background:#050505;
color:#e6e6e6;
font-family:"IBM Plex Mono", monospace;
}

.wrapper{
display:flex;
align-items:center;
justify-content:center;
min-height:70vh;
}

.login-box{
width:340px;
background:rgba(15,20,15,0.65);
border:1px solid rgba(255,255,255,0.08);
padding:28px;
}

.login-title{
font-size:20px;
margin-bottom:6px;
letter-spacing:2px;
}

.login-title::before{
content:"> ";
color:#4da6ff;
}

.tagline{
color:#aaa;
font-size:13px;
margin-bottom:20px;
}

input{
width:100%;
padding:10px;
margin-bottom:12px;
background:#000;
border:1px solid #333;
color:#fff;
font-family:inherit;
}

button{
width:100%;
padding:10px;
background:#4da6ff;
border:0;
color:#000;
cursor:pointer;
font-family:inherit;
}

.error{
color:#ff4d4d;
margin-bottom:10px;
}

</style>

<div class="wrapper">

<div class="login-box">

<div class="login-title">Node403 Login</div>

<div class="tagline">
authorization gateway
</div>

<?php if ($error): ?>
<div class="error"><?php echo htmlspecialchars($error); ?></div>
<?php endif; ?>

<form method="post">

<input type="hidden" name="csrf" value="<?php echo $_SESSION['csrf_token']; ?>">

<div style="position:absolute;left:-9999px;top:-9999px;">
<input type="text" name="website" autocomplete="off" tabindex="-1">
</div>

<input name="username" placeholder="username" required>

<input type="password" name="password" placeholder="password" required>

<button type="submit">Login</button>

<div style="margin-top:14px;text-align:center;font-size:13px;">
<a href="/" style="color:#4da6ff;text-decoration:none;">← back to node403</a>
</div>

</form>

</div>

</div>
