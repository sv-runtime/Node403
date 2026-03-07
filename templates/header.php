<header class="site-header">

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

<div class="header-inner">

<div class="header-brand">
Node403
</div>

<nav class="header-nav">

<a href="/">Home</a>
<span class="header-separator">·</span>

<a href="/about.php">About</a>
<span class="header-separator">·</span>

<a href="/contact.php">Contact</a>
<span class="header-separator">·</span>

<a href="/docs/index.php">Documentation</a>

</nav>

</div>

</header>

