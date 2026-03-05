// ./core/theme.js
let currentPalette = ["#ffffff", "#ffffff", "#ffffff"];

export function applyTheme(theme = {}) {
  const root = document.documentElement;

  const primary   = (theme.primary   || "#ffffff").toLowerCase();
  const secondary = (theme.secondary || "#ffffff").toLowerCase();
  const tertiary  = (theme.tertiary  || "#ffffff").toLowerCase();

  const safePrimary   = theme.primary   || "#ffffff";
  const safeSecondary = theme.secondary || "#ffffff";
  const safeTertiary  = theme.tertiary  || "#ffffff";
  const safeAccent    = theme.accent    || safeSecondary;
  const safeError     = theme.error     || "#ff3b30";

  const uiPrimary   = primary   === "#000000" ? "#d0d0d0" : safePrimary;
  const uiSecondary = secondary === "#000000" ? "#d0d0d0" : safeSecondary;
  const uiTertiary  = tertiary  === "#000000" ? "#d0d0d0" : safeTertiary;

  root.style.setProperty("--color-primary",   safePrimary);
  root.style.setProperty("--color-secondary", safeSecondary);
  root.style.setProperty("--color-tertiary",  safeTertiary);
  root.style.setProperty("--color-accent",    safeAccent);
  root.style.setProperty("--color-error",     safeError);

  root.style.setProperty("--ui-primary",   uiPrimary);
  root.style.setProperty("--ui-secondary", uiSecondary);
  root.style.setProperty("--ui-tertiary",  uiTertiary);

  const isBlackPrimary = primary === "#000000";
  root.style.setProperty("--btn-idle",  isBlackPrimary ? safeSecondary : safePrimary);
  root.style.setProperty("--btn-hover", isBlackPrimary ? safeTertiary  : safeSecondary);

  currentPalette = [safePrimary, safeSecondary, safeTertiary];
}

let THEMES = {};

export function initThemes(flagThemes) {
  THEMES = flagThemes || {};
}

export function getThemeForGroup(group) {
  return THEMES[group] || THEMES["us"] || null;
}

export function getThemePalette() {
  return currentPalette;
}
