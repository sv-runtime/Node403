export function initDOM() {

  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");

  const terminalElement = document.querySelector(".terminal");

  const introScreen = document.getElementById("introScreen");
  const backBtn = document.getElementById("backBtn");
  const enterBtn = document.getElementById("enterBtn");

  return {
    canvas,
    ctx,
    terminalElement,
    introScreen,
    backBtn,
    enterBtn, 
    fullscreenPageBtn: document.getElementById("fullscreenPageBtn"),
  };
}

export function bindUIEvents(dom, handlers) {

  if (dom.backBtn) {
    dom.backBtn.addEventListener("click", handlers.onBack);
  }

  if (dom.enterBtn) {
    dom.enterBtn.addEventListener("click", handlers.onEnter);
  }
}
