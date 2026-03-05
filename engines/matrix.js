export function initMatrixState({ introColumns, matrixColumns, randFloat }) {
  if (typeof randFloat !== "function") {
    throw new Error("initMatrixState: randFloat must be provided");
  }

  const MATRIX_CONFIG = {
    introDepthLayers: 3,
    introDropRange: 50,

    speedMin: 0.08,
    speedRange: 0.25,

    maxLengthBase: 10,
    maxLengthRange: 40,

    spawnMin: 0.3,
    spawnRange: 0.6,

    driftRange: 6
  };

  const introDrops = [];
  for (let d = 0; d < MATRIX_CONFIG.introDepthLayers; d++) {
    const layerDrops = [];
    for (let i = 0; i < introColumns; i++) {
      layerDrops[i] = randFloat() * -MATRIX_CONFIG.introDropRange;
    }
    introDrops.push(layerDrops);
  }

  const drops = [];
  const stacks = [];
  const speeds = [];
  const maxLengths = [];
  const spawnRates = [];
  const drift = [];
  const driftOffset = [];

  for (let i = 0; i < matrixColumns; i++) {
    drops[i] = randFloat() * -100;
    stacks[i] = [];

    speeds[i] = MATRIX_CONFIG.speedMin + randFloat() * MATRIX_CONFIG.speedRange;

    maxLengths[i] =
      MATRIX_CONFIG.maxLengthBase + Math.floor(randFloat() * MATRIX_CONFIG.maxLengthRange);

    spawnRates[i] =
      MATRIX_CONFIG.spawnMin + randFloat() * MATRIX_CONFIG.spawnRange;

    drift[i] = (randFloat() - 0.5) * MATRIX_CONFIG.driftRange;
    driftOffset[i] = 0;
  }

  return {
    introDrops,
    drops,
    stacks,
    speeds,
    maxLengths,
    spawnRates,
    drift,
    driftOffset
  };
}
