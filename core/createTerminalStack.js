// core/createTerminalStack.js
import { createHashScreenEngine } from "../engines/hashScreen.js";
import { createTerminalEngine } from "../engines/terminal.js";

export function createTerminalStack({
  randFloat,
  getVisitorIP,
  getHostLabel,
  getThemeForGroup,
  getPolicy,

  groupSelector,
  GROUP_WEIGHTS,
  GROUP_LABELS,
  FLAG_THEMES,

  BASE_DOMAIN,
  FULL_DOMAIN,
  IP_ADDRESS,

  // experience getters
  getSession,
  getSiteUser,
  getRandomUserByGroup,
  getNetworkGroup,
  getRandomAscii,

  // logs + refs
  pushAccessLog,
  getTailLines,
  CAPTURED_PASSWORD_REF,
  FINAL_SESSION_ID_REF,
  LAST_PROTOCOL_REF,
  REQUEST_TIME_REF
}) {

  const hashScreen = createHashScreenEngine({
    randFloat,
    getSiteUser,
    getCapturedPassword: () => CAPTURED_PASSWORD_REF.value,
    getNetworkGroup,
    GROUP_LABELS,
    getPolicy,
    getRandomAscii,
    getSession,

    // single-source refs for cross-phase consistency
    FINAL_SESSION_ID_REF,
    REQUEST_TIME_REF
  });

  const terminalEngine = createTerminalEngine({
    randFloat,
    getVisitorIP,
    getHostLabel,
    getThemeForGroup,
    getWeightedGroup: (region) => groupSelector.getWeightedGroup(region, GROUP_WEIGHTS),
    GROUP_LABELS,
    FLAG_THEMES,
    getSession,
    getSiteUser,
    getRandomUserByGroup,
    getNetworkGroup,
    BASE_DOMAIN,
    FULL_DOMAIN,
    IP_ADDRESS,
    pushAccessLog,
    getTailLines,
    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF,
    LAST_PROTOCOL_REF,
    REQUEST_TIME_REF
  });

  return { hashScreen, terminalEngine };
}
