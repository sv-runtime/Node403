export function createRenderer(deps) {

  function wrapLine(ctx, line, maxWidth) {
    if (line === "") return [""];

    const words = line.split(" ");
    let current = "";
    const wrapped = [];

    for (let w of words) {
      const test = current ? current + " " + w : w;
      if (ctx.measureText(test).width > maxWidth) {
        wrapped.push(current);
        current = w;
      } else {
        current = test;
      }
    }

    if (current !== "") wrapped.push(current);
    if (!wrapped.length) return [""];

    return wrapped;
  }

  function render(timestamp) {

    const {
      canvas,
      ctx,
      PHASE,
      STATES,
      setState,
      TIMING,
      randFloat,
      getThemePalette,
      titleEngine,
      curtainEngine,
      hashScreen,
      glitchEngine,
      resolveVisitorIP,
      startTerminalSequence,
      matrixChars,
      getLoopDuration,
      getExperienceStart,
      setExperienceStart,
      getMatrixGeometry,
      getMatrixState,
      renderState
    } = deps;

    const TARGET_FPS = 30;
    const FRAME_TIME = 1000 / TARGET_FPS;

    if (PHASE.current >= STATES.MATRIX_INTRO) {
      if (!renderState.lastFrameTime) {
        renderState.lastFrameTime = timestamp;
      }

      if (timestamp - renderState.lastFrameTime < FRAME_TIME) {
        requestAnimationFrame(render);
        return;
      }

      renderState.lastFrameTime = timestamp;
    }

    renderState.lastFrameTime = timestamp;

    const runtime = getExperienceStart() ? (timestamp - getExperienceStart()) : 0;

    if (
      getExperienceStart() &&
      runtime > getLoopDuration() &&
      PHASE.current === STATES.MATRIX_RUN
    ) {

      const backBtn = document.getElementById("backBtn");
      if (backBtn) backBtn.style.display = "block";

      deps.resetExperience();
      setExperienceStart(performance.now());
    }

    if (!renderState.lastTime) renderState.lastTime = timestamp;

    let delta = (timestamp - renderState.lastTime) / 1000;

    if (renderState.forceSpike > 0) {
      delta += renderState.forceSpike;
      renderState.forceSpike = 0;
    }

    renderState.lastTime = timestamp;

    const palette = getThemePalette();

    /* ===== BACKGROUND ===== */
    const isMatrixTrailPhase = PHASE.current === 200 || PHASE.current === 300;

    if (isMatrixTrailPhase) {
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.textBaseline = "top";

    const { matrixFontSize, trailSpacing, matrixColumns, introColumns } = getMatrixGeometry();
    const {
      introDrops,
      drops,
      stacks,
      speeds,
      maxLengths,
      spawnRates,
      driftOffset
    } = getMatrixState();

    /* ===== FASE -100 INTRO ===== */
    if (PHASE.current === STATES.INTRO) {
      const height = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      const depthConfig = [
        { speed: 0.006, alpha: 0.15, scale: 0.9 },
        { speed: 0.010, alpha: 0.30, scale: 1.0 },
        { speed: 0.018, alpha: 0.55, scale: 1.1 }
      ];

      for (let d = 0; d < introDrops.length; d++) {
        const layer = introDrops[d];
        const cfg = depthConfig[d];

        ctx.globalAlpha = cfg.alpha;
        ctx.font =
          (matrixFontSize * cfg.scale) +
          "px 'Noto Sans Mono','IBM Plex Mono',monospace";

        for (let i = 0; i < introColumns; i++) {
          const x = i * matrixFontSize;
          const y = layer[i] * matrixFontSize;

          const char = matrixChars[Math.floor(randFloat() * matrixChars.length)];

          const baseColor = palette[i % palette.length];
          const isBlack = baseColor.toLowerCase() === "#000000";

          if (isBlack) {
            // 1) lift zonder dubbele alpha-vermenigvuldiging
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillStyle = "rgba(200,200,200,0.25)";
            ctx.fillText(char, x, y);
            ctx.restore();

            // 2) echte zwarte laag met diepte-alpha
            ctx.globalAlpha = cfg.alpha;
            ctx.fillStyle = baseColor;
            ctx.fillText(char, x, y);
          } else {
            ctx.fillStyle = baseColor;
            ctx.fillText(char, x, y);
          }

          layer[i] += cfg.speed;

          if (y > height) {
            layer[i] = randFloat() * -20;
          }
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(render);
      return;
    }

 /* ===== FASE -90 MENU ===== */
 if (PHASE.current === STATES.MENU) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(render);
  return;
 }

/* ===== FASE -75 LOADING ===== */
if (PHASE.current === STATES.LOADING) {

  // 🔥 reset alles
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  const p = Math.max(0, Math.min(100, renderState.loadingProgress || 0));

  // 👇 minder breed maken
  const barW = Math.floor(w * 0.2);   // was 0.6
  const barH = 5;                   // iets slanker

  const x = Math.floor((w - barW) / 2);
  const y = Math.floor((h - barH) / 2);

  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(x, y, barW, barH);

  ctx.fillStyle = palette[1] || "#fff";
  ctx.fillRect(x, y, Math.floor((barW * p) / 100), barH);

ctx.font = "14px 'IBM Plex Mono', monospace";
ctx.fillStyle = "#ffffff";

ctx.textAlign = "center";
ctx.textBaseline = "bottom";

ctx.fillText(
  `${p}%`,
  x + barW / 2,   // midden van de balk
  y - 6           // 6px boven de balk
);

ctx.textAlign = "left";
ctx.textBaseline = "alphabetic";

  requestAnimationFrame(render);
  return;
}

    /* ===== FASE -50 TITLE ===== */
    if (PHASE.current === STATES.TITLE) {
      if (!renderState.ipResolvedForSession) {
        renderState.ipResolvedForSession = true;
        resolveVisitorIP().then(() => {
          titleEngine.generateTitleLogs();
        });
      }

      const currentTitle = titleEngine.getTitleText();

      if (!renderState.lastTypeTime) renderState.lastTypeTime = timestamp;

      if (renderState.typedLength < currentTitle.length) {

      const elapsed = timestamp - renderState.lastTypeTime;
      const chars = Math.floor(elapsed / TIMING.typingSpeed);

      if (chars > 0) {
        renderState.typedLength = Math.min(
          renderState.typedLength + chars,
          currentTitle.length
        );

        renderState.lastTypeTime += chars * TIMING.typingSpeed;
      }

    } else {
        if (!renderState.titleFinished) renderState.titleFinished = timestamp;
        if (timestamp - renderState.titleFinished > TIMING.titlePause) {
          setState(STATES.CURTAIN, timestamp);
        }
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "18px monospace";

      const text = currentTitle.substring(0, renderState.typedLength);
      const lines = text.split("\n");

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 22, 18 + i * 18);
      }

      if (Math.floor(timestamp / 500) % 2 === 0) {
        const lines2 = text.split("\n");
        const lastLine = lines2[lines2.length - 1] || "";

        const cursorX = 22 + ctx.measureText(lastLine).width;
        const cursorY = 18 + (lines2.length - 1) * 18;

        ctx.fillRect(cursorX + 4, cursorY, 8, 16);
      }

      requestAnimationFrame(render);
      return;
    }

    /* ===== FASE 0 GORDIJN ===== */
    if (PHASE.current === STATES.CURTAIN) {
      const done = curtainEngine.update(timestamp, delta, window.innerHeight);

      curtainEngine.render(ctx, palette, window.innerHeight);

      if (done) {
        setState(STATES.HASH, timestamp);
      }

      requestAnimationFrame(render);
      return;
    }

    /* ===== FASE 50 HASH SCREEN ===== */
    if (PHASE.current === STATES.HASH) {
      const result = hashScreen.update(timestamp);

      hashScreen.render(ctx, canvas.width, timestamp);

      if (result.done) {
        renderState.blackoutStart = timestamp;
        setState(STATES.BLACKOUT, timestamp);
      }

      requestAnimationFrame(render);
      return;
    }



    /* ===== FASE 100 BLACKOUT ===== */
    if (PHASE.current === STATES.BLACKOUT) {
      const elapsed = timestamp - renderState.blackoutStart;
      const progress = Math.min(elapsed / TIMING.blackoutDuration, 1);

      ctx.fillStyle = `rgba(0,0,0,${progress})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (elapsed >= TIMING.blackoutDuration) {
        setState(STATES.MATRIX_INTRO, timestamp);
      }

      requestAnimationFrame(render);
      return;
    }

    ctx.font =
      matrixFontSize + "px 'Noto Sans Mono', 'IBM Plex Mono', monospace";

    if (
      PHASE.current === STATES.MATRIX_INTRO &&
      timestamp - PHASE.start > TIMING.introDuration
    ) {
      setState(STATES.MATRIX_RUN);

      deps.terminalPhaseStarted.value = true;
      glitchEngine.triggerTerminalBurst(timestamp);

      if (!deps.terminalStarted.value) {

        deps.terminalStarted.value = true;

        const backBtn = document.getElementById("backBtn");
        if (backBtn) backBtn.style.display = "none";

        startTerminalSequence();
      }
    }

    if (PHASE.current === STATES.MATRIX_INTRO) {
      glitchEngine.updateIntro(timestamp);
    }

    if (PHASE.current === STATES.MATRIX_RUN) {
      glitchEngine.updateTerminal(timestamp);
    }

    if (glitchEngine.isIntroGlitchActive()) {
      ctx.save();

      ctx.globalAlpha = 0.12 + randFloat() * 0.06;
      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle =
        randFloat() < 0.5 ? "rgba(160,30,25,1)" : "rgba(190,60,20,1)";

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 0.18;
      const bandY = randFloat() * canvas.height;
      ctx.fillRect(0, bandY, canvas.width, 4 + randFloat() * 10);

      ctx.restore();
    }

    if (glitchEngine.isTerminalGlitchActive()) {
      ctx.save();

      ctx.globalAlpha = 0.08 + randFloat() * 0.08;
      ctx.fillStyle = "rgba(170,40,30,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 0.15;
      const bandY = randFloat() * canvas.height;
      ctx.fillRect(0, bandY, canvas.width, 6 + randFloat() * 10);

      ctx.restore();
    }

    for (let i = 0; i < matrixColumns; i++) {
      const x = i * matrixFontSize + driftOffset[i];
      const y = drops[i] * matrixFontSize;
      const colColor = palette[i % palette.length];

      if (PHASE.current === STATES.MATRIX_INTRO) {
        const depthLayers = [
          { speed: 0.55, alpha: 0.18, scale: 0.85 },
          { speed: 1.0, alpha: 0.40, scale: 1.0 },
          { speed: 1.9, alpha: 0.85, scale: 1.12 }
        ];

        const headY = drops[i] * matrixFontSize;

        for (let d = 0; d < depthLayers.length; d++) {
          const layer = depthLayers[d];
          const layerY = headY * layer.speed;

          ctx.font =
            matrixFontSize * layer.scale +
            "px 'Noto Sans Mono','IBM Plex Mono',monospace";

          const char = matrixChars[Math.floor(randFloat() * matrixChars.length)];

          if (d === depthLayers.length - 1) {
            ctx.fillStyle = "#e6e6e6";
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "rgba(230,230,230,0.9)";
          } else {
            const isBlack = colColor.toLowerCase() === "#000000";

            if (isBlack) {
              ctx.fillStyle = "#d0d0d0";
              ctx.globalAlpha = layer.alpha * 0.7;
            } else {
              ctx.fillStyle = colColor;
              ctx.globalAlpha = layer.alpha;
            }

            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, x, layerY);
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        drops[i] += 12 * delta;

        if (drops[i] * matrixFontSize > canvas.height) {
          drops[i] = randFloat() * -40;
        }
      } else {
        if (randFloat() < spawnRates[i]) {
          stacks[i].unshift(
            matrixChars[Math.floor(randFloat() * matrixChars.length)]
          );
        }

        if (stacks[i].length > maxLengths[i]) stacks[i].pop();

            for (let t = 0; t < stacks[i].length; t++) {
          const trailY = y - t * trailSpacing;
          if (trailY < 0) continue;

          const alpha = 1 - t / stacks[i].length;

          if (t === 0) {
            ctx.fillStyle = "#e6e6e6";
            ctx.globalAlpha = 0.25;

            ctx.shadowBlur = 6;
            ctx.shadowColor = "rgba(230,230,230,0.9)";
          } else {
            const baseColor = palette[i % palette.length];
            const isBlack = baseColor.toLowerCase() === "#000000";

            if (isBlack) {
              ctx.save();
              ctx.fillStyle = "rgba(200,200,200," + alpha * 0.35 + ")";
              ctx.fillText(stacks[i][t], x, trailY);
              ctx.restore();

              ctx.fillStyle = baseColor;
              ctx.globalAlpha = alpha * 0.9;
            } else {
              ctx.fillStyle = baseColor;
              ctx.globalAlpha = alpha * 0.8;
            }

            ctx.shadowBlur = 0;
          }

          ctx.fillText(stacks[i][t], x, trailY);

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }

        drops[i] += speeds[i] * 15 * delta;

        if (drops[i] * matrixFontSize > canvas.height + 120) {
          drops[i] = randFloat() * -20;
          stacks[i] = [];
        }
      }
    }

    requestAnimationFrame(render);
  }

  return { render };
}
