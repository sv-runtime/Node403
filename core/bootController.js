// ./core/bootController.js
import { bindUIEvents } from "../ui/dom.js";

export function createBootController(deps) {

  const {
    dom,
    GROUP_WEIGHTS,
    preloadAllIdentities,
    createUserGenerator,
    randFloat,
    STATES,
    setState,
    renderState,
    getAllIdentities,
    setAllIdentities,
    getUserGen,
    setUserGen,
    setGetRandomUserByGroupRef,
    startExperience
  } = deps;

  async function ensureIdentitiesLoaded() {

    console.log("GROUP_WEIGHTS:", GROUP_WEIGHTS);
    console.log("Group count:", Object.keys(GROUP_WEIGHTS).length);

    renderState.loadingActive = true;
    renderState.loadingProgress = 0;

    setState(STATES.LOADING);

    if (dom?.introScreen) {
      dom.introScreen.style.display = "none";
    }

    const alreadyLoaded = getAllIdentities();

    if (alreadyLoaded) {

      // kleine fake loading animatie
      for (let i = 0; i <= 100; i += 10) {
        renderState.loadingProgress = i;
        await new Promise(r => setTimeout(r, 30));
      }

      renderState.loadingActive = false;
      return;
    }

    const groups = Object.keys(GROUP_WEIGHTS);

    const identities = await preloadAllIdentities({
      groups,
      basePath: "./data",
      cache: "no-store",
      onProgress: (p) => {
        renderState.loadingProgress = p;
      }
    });

    setAllIdentities(identities);

    renderState.loadingProgress = 100;
    renderState.loadingActive = false;
  }

  async function ensureUserGeneratorReady() {

    if (getUserGen()) return;

    const gen = createUserGenerator(
      getAllIdentities(),
      { randFloat }
    );

    setUserGen(gen);
    setGetRandomUserByGroupRef(gen.getRandomUserByGroup);
  }

  function bind() {

    bindUIEvents(dom, {

      onBack: async () => {

      // start opnieuw vanaf loading
      await ensureIdentitiesLoaded();
      await ensureUserGeneratorReady();

      await startExperience();

    },

      onEnter: async () => {

        await ensureIdentitiesLoaded();
        await ensureUserGeneratorReady();

        // back knop tonen zodra experience start
        if (dom?.backBtn) {
          dom.backBtn.style.display = "block";
        }

        await startExperience();
      }

    });

  }

  return { bind };
}
