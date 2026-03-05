// ui/bindUIEffects.js
import { bindVisibilitySpike } from "./visibilitySpike.js";

export function bindUIEffects({ PHASE, randFloat, renderState }) {
  bindVisibilitySpike({ PHASE, randFloat, renderState });
}
