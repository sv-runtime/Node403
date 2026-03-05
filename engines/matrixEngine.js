export function createMatrixEngine() {

  const curtainChars =
    "abcdefghijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "0123456789" +
    "-_!+%$#@<>?/()*&";

  const matrixChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" +
    "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
    "ハヒフヘホマミムメモヤユヨラリルレロワヲン" +
    "一二三四五六七八九十百千万零" +
    "%$#@<>?/\\|[]{}()*&^";

  let matrixFontSize  = window.innerWidth > 1800 ? 26 : 18;
  let curtainFontSize = window.innerWidth > 1800 ? 20 : 14;

  const trailSpacing = 20;

  const CURTAIN_BLOCK_WIDTH = 12;
  const CURTAIN_GAP_WIDTH   = 4.5;

  const curtainLineHeight    = curtainFontSize * 0.55;
  const curtainColumnSpacing = curtainFontSize * 0.55;

  let introColumns = 0;
  let introDrops = [];

  let curtainColumns = 0;
  let matrixColumns  = 0;

  let drops = [];
  let stacks = [];

  let speeds = [];
  let maxLengths = [];
  let spawnRates = [];
  let drift = [];
  let driftOffset = [];

  return {
    getChars: () => ({ matrixChars, curtainChars }),
    getLayout: () => ({
      matrixFontSize,
      trailSpacing,
      matrixColumns,
      introColumns,
      curtainColumnSpacing
    }),
    getState: () => ({
      introDrops,
      drops,
      stacks,
      speeds,
      maxLengths,
      spawnRates,
      drift,
      driftOffset
    }),
    setColumns: (mc, ic, cc) => {
      matrixColumns = mc;
      introColumns = ic;
      curtainColumns = cc;
    },
    setState: (state) => {
      introDrops  = state.introDrops;
      drops       = state.drops;
      stacks      = state.stacks;
      speeds      = state.speeds;
      maxLengths  = state.maxLengths;
      spawnRates  = state.spawnRates;
      drift       = state.drift;
      driftOffset = state.driftOffset;
    }
  };
}
