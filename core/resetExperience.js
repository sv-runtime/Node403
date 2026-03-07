import { TERMINAL_LOCK } from "./state.js";
// ./core/resetExperience.js
export function createResetExperience({
  // core resets
  reseedWorld,
  logBuffer,
  terminalEngine,
  hashScreen,
  glitchEngine,

  // refs
    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF,
    LAST_PROTOCOL_REF,
    REQUEST_TIME_REF,

  // state refs (objects met .value)
  terminalStartedRef,
  terminalPhaseStartedRef,

  // render state object (mutated)
  renderState,

  // experience / session
  groupSelector,
  ACTIVE_REGION,
  GROUP_WEIGHTS,
  experienceFactory,
  getUserGenOrThrow,          // () => userGen (moet bestaan)
  setGetRandomUserByGroupRef, // (fn) => getRandomUserByGroupRef = fn

  // setters voor “globals” in main
  setNetworkGroup,            // (g) => NETWORK_GROUP = g
  setExperience,              // (exp) => experience = exp
  setUsernameGroup,           // (ug) => USERNAME_GROUP = ug
  setSiteUser,                // (u) => SITE_USER = u
  setSession,                 // (s) => SESSION = s
  setRandomAscii,             // (a) => RANDOM_ASCII = a
setPolicy,

  // loop timing
  computeLoopDuration,
  randFloat,
  loopState,                  // { duration: number }

  // UI stuff
  applyUILanguage,
  UI_TEXT,
  dom,

  // layout
  resize,

  // state machine
  hasBootedOnceRef,           // { value: boolean }
  STATES,
  setState,

  // timing
  setExperienceStart,         // (n) => experienceStart = n

  // title
  titleEngine
}) {

  return async function resetExperience() {

     if (TERMINAL_LOCK) {
      return;
     }

     reseedWorld();

    // refs reset
    CAPTURED_PASSWORD_REF.value = null;
    FINAL_SESSION_ID_REF.value = "";
    LAST_PROTOCOL_REF.value = "HTTP/1.1";
    REQUEST_TIME_REF.value = null;

    logBuffer.reset();
    terminalEngine.reset();
    hashScreen.reset();
    glitchEngine.reset();

    // terminal flags reset
    terminalStartedRef.value = false;
    // terminalPhaseStartedRef laat ik ongemoeid tenzij jij hem expliciet reset.
    // Als je hem WEL wilt resetten, zet hier ook: terminalPhaseStartedRef.value = false;

    // render state reset
    renderState.ipResolvedForSession = false;
    renderState.lastTime = 0;
    renderState.forceSpike = 0;
    renderState.typedLength = 0;
    renderState.lastTypeTime = 0;
    renderState.titleFinished = 0;
    renderState.blackoutStart = 0;

    // userGen moet bestaan (anders kan je geen users trekken)
    const userGen = getUserGenOrThrow();
    setGetRandomUserByGroupRef(userGen.getRandomUserByGroup);

    // nieuwe experience
// nieuwe experience
const experience = experienceFactory.createNewExperience();

setNetworkGroup(experience.NETWORK_GROUP);
setUsernameGroup(experience.USERNAME_GROUP);
setSiteUser(experience.SITE_USER);
setSession(experience.SESSION);
setRandomAscii(experience.RANDOM_ASCII);
setPolicy(experience.POLICY);

// loop duration
loopState.duration = computeLoopDuration(experience.SESSION, randFloat);

// UI reset
applyUILanguage(experience.NETWORK_GROUP, UI_TEXT);

    dom.terminalElement.classList.remove("open");

    const terminalOutput = document.getElementById("terminalOutput");
    const terminalTitle  = document.getElementById("terminalTitle");
    if (terminalOutput) terminalOutput.innerHTML = "";
    if (terminalTitle) terminalTitle.textContent = "";

    // render/layout reset
    resize();

    const isColdBoot = !hasBootedOnceRef.value;
    setState(isColdBoot ? STATES.INTRO : STATES.TITLE);

    setExperienceStart(performance.now());

    dom.introScreen.style.display = hasBootedOnceRef.value ? "none" : "flex";
    document.body.style.overflow  = hasBootedOnceRef.value ? "hidden" : "auto";

    titleEngine.generateTitleLogs();
  };
}
