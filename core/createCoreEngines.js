import { createTitleEngine } from "../engines/titleEngine.js";
import { createGlitchEngine } from "../engines/glitchEngine.js";
import { createCurtainEngine } from "../engines/curtainEngine.js";
import { createMatrixEngine } from "../engines/matrixEngine.js";
import { createSessionProfile } from "./sessionProfile.js";
import { getSeed } from "./random.js";

export function createCoreEngines({
  randFloat,
  getVisitorIP,
  CAPTURED_PASSWORD_REF = null,
  FINAL_SESSION_ID_REF = null
}) {

  const titleEngine = createTitleEngine({ getVisitorIP });

  const glitchEngine = createGlitchEngine({
    randFloat
  });

  const curtainEngine = createCurtainEngine({
    randFloat,
    getSeed,
    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF
  });

  const matrixEngine = createMatrixEngine();

  // side-effect: session profile initialiseren zoals origineel
  createSessionProfile({ randFloat });

  return {
    titleEngine,
    glitchEngine,
    curtainEngine,
    matrixEngine
  };
}
