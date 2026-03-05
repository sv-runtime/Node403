let VISITOR_IP = null;
let HOST_LABEL = null;

let IP_PROMISE = null;
let IP_RESOLVED = false;

export function getVisitorIP() {
  return VISITOR_IP;
}

export function getHostLabel() {
  return HOST_LABEL;
}

export function isIPResolved() {
  return IP_RESOLVED;
}

export async function resolveVisitorIP() {

  if (IP_RESOLVED && VISITOR_IP) {
    return VISITOR_IP;
  }

  if (IP_PROMISE) {
    return IP_PROMISE;
  }

  IP_PROMISE = (async () => {

    try {
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 500);

let res;
try {
  res = await fetch("api/ip.php", {
    cache: "no-store",
    signal: controller.signal
  });
} finally {
  clearTimeout(timeout);
}
      clearTimeout(timeout);

      if (!res.ok) throw new Error("bad response");

      const data = await res.json();

      VISITOR_IP = data.ip || "unknown";
      HOST_LABEL = VISITOR_IP;
      IP_RESOLVED = true;

      return VISITOR_IP;

    } catch (e) {

      VISITOR_IP = "unknown";
      HOST_LABEL = VISITOR_IP;
      IP_RESOLVED = true;

      return VISITOR_IP;
    }

  })();

  return IP_PROMISE;
}
