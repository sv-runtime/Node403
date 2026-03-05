// ./core/createApplication.js

import { domReady } from "./domReady.js";
import { initDOM } from "../ui/dom.js";
import { initFullscreen } from "../ui/fullscreen.js";

import { bootstrapApp } from "./bootstrapApp.js";
import { createCoreEngines } from "./createCoreEngines.js";
import { createRuntimeState } from "./runtimeState.js";
import { createTerminalRuntime } from "./createTerminalRuntime.js";
import { bindResize } from "../ui/bindResize.js";

import { createExperienceOrchestrator } from "./createExperienceOrchestrator.js";
import { createAppRenderer } from "./createAppRenderer.js";
import { createBootController } from "./bootController.js";

import { preloadAllIdentities } from "./loaders/identityLoader.js";
import { createUserGenerator } from "../experience/users.js";

import { STATES, PHASE, setState } from "./state.js";
import { randFloat } from "./random.js";
import { getVisitorIP, getHostLabel, resolveVisitorIP, isIPResolved } from "./ip.js";
import { getThemeForGroup, getThemePalette } from "./theme.js";
import { getPolicyDecision } from "./policy.js";
import { TIMING } from "./timing.js";
import { BASE_DOMAIN, FULL_DOMAIN, IP_ADDRESS } from "./constants.js";

export async function createApplication() {

  await domReady();

  /* wacht tot fonts geladen zijn */
  if (document.fonts) {
    await document.fonts.ready;
  }

  document.body.classList.add("fonts-loaded");

  const dom = initDOM();
  initFullscreen();

  const canvas = dom.canvas;
  const ctx    = dom.ctx;

  /* =============================
     RUNTIME STATE
  ============================= */

  const runtime = createRuntimeState();
  const {
    loopState,
    terminalPhaseStartedRef,
    terminalStartedRef,
    renderState,
    hasBootedOnceRef
  } = runtime;

  /* =============================
     TERMINAL RUNTIME
  ============================= */

  const terminalRuntime = createTerminalRuntime();

  const {
    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF,
    LAST_PROTOCOL_REF,
    REQUEST_TIME_REF
  } = terminalRuntime.refs;

  /* =============================
     CORE ENGINES
  ============================= */

  const {
    titleEngine,
    glitchEngine,
    curtainEngine,
    matrixEngine
  } = createCoreEngines({
    randFloat,
    getVisitorIP,
    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF
  });

  /* =============================
     CONFIG BOOTSTRAP
  ============================= */

  const ACTIVE_REGION = "world";

  const appBoot = await bootstrapApp({
    randFloat,
    ACTIVE_REGION,
    dom
  });

  const {
    CONFIG,
    GROUP_WEIGHTS,
    GROUP_LABELS,
    UI_TEXT,
    FLAG_THEMES,
    groupSelector
  } = appBoot;

  /* =============================
     NETWORK GROUP
  ============================= */

  let NETWORK_GROUP = appBoot.initialNetworkGroup;

  const getNetworkGroup = () => NETWORK_GROUP;

  const setNetworkGroup = (g) => {
    NETWORK_GROUP = g;
  };

  /* =============================
     RESIZE BINDING
  ============================= */

  const resize = bindResize({
    canvas,
    ctx,
    curtainEngine,
    matrixEngine,
    randFloat
  });

  /* =============================
     ORCHESTRATOR
  ============================= */

  const orchestrator = createExperienceOrchestrator({
    CONFIG,
    GROUP_WEIGHTS,
    GROUP_LABELS,
    FLAG_THEMES,
    UI_TEXT,
    groupSelector,
    ACTIVE_REGION,

    randFloat,
    getVisitorIP,
    getHostLabel,
    getThemeForGroup,
    getPolicyDecision,
    resolveVisitorIP,
    isIPResolved,

    getNetworkGroup,
    setNetworkGroup,

    BASE_DOMAIN,
    FULL_DOMAIN,
    IP_ADDRESS,

    titleEngine,
    glitchEngine,

    PHASE,
    STATES,
    setState,
    hasBootedOnceRef,
    runtime,
    loopState,
    renderState,
    terminalPhaseStartedRef,
    terminalStartedRef,
    dom,
    resize,

    terminalRuntime
  });

  const {
    exp,
    hashScreen,
    startTerminalSequence,
    resetExperience,
    startExperience
  } = orchestrator;

  /* =============================
     RENDERER
  ============================= */

  const appRenderer = createAppRenderer({
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
  });

  /* =============================
     BOOT CONTROLLER
  ============================= */

  const bootController = createBootController({
    dom,
    GROUP_WEIGHTS,
    preloadAllIdentities,
    createUserGenerator,
    randFloat,

    STATES,
    setState,
    renderState,

    getAllIdentities: () => exp.ALL_IDENTITIES,
    setAllIdentities: (v) => { exp.ALL_IDENTITIES = v; },

    getUserGen: () => exp.userGen,
    setUserGen: (v) => { exp.userGen = v; },

    setGetRandomUserByGroupRef: (fn) => {
      exp.getRandomUserByGroupRef = fn;
    },

    startExperience
  });

  function start() {
    appRenderer.start();
    bootController.bind();
  }

  return { start };
}
