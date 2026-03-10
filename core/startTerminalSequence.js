// core/startTerminalSequence.js
import { BASE_DOMAIN } from "./constants.js";

export function createStartTerminalSequence({
  isIPResolved,
  resolveVisitorIP,
  titleEngine,
  terminalElement,
  getSiteUser,
  getVisitorIP,
  terminalEngine
}) {
  return async function startTerminalSequence() {
    if (!isIPResolved()) {
      await resolveVisitorIP();
    }

    titleEngine.generateTitleLogs?.();

    if (terminalElement) {
      terminalElement.classList.add("open");
    }

    const titleNode = document.getElementById("terminalTitle");

    if (titleNode) {
      titleNode.textContent = `admin@${BASE_DOMAIN}:/var/log`;
    }

    await new Promise(r => requestAnimationFrame(r));

    terminalEngine.runTerminal();
  };
}
