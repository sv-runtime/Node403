// core/experienceState.js
export function createExperienceState() {
  return {
    experience: null,
    USERNAME_GROUP: null,
    SITE_USER: null,
    SESSION: null,
    RANDOM_ASCII: null,

    ALL_IDENTITIES: null,
    userGen: null,

    getRandomUserByGroupRef: () => {
      throw new Error("User generator not ready");
    }
  };
}
