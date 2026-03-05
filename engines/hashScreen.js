export function createHashScreenEngine({
  randFloat,
  getSiteUser,
  getCapturedPassword,
  getNetworkGroup,
  GROUP_LABELS,
  getPolicy,
  getRandomAscii,
  getSession,
  FINAL_SESSION_ID_REF,
  REQUEST_TIME_REF
}) {

  let hashTypedLength = 0;
  let hashLastTypeTime = 0;
  let hashFinished = 0;

  let rollingSession = "";
  let finalSessionId = "";
  let rollingStartTime = 0;
  let rollingDone = false;
  let rollingTriggered = false;
    let requestTimeValue = 0;

  const typingSpeed = 16;
  const hashPause = 2500;
  const rollingDuration = 900;

  function generateSessionId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(16).padStart(2,"0"))
      .join("")
      .slice(0,16)
      .toUpperCase();
  }

function reset() {
  hashTypedLength = 0;
  hashLastTypeTime = 0;
  hashFinished = 0;

  rollingSession = "";
  rollingStartTime = 0;
  rollingDone = false;
  rollingTriggered = false;

  // Definitieve session id: single source via ref
  if (FINAL_SESSION_ID_REF && !FINAL_SESSION_ID_REF.value) {
    FINAL_SESSION_ID_REF.value = generateSessionId();
  }
  finalSessionId = FINAL_SESSION_ID_REF?.value || generateSessionId();

  // Request time: single source via ref
  if (REQUEST_TIME_REF && REQUEST_TIME_REF.value == null) {
    REQUEST_TIME_REF.value = Math.floor(20 + randFloat() * 230); // 20–250ms
  }
}

  function getTrafficLabel(type) {
    if (type === "scripted") return "bot";
    if (type === "datacenter") return "datacenter";
    return "residential";
  }

  function buildHashText(currentSessionValue) {

    const siteUser = getSiteUser();
    const capturedPassword = getCapturedPassword();
    const networkGroup = getNetworkGroup();
    const randomAscii = getRandomAscii();
    const policy = getPolicy();

    const session = getSession?.();
    const trafficType = getTrafficLabel(session?.type);

    const ua =
      (typeof navigator !== "undefined" && navigator.userAgent)
        ? navigator.userAgent
        : "unknown";

    const requestTime = REQUEST_TIME_REF?.value ?? 0;

    const lines = [
      `Session-ID: ${currentSessionValue}`,
      `User-ID: ${siteUser}`,
      `X-Auth-Token: ${capturedPassword || ""}`,
      `Geo: ${GROUP_LABELS[networkGroup] || networkGroup}`,
      `Traffic-Type: ${trafficType}`,
      `User-Agent: ${ua}`,
      `Request-Time: ${requestTime}ms`,
      "",
      "Authorization-Engine: RBAC v2.3",
      `Policy-Check: ${policy.status} (${policy.reason})`,
      "",
      "HTTP 403 - ACCESS DENIED",
      "",
      randomAscii
    ];

    return lines.join("\n");
  }

  function update(timestamp) {

    if (!hashLastTypeTime) hashLastTypeTime = timestamp;

    let currentSessionValue = rollingSession;

    const sessionPrefixLength = "Session-ID: ".length;

    if (!rollingTriggered && hashTypedLength >= sessionPrefixLength) {
      rollingTriggered = true;
      rollingStartTime = timestamp;
    }

    if (rollingTriggered && !rollingDone) {

      const elapsed = timestamp - rollingStartTime;

      if (elapsed < rollingDuration) {

        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

        rollingSession = "";

        for (let i = 0; i < 16; i++) {
          rollingSession +=
            chars[Math.floor(randFloat() * chars.length)];
        }

      } else {
        rollingSession = finalSessionId;
        rollingDone = true;
      }
    }

    currentSessionValue = rollingSession;

    const fullHash = buildHashText(currentSessionValue);

    if (hashTypedLength < fullHash.length) {
      if (timestamp - hashLastTypeTime > typingSpeed) {
        hashTypedLength++;
        hashLastTypeTime = timestamp;
      }
    } else {
      if (!hashFinished) hashFinished = timestamp;
    }

    return {
      done: hashFinished && (timestamp - hashFinished > hashPause),
      fullHash
    };
  }

  function render(ctx, canvasWidth) {

    const currentSessionValue = rollingSession;
    const fullHash = buildHashText(currentSessionValue);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, ctx.canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "18px monospace";

    const visible = fullHash.substring(0, hashTypedLength);
    const lines = visible.split("\n");

    let y = 18 + (18 * 2);

    for (const line of lines) {
      ctx.fillText(line, 22, y);
      y += 18;
    }
  }

  return {
    reset,
    update,
    render
  };
}
