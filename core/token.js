export function deriveToken(session) {
  if (!session) return "";

  // simpele pseudo-hash (visueel logisch, geen echte crypto)
  let hash = 0;
  for (let i = 0; i < session.length; i++) {
    hash = (hash << 5) - hash + session.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(16).toUpperCase();
}
