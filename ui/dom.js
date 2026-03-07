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
     menuScreen: document.getElementById("menuScreen"),
     backBtn,
     enterBtn,
     menuOption1: document.getElementById("menuOption1"),
     menuOption2: document.getElementById("menuOption2"),
     menuOption3: document.getElementById("menuOption3"),
     menuOption4: document.getElementById("menuOption4"),
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

 if (dom.menuOption1) {
  dom.menuOption1.addEventListener("click", handlers.onMenuOption1);
 }

 if (dom.menuOption2) {
  dom.menuOption2.addEventListener("click", handlers.onMenuOption2);
 }

 if (dom.menuOption3) {
  dom.menuOption3.addEventListener("click", handlers.onMenuOption3);
 }

 if (dom.menuOption4) {
  dom.menuOption4.addEventListener("click", handlers.onMenuOption4);
 }
}
