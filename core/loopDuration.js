export function computeLoopDuration(session, randFloat) {
  if (session?.type === "scripted") {
    return Math.floor(30000 + randFloat() * 10000); // 30–40s
  }
  if (session?.type === "datacenter") {
    return Math.floor(35000 + randFloat() * 15000); // 35–50s
  }
  return Math.floor(45000 + randFloat() * 20000);   // 45–65s
}
