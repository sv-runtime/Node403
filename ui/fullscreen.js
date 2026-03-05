export function initFullscreen(buttonId = "fullscreenPageBtn") {

  const btn = document.getElementById(buttonId);
  if (!btn) return;

  let hideTimeout = null;
  const HIDE_DELAY = 2000;

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }

  function hideCursor() {
    document.body.classList.add("cursor-hidden");
  }

  function showCursor() {
    document.body.classList.remove("cursor-hidden");
  }

  function resetCursorTimer() {
    if (!document.fullscreenElement) return;

    showCursor();

    if (hideTimeout) clearTimeout(hideTimeout);

    hideTimeout = setTimeout(() => {
      hideCursor();
    }, HIDE_DELAY);
  }

  /* Toggle fullscreen */
  btn.addEventListener("click", toggleFullscreen);

  /* Fullscreen state change */
document.addEventListener("fullscreenchange", () => {

  const isFs = !!document.fullscreenElement;

  document.body.classList.toggle("is-fullscreen", isFs);

  const footer = document.querySelector(".site-footer");
  if (footer) footer.style.display = isFs ? "none" : "";

  const fsBtn = document.getElementById("fullscreenPageBtn");

  /* alleen fullscreen knop verbergen */
  if (fsBtn) fsBtn.style.display = isFs ? "none" : "block";

});

  /* Cursor timer */
  document.addEventListener("mousemove", resetCursorTimer);
}
