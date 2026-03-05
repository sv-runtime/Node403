export function createTerminalEngine(deps) {

const REQUEST_METHODS = [
  "GET",
  "POST",
  "HEAD"
];

const SECURITY_EVENTS = [

  "[SECURITY] anomaly score high",
  "[SECURITY] rate limit triggered",
  "[SECURITY] bot fingerprint detected",

  "[SECURITY] request blocked by WAF rule",
  "[SECURITY] suspicious request pattern",
  "[SECURITY] credential stuffing detected",
  "[SECURITY] brute force attempt detected",

  "[SECURITY] invalid auth token",
  "[SECURITY] session validation failed",
  "[SECURITY] token mismatch detected",

  "[SECURITY] geo mismatch detected",
  "[SECURITY] ASN reputation warning",

  "[SECURITY] malformed request header",
  "[SECURITY] invalid content-length header",

  "[SECURITY] automated traffic detected",
  "[SECURITY] headless browser detected",

  "[SECURITY] excessive login attempts",
  "[SECURITY] temporary IP ban applied"

];

    const {
      randFloat,
      getVisitorIP,
      getThemeForGroup,
      GROUP_LABELS,
      FLAG_THEMES,
      getSession,
      getNetworkGroup,
      BASE_DOMAIN,
      CAPTURED_PASSWORD_REF,
      FINAL_SESSION_ID_REF,
        REQUEST_TIME_REF,
      getRandomUserByGroup,
      getWeightedGroup,
      getSiteUser
    } = deps;

const REQUEST_PATHS = [
  "/",
    "/",
    "/",
    "/",
  "/about.php",
  "/contact.php",
  "/favicon.ico",

  "/api/ip.php",

  "/header.php",
  "/footer.php",
  "/footer-index.php",

  "/core/createApplication.js",
  "/core/createAppRenderer.js",
  "/core/bootstrapApp.js",
  "/core/ip.js",
  "/core/policy.js",
  "/core/theme.js",

  "/engines/terminal.js",
  "/engines/hashScreen.js",
  "/engines/titleEngine.js",
  "/engines/matrixEngine.js",

  "/data/identity"
];

  let terminalRunning = false;

  /* =========================
     UTILS
  ========================= */

function pickRequestPath(domain = BASE_DOMAIN) {
  // 60% “normale” paden, 40% “scan” paden (optioneel)
  const path = REQUEST_PATHS[Math.floor(randFloat() * REQUEST_PATHS.length)];
  // Als je “$domain” gevoel wil: je kunt hem hier verwerken in querystring.
  // Domain in access.log path is normaal niet nodig, maar dit geeft wel ‘context’.
  if (path === "/" && randFloat() < 0.25) {
    return `/?host=${encodeURIComponent(domain)}`;
  }
  return path;
}

function pickRequestMethod() {
  return REQUEST_METHODS[Math.floor(randFloat() * REQUEST_METHODS.length)];
}

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function generateSessionId() {
    return (
      Math.random().toString(36).substring(2, 10) +
      Math.random().toString(36).substring(2, 6)
    ).toUpperCase();
  }

function maybeSecurityEvent() {

  // ±15% kans
  if (randFloat() < 0.15) {
    return SECURITY_EVENTS[
      Math.floor(randFloat() * SECURITY_EVENTS.length)
    ];
  }

  return null;
}

  function getNodes() {
    return {
      output: document.getElementById("terminalOutput"),
      body: document.getElementById("terminalBody")
    };
  }

function getTrafficLabel(type) {
 if (type === "scripted") return "bot";
 if (type === "datacenter") return "datacenter";
 return "residential";
}

  function getNginxTimestamp(date = new Date()) {

  const pad = n => n.toString().padStart(2, "0");

  return (
    date.getFullYear() + "/" +
    pad(date.getMonth() + 1) + "/" +
    pad(date.getDate()) + " " +
    pad(date.getHours()) + ":" +
    pad(date.getMinutes()) + ":" +
    pad(date.getSeconds())
  );
}

  /* =========================
     ACCESS LOG BUFFER
  ========================= */

  const LOG_BUFFER_SIZE = 200;

  const accessLogBuffer = [];

  function pushAccessLog(entry) {
    accessLogBuffer.push(entry);
    if (accessLogBuffer.length > LOG_BUFFER_SIZE) {
      accessLogBuffer.shift();
    }
  }

  function seedAccessLogIfEmpty() {

    if (accessLogBuffer.length > 0) return;

    const count = 9;

    for (let i = 0; i < count; i++) {
      pushAccessLog(generateOldLog());
    }
  }

  /* =========================
     FAKE OLD LOG
  ========================= */

function generateOldLog() {

  const group = getWeightedGroup();
  const fakeUser = getRandomUserByGroup(group);

  const fakeIP =
    Math.floor(randFloat()*255) + "." +
    Math.floor(randFloat()*255) + "." +
    Math.floor(randFloat()*255) + "." +
    Math.floor(randFloat()*255);

  const fakeSize = Math.floor(120 + randFloat()*200);

  const protocol = randFloat() < 0.7 ? "HTTP/1.1" : "HTTP/2";
    const method = pickRequestMethod();
const path = pickRequestPath(BASE_DOMAIN);    

  const country = GROUP_LABELS[group] || group;

  const fakeSessionId = generateSessionId();

  const fakeToken =
    Math.random().toString(36).substring(2,8).toUpperCase();

  if (REQUEST_TIME_REF && REQUEST_TIME_REF.value == null) {
      // fallback (als fase 50 hem niet gezet heeft)
      REQUEST_TIME_REF.value = Math.floor(20 + randFloat() * 230); // 20–250ms
    }

    const requestTime = REQUEST_TIME_REF?.value ?? 0;

  const fakeTraffic =
    randFloat() < 0.15 ? "bot" :
    randFloat() < 0.35 ? "datacenter" :
    "residential";

  const index = accessLogBuffer.length;
    const secondsBack = (10 - index) * 15;
    const fakeDate = new Date(Date.now() - secondsBack * 1000);

  const text =
    fakeIP + " - " + fakeUser.username + " - " +
    "[" + getNginxTimestamp(fakeDate) + '] "' + method + ' ' + path + ' ' + protocol + '" 403 ' + fakeSize + ' "-" ' +
    '"Mozilla/5.0 (X11; Linux x86_64)" ' +
    requestTime +
    " sid=" + fakeSessionId +
    " token=" + fakeToken +
    ' "' + country + '" ' +
    fakeTraffic;

  const theme = getThemeForGroup(group, FLAG_THEMES);

  let color = theme.error || "#ff4d4d";

  if (color.toLowerCase() === "#000000") {
    color = theme.secondary || "#ffffff";
  }

  return { text, color };
}

  /* =========================
     TERMINAL PROMPTS
  ========================= */

  function createUserPrompt(output) {

    const line = document.createElement("div");

    line.innerHTML =
      '<span class="userhost">admin@' + BASE_DOMAIN + '</span>' +
      '<span class="colon">:</span>' +
      '<span class="path">~</span>' +
      '<span class="symbol">$ </span>';

    output.appendChild(line);

    return line;
  }

  function createRootPrompt(output) {

    const line = document.createElement("div");

    line.innerHTML =
      '<span class="userhost">admin@' + BASE_DOMAIN + '</span>' +
      '<span class="colon">:</span>' +
      '<span class="path">/var/log</span>' +
      '<span class="symbol">$ </span>';

    output.appendChild(line);

    return line;
  }

  /* =========================
     TERMINAL PRINT
  ========================= */

  async function typeLine(line, text, body, speed = 18) {

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    line.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {

      line.insertBefore(document.createTextNode(text[i]), cursor);

      await sleep(speed + randFloat()*20);

      body.scrollTop = body.scrollHeight;
    }

    cursor.remove();

    await sleep(200);
  }

  async function printLines(output, body, lines) {

    for (const l of lines) {

      const row = document.createElement("pre");

      row.className = "term-line output";

      row.textContent = l;

      output.appendChild(row);

      body.scrollTop = body.scrollHeight;

      await sleep(80 + randFloat()*80);
    }
  }

  async function printAccessTail(output, body, lines) {

    for (const entry of lines) {

      const row = document.createElement("pre");

      row.className = "term-line";
      row.textContent = entry.text;
      row.style.color = entry.color || "#ffffff";

      output.appendChild(row);

      body.scrollTop = body.scrollHeight;

      await sleep(60 + randFloat()*80);
    }
  }

  /* =========================
     MAIN TERMINAL RUN
  ========================= */

  async function runTerminal() {

    if (terminalRunning) return;

    terminalRunning = true;

    const { output, body } = getNodes();

    output.innerHTML = "";
    accessLogBuffer.length = 0;
    seedAccessLogIfEmpty();

    const session = getSession();
    const trafficType = getTrafficLabel(session.type);

const prompt1 = createUserPrompt(output);

await sleep(200);

await typeLine(prompt1, `ping ${BASE_DOMAIN}`, body);

const pingCount = 3 + Math.floor(randFloat() * 6);
const ip = getVisitorIP();

const pingLines = [
  `PING ${BASE_DOMAIN} (${ip}) 56 data bytes`
];

const times = [];

for (let i = 1; i <= pingCount; i++) {

  const t = (20 + randFloat()*10).toFixed(1);

  times.push(parseFloat(t));

    pingLines.push(
      `64 bytes from ${ip}: icmp_seq=${i} ttl=64 time=${t} ms`
    );
}

const min = Math.min(...times).toFixed(1);
const max = Math.max(...times).toFixed(1);
const avg = (times.reduce((a,b)=>a+b,0)/times.length).toFixed(1);
const variance = times.reduce((a,b)=>a+Math.pow(b-avg,2),0)/times.length;
const mdev = Math.sqrt(variance).toFixed(2);

pingLines.push("^C");
pingLines.push(`--- ${BASE_DOMAIN} ping statistics ---`);
pingLines.push(`${pingCount} packets transmitted, ${pingCount} received, 0% packet loss`);
pingLines.push(`rtt min/avg/max/mdev = ${min}/${avg}/${max}/${mdev} ms`);

await printLines(output, body, pingLines);

const rootPrompt = createRootPrompt(output);

await sleep(200);

await typeLine(rootPrompt, "tail -n 10 access.log", body);

const protocol = randFloat() < 0.7 ? "HTTP/1.1" : "HTTP/2";
const method = pickRequestMethod();
const path = pickRequestPath(BASE_DOMAIN);

const size = Math.floor(120 + randFloat()*80);

const sessionId = FINAL_SESSION_ID_REF?.value || (session?.id || generateSessionId());

const token =
  CAPTURED_PASSWORD_REF?.value ||
  Math.random().toString(36).substring(2,8).toUpperCase();

if (REQUEST_TIME_REF && REQUEST_TIME_REF.value == null) {
  // fallback als hash phase het om wat voor reden dan ook niet heeft gezet
  REQUEST_TIME_REF.value = Math.floor(20 + randFloat() * 230);
}
const requestTime = REQUEST_TIME_REF?.value ?? 0;

const country =
  GROUP_LABELS[getNetworkGroup()] || getNetworkGroup();

/* ===== ACCESS LOG LINE ===== */

const logLine =
  getVisitorIP() + " - " + getSiteUser() + " - " +
  "[" + getNginxTimestamp() + '] "' + method + " " + path + " " + protocol + '" 403 ' + size + ' "-" ' +
  '"' + navigator.userAgent + '" ' +
  requestTime +
  " sid=" + sessionId +
  " token=" + token +
  ' "' + country + '" ' +
  trafficType;

/* ===== COLOR ===== */

const theme = getThemeForGroup(getNetworkGroup(), FLAG_THEMES);

let logColor = theme.error || "#ff4d4d";

if (logColor.toLowerCase() === "#000000") {
  logColor = theme.secondary || "#ffffff";
}

pushAccessLog({ text: logLine, color: logColor });

const securityEvent = maybeSecurityEvent();

if (securityEvent) {
  pushAccessLog({
    text: securityEvent,
    color: "#ffaa00"
  });
}

const tail = accessLogBuffer.slice(-10);

await printAccessTail(output, body, tail);

    const finalPrompt = createRootPrompt(output);

    const cursor = document.createElement("span");
    cursor.className = "cursor";

        finalPrompt.appendChild(cursor);

    terminalRunning = false;
  }

  return {
    runTerminal,
    reset() {
      terminalRunning = false;
    }
  };

}
