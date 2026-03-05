// ui/bindResize.js
import { createResizeHandler } from "./resize.js";

export function bindResize({ canvas, ctx, curtainEngine, matrixEngine, randFloat }) {
  const resize = createResizeHandler({
    canvas,
    ctx,
    curtainEngine,
    randFloat,

    getMatrixFontSize: () => matrixEngine.getLayout().matrixFontSize,
    getCurtainColumnSpacing: () => matrixEngine.getLayout().curtainColumnSpacing,

    setCurtainColumns: (v) => {
      const layout = matrixEngine.getLayout();
      matrixEngine.setColumns(layout.matrixColumns, layout.introColumns, v);
    },
    setMatrixColumns: (v) => {
      const layout = matrixEngine.getLayout();
      matrixEngine.setColumns(v, layout.introColumns, layout.curtainColumns);
    },
    setIntroColumns: (v) => {
      const layout = matrixEngine.getLayout();
      matrixEngine.setColumns(layout.matrixColumns, v, layout.curtainColumns);
    },

    setMatrixState: (state) => {
      matrixEngine.setState(state);
    }
  });

  window.addEventListener("resize", resize);
  requestAnimationFrame(() => resize());

  return resize;
}
