// ./ui/resize.js
import { initMatrixState } from "../engines/matrix.js";

export function createResizeHandler({
  canvas,
  ctx,
  curtainEngine,

  // input vars
  getMatrixFontSize,           // () => matrixFontSize
  getCurtainColumnSpacing,     // () => curtainColumnSpacing
  randFloat,

  // outputs setters
  setCurtainColumns,           // (n) => curtainColumns = n
  setMatrixColumns,            // (n) => matrixColumns = n
  setIntroColumns,             // (n) => introColumns = n
  setMatrixState               // (state) => { introDrops=..., drops=..., ... }
}) {
  return function resize() {
    const ratio = window.devicePixelRatio || 1;
    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;

    canvas.width = cssWidth * ratio;
    canvas.height = cssHeight * ratio;

    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const curtainColumnSpacing = getCurtainColumnSpacing();
    const matrixFontSize = getMatrixFontSize();

    setCurtainColumns(Math.floor(cssWidth / curtainColumnSpacing));
    const matrixColumns = Math.floor(cssWidth / matrixFontSize);
    setMatrixColumns(matrixColumns);

    const introColumns = Math.max(8, Math.floor(cssWidth / matrixFontSize));
    setIntroColumns(introColumns);

    const state = initMatrixState({
      introColumns,
      matrixColumns,
      randFloat
    });

    setMatrixState(state);

    curtainEngine.init(cssWidth, cssHeight);
  };
}
