export function pickFromWeights(weightObj, randFloat) {

  const entries = Object.entries(weightObj);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);

  let r = randFloat() * total;

  for (const [key, weight] of entries) {
    if (r < weight) return key;
    r -= weight;
  }

  return entries[0][0];
}

export function createGroupSelector({ CONFIG, randFloat }) {

  function getWeightedGroup(activeRegion, GROUP_WEIGHTS) {

    if (activeRegion === "world") {
      return pickFromWeights(GROUP_WEIGHTS, randFloat);
    }

    const regionWeights =
      CONFIG.GROUP_WEIGHTS_BY_REGION?.[activeRegion];

    if (regionWeights) {
      return pickFromWeights(regionWeights, randFloat);
    }

    return pickFromWeights(GROUP_WEIGHTS, randFloat);
  }

  return {
    getWeightedGroup
  };
}
