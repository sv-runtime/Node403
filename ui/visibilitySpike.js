export function bindVisibilitySpike({ PHASE, randFloat, renderState }) {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && (PHASE.current === 200 || PHASE.current === 300)) {
      renderState.forceSpike = 0.12 + randFloat() * 0.15;
    }
  });
}
