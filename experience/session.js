export function createExperienceContext(config, helpers) {

  const {
    GROUP_WEIGHTS,
    GROUP_WEIGHTS_BY_REGION,
    FLAG_THEMES,
    ASCII_FIGURES,
    POLICY_RESULTS,
    GEO_RESTRICTED_COUNTRIES
  } = config;

  const {
    randFloat,
    generatePolicyDecision,
    getThemeForGroup,
    applyTheme,
    getRandomUserByGroup
  } = helpers;

  let ACTIVE_REGION = "world";

  function pickFromWeights(weightObj) {
    const entries = Object.entries(weightObj);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let r = randFloat() * total;

    for (const [key, weight] of entries) {
      if (r < weight) return key;
      r -= weight;
    }

    return entries[0][0];
  }

  function getWeightedGroup() {
    if (ACTIVE_REGION === "world") {
      return pickFromWeights(GROUP_WEIGHTS);
    }

    const regionWeights =
      GROUP_WEIGHTS_BY_REGION?.[ACTIVE_REGION];

    if (regionWeights) {
      return pickFromWeights(regionWeights);
    }

    return pickFromWeights(GROUP_WEIGHTS);
  }

  function generateSessionProfile() {

    const profiles = {
      residential: 60,
      datacenter: 25,
      scripted: 15
    };

    const type = pickFromWeights(profiles);

    const profile = { type };

    if (type === "residential") {
      profile.usernameStyle = "normal";
      profile.protocolBias = "http2";
      profile.latencyBase = 40;
    }

    if (type === "datacenter") {
      profile.usernameStyle = "mixed";
      profile.protocolBias = "http1";
      profile.latencyBase = 15;
    }

    if (type === "scripted") {
      profile.usernameStyle = "weird-heavy";
      profile.protocolBias = "http1";
      profile.latencyBase = 5;
    }

    return profile;
  }

  function createNewExperience(forcedNetworkGroup) {

    const NETWORK_GROUP =
      forcedNetworkGroup || getWeightedGroup();

    const USERNAME_GROUP = NETWORK_GROUP;

    const SITE_USER_OBJ =
      getRandomUserByGroup(USERNAME_GROUP);

    const SITE_USER = SITE_USER_OBJ.username;

    const SESSION = generateSessionProfile();

    const POLICY = generatePolicyDecision({
      networkGroup: NETWORK_GROUP,
      session: SESSION,
      geoRestrictedCountries: GEO_RESTRICTED_COUNTRIES,
      policyResults: POLICY_RESULTS,
      randFloat
    });

    const theme = getThemeForGroup(NETWORK_GROUP, FLAG_THEMES);
    applyTheme(theme);

    const RANDOM_ASCII =
      ASCII_FIGURES[Math.floor(randFloat() * ASCII_FIGURES.length)];

return {
  NETWORK_GROUP,
  USERNAME_GROUP,
  SITE_USER,
  SESSION,
  RANDOM_ASCII,
  POLICY
};
  }

  return {
    createNewExperience
  };
}
