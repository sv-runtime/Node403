// ./core/createAppRenderer.js
import { createRenderer } from "../render/createRenderer.js";
import { startRenderLoop } from "../render/startRenderLoop.js";
import { initCanvasDefaults } from "../render/initCanvasDefaults.js";
import { bindUIEffects } from "../ui/bindUIEffects.js";

export function createAppRenderer({
  canvas,
  ctx,

  PHASE,
  STATES,
  setState,
  TIMING,

  randFloat,
  getThemePalette,

  titleEngine,
  curtainEngine,
  glitchEngine,
  matrixEngine,

  hashScreen,
  startTerminalSequence,
  resolveVisitorIP,

  terminalPhaseStartedRef,
  terminalStartedRef,
  CAPTURED_PASSWORD_REF,

  runtime,
  loopState,
  renderState,
  resetExperience
}) {

  // Canvas defaults
  initCanvasDefaults(ctx);

  // UI effects
  bindUIEffects({ PHASE, randFloat, renderState });

  const renderer = createRenderer({
    canvas,
    ctx,

    PHASE,
    STATES,
    setState,
    TIMING,

    randFloat,
    getThemePalette,

    titleEngine,
    curtainEngine,
    hashScreen,
    glitchEngine,
    resolveVisitorIP,

    startTerminalSequence,

    matrixChars: matrixEngine.getChars().matrixChars,

    terminalPhaseStarted: terminalPhaseStartedRef,
    terminalStarted: terminalStartedRef,

    CAPTURED_PASSWORD_REF,

    renderState,

    getLoopDuration: () => loopState.duration,
    getExperienceStart: runtime.getExperienceStart,
    setExperienceStart: runtime.setExperienceStart,

    resetExperience,

    getMatrixGeometry: () => matrixEngine.getLayout(),
    getMatrixState: () => matrixEngine.getState()
  });

  function start() {
    startRenderLoop({ runtime, renderer, STATES, setState });
  }

  return {
    renderer,
    start
  };
}
