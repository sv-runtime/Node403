// render/startRenderLoop.js
export function startRenderLoop({ runtime, renderer, STATES, setState }) {
  setState(STATES.INTRO);
  runtime.setExperienceStart(performance.now());
  requestAnimationFrame((t) => renderer.render(t));
}
