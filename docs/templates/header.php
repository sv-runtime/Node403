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
      <a href="https://node403.com">NODE403</a> / DOCS
    </div>

    <nav class="header-nav">
      <a href="/docs/">Docs Home</a>
      <span class="header-separator">|</span>

      <a href="http-codes.php">HTTP Codes</a>
      <span class="header-separator">|</span>

      <a href="authorization.php">Authorization Systems</a>
 <span class="header-separator">|</span>

      <a href="contact.php">Contact</a>
    </nav>

  </div>
</header>
