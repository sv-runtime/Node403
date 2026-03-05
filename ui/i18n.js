export function applyUILanguage(group, UI_TEXT) {

  const ui = UI_TEXT[group] || UI_TEXT["us"];

  const backBtn = document.getElementById("backBtn");
  const enterBtn = document.getElementById("enterBtn");
  const fullscreenBtn = document.getElementById("fullscreenPageBtn");
  const introTagline = document.getElementById("introTagline");

  if (backBtn && ui.back) backBtn.textContent = ui.back;
  if (enterBtn && ui.enter) enterBtn.textContent = ui.enter;

  if (fullscreenBtn && ui.fullscreen)
    fullscreenBtn.textContent = ui.fullscreen;

  if (introTagline && ui.tagline)
    introTagline.textContent = ui.tagline;
}
