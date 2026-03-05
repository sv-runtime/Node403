export function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, "");
}

/* block users */
export const BLOCKED = [
  /* normalize("voornaam.achternaam"), */
];

export function isBlocked(nameOrId) {
  if (!nameOrId) return false;
  const n = normalize(nameOrId);
  return BLOCKED.includes(n);
}
