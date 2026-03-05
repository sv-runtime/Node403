// ./core/runtimeState.js
export function createRuntimeState() {
  const loopState = { duration: 35000 };

  const terminalPhaseStartedRef = { value: false };
  const terminalStartedRef = { value: false };

const renderState = {
  lastTime: 0,
  forceSpike: 0,

  typedLength: 0,
  lastTypeTime: 0,
  titleFinished: 0,

  blackoutStart: 0,
  ipResolvedForSession: false,   // ✅ komma toegevoegd

  loadingProgress: 0,
  loadingActive: false
};

  // dit blijft een ref zodat resetExperience hem kan flippen
  const hasBootedOnceRef = { value: false };

  // experienceStart moeten we kunnen lezen/schrijven vanuit renderer + reset
  let experienceStart = 0;
  const getExperienceStart = () => experienceStart;
  const setExperienceStart = (v) => { experienceStart = v; };

  return {
    loopState,

    terminalPhaseStartedRef,
    terminalStartedRef,

    renderState,

    hasBootedOnceRef,

    getExperienceStart,
    setExperienceStart
  };
}
