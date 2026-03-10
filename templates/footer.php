<footer class="site-footer">

<div class="footer-inner">

<span class="footer-brand">© 2026 Node403</span>
<span class="footer-separator">·</span>

<a href="/privacy.php">Privacy Policy</a>
<span class="footer-separator">·</span>

<a href="/admin/login.php">Admin</a>

</div>
<script>
(function(){
 document.querySelectorAll("footer a, .footer a").forEach(link => {
  link.addEventListener("click", function(){
   try{
    if(window.node403AudioPlayer){
     window.node403AudioPlayer.pause();
     window.node403AudioPlayer.currentTime = 0;
    }
   }catch(e){}
  });
 });
})();
</script>
</footer>

