import { pickFromWeights } from "./weights.js";

export function createSessionProfile({ randFloat }) {

  function generateSessionProfile() {

    const profiles = {
      residential: 60,
      datacenter: 25,
      scripted: 15
    };

    const type = pickFromWeights(profiles, randFloat);

    const profile = { type };

    if (type === "residential") {
      profile.usernameStyle = "normal";
      profile.protocolBias = "http2";
      profile.latencyBase = 40;
      profile.requestPattern = "human";
    }

    if (type === "datacenter") {
      profile.usernameStyle = "mixed";
      profile.protocolBias = "http1";
      profile.latencyBase = 15;
      profile.requestPattern = "scan";
    }

    if (type === "scripted") {
      profile.usernameStyle = "weird-heavy";
      profile.protocolBias = "http1";
      profile.latencyBase = 5;
      profile.requestPattern = "burst";
    }

    return profile;
  }

  function getTrafficType(){
    return randFloat() < 0.75 ? "local" : "external";
  }

  return {
    generateSessionProfile,
    getTrafficType
  };
}
