// core/bootstrapApp.js
import { loadConfig } from "./config.js";
import { initThemes, applyTheme, getThemeForGroup } from "./theme.js";
import { applyUILanguage } from "../ui/i18n.js";
import { createGroupSelector } from "./weights.js";

export async function bootstrapApp({ randFloat, ACTIVE_REGION, dom }) {
  const CONFIG = await loadConfig({ basePath: "./data", cache: "no-store" });

  const {
    GROUP_WEIGHTS,
    GROUP_LABELS,
    UI_TEXT,
    FLAG_THEMES,
    ASCII_FIGURES
  } = CONFIG;

  initThemes(FLAG_THEMES);

  const groupSelector = createGroupSelector({ CONFIG, randFloat });

  const initialNetworkGroup = groupSelector.getWeightedGroup(
    ACTIVE_REGION,
    GROUP_WEIGHTS
  );

  applyUILanguage(initialNetworkGroup, UI_TEXT);
  applyTheme(getThemeForGroup(initialNetworkGroup));

  if (dom?.introScreen) {
    dom.introScreen.style.display = "flex";
    dom.introScreen.classList.add("ready");
  }

  return {
    CONFIG,
    GROUP_WEIGHTS,
    GROUP_LABELS,
    UI_TEXT,
    FLAG_THEMES,
    ASCII_FIGURES,
    groupSelector,
    initialNetworkGroup
  };
}
