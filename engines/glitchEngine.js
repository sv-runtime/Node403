export function createGlitchEngine({ randFloat }) {

  let glitchActive = false;
  let glitchBursts = 0;
  let glitchEnd = 0;
  let nextGlitchTime = 0;

  let terminalGlitchActive = false;
  let terminalGlitchEnd = 0;
  let terminalNextGlitch = 0;
  let terminalGlitchBursts = 0;

  function updateIntro(timestamp) {

    if (!glitchActive && timestamp >= nextGlitchTime) {
      glitchActive = true;
      glitchBursts = randFloat() < 0.4 ? 2 : 1;
      glitchEnd = timestamp + 45;
      nextGlitchTime = timestamp + 900 + randFloat() * 1300;
    }

    if (glitchActive) {

      if (timestamp >= glitchEnd) {
        glitchBursts--;

        if (glitchBursts > 0) {
          glitchEnd = timestamp + 70;
          glitchActive = "gap";
        } else {
          glitchActive = false;
        }
      }

      if (glitchActive === "gap" && timestamp >= glitchEnd) {
        glitchActive = true;
        glitchEnd = timestamp + 45;
      }
    }
  }

  function updateTerminal(timestamp) {

    if (!terminalGlitchActive && timestamp >= terminalNextGlitch) {

      terminalGlitchActive = true;
      terminalGlitchBursts = randFloat() < 0.25 ? 2 : 1;
      terminalGlitchEnd = timestamp + 40;
      terminalNextGlitch = timestamp + (5000 + randFloat() * 25000);
    }

    if (terminalGlitchActive) {

      if (timestamp >= terminalGlitchEnd) {

        terminalGlitchBursts--;

        if (terminalGlitchBursts > 0) {
          terminalGlitchEnd = timestamp + 60;
        } else {
          terminalGlitchActive = false;
        }
      }
    }
  }

  function isIntroGlitchActive() {
    return glitchActive === true;
  }

  function isTerminalGlitchActive() {
    return terminalGlitchActive;
  }

  function reset() {
    glitchActive = false;
    terminalGlitchActive = false;
  }

function triggerTerminalBurst(timestamp) {
  terminalGlitchActive = true;
  terminalGlitchBursts = 2;
  terminalGlitchEnd = timestamp + 50;
}

return {
  updateIntro,
  updateTerminal,
  isIntroGlitchActive,
  isTerminalGlitchActive,
  triggerTerminalBurst,
  reset
};
}
