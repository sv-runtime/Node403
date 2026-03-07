<?php

session_start();

require __DIR__ . '/admin-log.php';

admin_log("logout: ".$_SESSION["admin_user"]);

session_destroy();

header("Location: login.php");
exit;

