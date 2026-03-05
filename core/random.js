// /core/random.js
let WORLD_SEED = 1;
let rand = null;

function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function init(seed) {
  WORLD_SEED = seed >>> 0;
  rand = mulberry32(WORLD_SEED);
}

function randomSeedUint32() {
  const seedArray = new Uint32Array(1);
  crypto.getRandomValues(seedArray);
  return seedArray[0] >>> 0;
}

// automatisch bij import
init(randomSeedUint32());

export function randFloat() {
  // seeded random, niet Math.random()
  return rand();
}

export function reseedWorld(seed = randomSeedUint32()) {
  init(seed);
  return WORLD_SEED;
}

export function getSeed() {
  return WORLD_SEED;
}
