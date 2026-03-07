// ./core/createStartExperience.js
export function createStartExperience({ PHASE, STATES, hasBootedOnceRef, resetExperience }) {
  return async function startExperience() {
         if (
      PHASE.current !== STATES.INTRO &&
      PHASE.current !== STATES.MENU &&
      PHASE.current !== STATES.LOADING &&
      PHASE.current !== STATES.TITLE
     ) return;

    hasBootedOnceRef.value = true;
    await resetExperience();
  };
}
