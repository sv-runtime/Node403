export function createCurtainEngine({
  randFloat,
  getSeed,
  CAPTURED_PASSWORD_REF = null,
  FINAL_SESSION_ID_REF = null
}) {

  const curtainChars =
    "abcdefghijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "0123456789" +
    "-_!+%$#@<>?/()*&";

  const CURTAIN_BLOCK_WIDTH = 12;
  const CURTAIN_GAP_WIDTH   = 4.5;

  let curtainFontSize = window.innerWidth > 1800 ? 20 : 14;
  const curtainLineHeight    = curtainFontSize * 0.55;
  const curtainColumnSpacing = curtainFontSize * 0.55;

  let curtainColumns = 0;
  let curtainOffset = 0;
  let curtainSpeed = 260;

  const acceleration = 700;
  const curtainDepth = 4;

  const curtainPauseDuration = 3000;
  let curtainPauseStart = 0;

  let capturedPassword = null;

  let grid = [];

  function init(width, height) {

    curtainColumns = Math.floor(width / curtainColumnSpacing);

    const rows = Math.ceil(height / curtainLineHeight);

    grid = [];

    for (let c = 0; c < curtainColumns; c++) {
      grid[c] = [];
      for (let r = 0; r < rows * curtainDepth; r++) {
        grid[c][r] =
          curtainChars[Math.floor(randFloat() * curtainChars.length)];
      }
    }

    curtainOffset = -height;
    curtainPauseStart = 0;
    curtainSpeed = 260;
    capturedPassword = null;
  }

  function charAt(col, row, blockIndex) {

    let x =
      (col * 374761393) ^
      (row * 668265263) ^
      (blockIndex * 1442695041) ^
      getSeed();

    x = (x ^ (x >>> 13)) * 1274126177;
    x = x ^ (x >>> 16);

    const idx = (x >>> 0) % curtainChars.length;
    return curtainChars[idx];
  }

  function capturePassword(height) {
console.log("CAPTURE PASSWORD CALLED");
    const rowsOnScreen = Math.ceil(height / curtainLineHeight);

    const visibleColumns = [];

    for (let c = 0; c < curtainColumns; c++) {
      const inBlock =
        (c % (CURTAIN_BLOCK_WIDTH + CURTAIN_GAP_WIDTH)) < CURTAIN_BLOCK_WIDTH;
      if (inBlock) visibleColumns.push(c);
    }

    if (!visibleColumns.length) return;

    const chosenCol =
      visibleColumns[Math.floor(randFloat() * visibleColumns.length)];

    const blockIndex =
      Math.floor(chosenCol / (CURTAIN_BLOCK_WIDTH + CURTAIN_GAP_WIDTH));

    const midRow = Math.floor(rowsOnScreen / 2);
    const baseRow = Math.floor(curtainOffset / curtainLineHeight);

    let password = "";

    for (let i = 0; i < CURTAIN_BLOCK_WIDTH; i++) {
      const col = (chosenCol + i) % curtainColumns;
      password += charAt(col, baseRow + midRow, blockIndex);
    }

capturedPassword = password;
console.log("TOKEN:", password);
if (CAPTURED_PASSWORD_REF) {
  CAPTURED_PASSWORD_REF.value = password;
}
  }

  function update(timestamp, delta, height) {

    const firstStop = 0;
    const finalStop = height * curtainDepth;

    if (curtainOffset < firstStop) {
      curtainSpeed = Math.min(curtainSpeed + acceleration * delta, 1400);
      curtainOffset += curtainSpeed * delta;
      return false;
    }

    if (!curtainPauseStart) {
      curtainOffset = firstStop;
      curtainPauseStart = timestamp;
      if (!capturedPassword) capturePassword(height);
      return false;
    }

    if (timestamp - curtainPauseStart < curtainPauseDuration) {
      return false;
    }

    if (curtainOffset < finalStop) {
      curtainSpeed += acceleration * delta;
      curtainOffset += curtainSpeed * delta;
      return false;
    }

    return true; // klaar → naar HASH
  }

  function render(ctx, palette, height) {

    ctx.font = curtainFontSize + "px 'IBM Plex Mono', monospace";

    const rowsOnScreen = Math.ceil(height / curtainLineHeight);

    const rowOffset = curtainOffset / curtainLineHeight;
    const baseRow = Math.floor(rowOffset);
    const frac = rowOffset - baseRow;

    const extra = 4;

    for (let c = 0; c < curtainColumns; c++) {

      const blockIndex =
        Math.floor(c / (CURTAIN_BLOCK_WIDTH + CURTAIN_GAP_WIDTH));

      const inBlock =
        (c % (CURTAIN_BLOCK_WIDTH + CURTAIN_GAP_WIDTH)) < CURTAIN_BLOCK_WIDTH;

      if (!inBlock) continue;

      const x = c * curtainColumnSpacing;
      const baseColor = palette[blockIndex % palette.length];

      for (let r = -extra; r < rowsOnScreen + extra; r++) {

        if ((r & 3) !== 0) continue;

        const worldRow = baseRow + r;
        const y = (r + frac) * curtainLineHeight;

        if (y < -curtainFontSize || y > height + curtainFontSize) continue;

        const ch = charAt(c, worldRow, blockIndex);

const isBlack = baseColor.toLowerCase() === "#000000";
if (isBlack) {
  ctx.save();
  ctx.fillStyle = "rgba(200,200,200,0.6)";
  ctx.fillText(ch, Math.floor(x), Math.floor(y));
  ctx.restore();
}

ctx.fillStyle = baseColor;
ctx.fillText(ch, Math.floor(x), Math.floor(y));
      }
    }
  }

  function getCapturedPassword() {
    return capturedPassword;
  }

  return {
    init,
    update,
    render,
    getCapturedPassword
  };
}
