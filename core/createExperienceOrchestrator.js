import { createTerminalStack } from "./createTerminalStack.js";
import { createExperienceState } from "./experienceState.js";
import { createStartTerminalSequence } from "./startTerminalSequence.js";
import { createResetExperience } from "./resetExperience.js";
import { createStartExperience } from "./createStartExperience.js";
import { generatePolicyDecision } from "./policy.js";
import { reseedWorld } from "./random.js";
import { computeLoopDuration } from "./loopDuration.js";
import { applyUILanguage } from "../ui/i18n.js";
import { applyTheme } from "./theme.js";
import { createExperienceContext } from "../experience/session.js";

export function createExperienceOrchestrator({

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
  resolveVisitorIP,
  isIPResolved,

  getNetworkGroup,
  setNetworkGroup,

  BASE_DOMAIN,
  FULL_DOMAIN,
  IP_ADDRESS,

  titleEngine,
  glitchEngine,

  terminalRuntime,   // ✅ enige bron van refs

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
  resize
}) {

  const exp = createExperienceState();

  /* ==============================
     TERMINAL RUNTIME (SINGLE SOURCE)
  ============================== */

  const {
    refs: {
      CAPTURED_PASSWORD_REF,
      FINAL_SESSION_ID_REF,
      LAST_PROTOCOL_REF,
      REQUEST_TIME_REF
    },
    pushAccessLog,
    getTailLines,
    logBuffer
  } = terminalRuntime;

  /* ==============================
     TERMINAL STACK
  ============================== */

  const { hashScreen, terminalEngine } = createTerminalStack({
    randFloat,
    getVisitorIP,
    getHostLabel,
    getThemeForGroup,
    getPolicy: () => exp.POLICY,

    groupSelector,
    GROUP_WEIGHTS,
    GROUP_LABELS,
    FLAG_THEMES,

    BASE_DOMAIN,
    FULL_DOMAIN,
    IP_ADDRESS,

    getSession: () => exp.SESSION,
    getSiteUser: () => exp.SITE_USER,
    getRandomUserByGroup: (g) => exp.getRandomUserByGroupRef(g),
    getNetworkGroup,
    getRandomAscii: () => exp.RANDOM_ASCII,

    pushAccessLog,
    getTailLines,

    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF,
    LAST_PROTOCOL_REF,
    REQUEST_TIME_REF
  });

  /* ==============================
     TERMINAL START
  ============================== */

  const startTerminalSequence = createStartTerminalSequence({
    isIPResolved,
    resolveVisitorIP,
    titleEngine,
    terminalElement: dom.terminalElement,
    getSiteUser: () => exp.SITE_USER,
    getVisitorIP,
    terminalEngine
  });

  /* ==============================
     EXPERIENCE FACTORY
  ============================== */

  const experienceFactory = createExperienceContext(CONFIG, {
    randFloat,
    generatePolicyDecision,
    getThemeForGroup,
    applyTheme,
    getRandomUserByGroup: (group) =>
      exp.getRandomUserByGroupRef(group)
  });

  /* ==============================
     RESET EXPERIENCE
  ============================== */

  const resetExperience = createResetExperience({

    reseedWorld,
    logBuffer,
    terminalEngine,
    hashScreen,
    glitchEngine,

    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF,
    LAST_PROTOCOL_REF,
    REQUEST_TIME_REF,

    terminalStartedRef,
    terminalPhaseStartedRef,
    renderState,

    groupSelector,
    ACTIVE_REGION,
    GROUP_WEIGHTS,
    experienceFactory,

    getUserGenOrThrow: () => {
      if (!exp.userGen) {
        throw new Error("userGen not initialized");
      }
      return exp.userGen;
    },

    setGetRandomUserByGroupRef: (fn) => {
      exp.getRandomUserByGroupRef = fn;
    },

    setNetworkGroup,

    setExperience: (e) => { exp.experience = e; },
    setUsernameGroup: (v) => { exp.USERNAME_GROUP = v; },
    setSiteUser: (v) => { exp.SITE_USER = v; },
    setSession: (v) => { exp.SESSION = v; },
    setRandomAscii: (v) => { exp.RANDOM_ASCII = v; },
    setPolicy: (v) => { exp.POLICY = v; },

    computeLoopDuration,
    randFloat,
    loopState,

    applyUILanguage,
    UI_TEXT,
    dom,

    resize,

    hasBootedOnceRef,
    STATES,
    setState,

    setExperienceStart: runtime.setExperienceStart,
    titleEngine
  });

  /* ==============================
     START EXPERIENCE
  ============================== */

  const startExperience = createStartExperience({
    PHASE,
    STATES,
    hasBootedOnceRef,
    resetExperience
  });

  return {
    exp,
    hashScreen,
    terminalEngine,
    startTerminalSequence,
    resetExperience,
    startExperience,
    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF
  };
}
