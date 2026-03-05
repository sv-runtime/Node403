let POLICY_DECISION = null;

export function getPolicyDecision() {
  return POLICY_DECISION;
}

export function generatePolicyDecision({
  networkGroup,
  session,
  geoRestrictedCountries,
  policyResults,
  randFloat
}) {

  if (geoRestrictedCountries.includes(networkGroup)) {
    POLICY_DECISION = {
      status: "DENIED",
      reason: "geo restriction policy"
    };
    return POLICY_DECISION;
  }

  if (session.type === "datacenter") {
    POLICY_DECISION = {
      status: "DENIED",
      reason: "cross-border datacenter anomaly"
    };
    return POLICY_DECISION;
  }

  const pool =
    policyResults[session.type] ||
    policyResults["default"];

  POLICY_DECISION =
    pool[Math.floor(randFloat() * pool.length)];

  return POLICY_DECISION;
}
