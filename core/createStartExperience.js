// ./core/createStartExperience.js
export function createStartExperience({ PHASE, STATES, hasBootedOnceRef, resetExperience }) {

  return async function startExperience() {

    // force reset als we uit een andere fase komen (bijv. 300)
    if (
      PHASE.current !== STATES.INTRO &&
      PHASE.current !== STATES.MENU &&
      PHASE.current !== STATES.LOADING &&
      PHASE.current !== STATES.TITLE
    ) {
      PHASE.current = STATES.INTRO;
    }

    hasBootedOnceRef.value = true;

    await resetExperience();
  };

}
