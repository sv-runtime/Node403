export const STATES = {
  INTRO: -100,
    LOADING: -75, 
  TITLE: -50,
  CURTAIN: 0,
  HASH: 50,
  BLACKOUT: 100,
  MATRIX_INTRO: 200,
  MATRIX_RUN: 300
};

export const PHASE = {
  current: null,
  start: 0
};

export function setState(state, ts) {
  PHASE.current = state;
  PHASE.start = ts ?? performance.now();
}

export function elapsedInState() {
  return performance.now() - PHASE.start;
}
