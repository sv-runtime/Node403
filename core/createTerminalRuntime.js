// core/createTerminalRuntime.js
import { createTerminalRefs } from "./refs.js";
import { createLogBuffer } from "./logBuffer.js";

export function createTerminalRuntime() {
  const {
  CAPTURED_PASSWORD_REF,
  FINAL_SESSION_ID_REF,
  LAST_PROTOCOL_REF,
  REQUEST_TIME_REF
} = createTerminalRefs();

  const logBuffer = createLogBuffer({ maxSize: 50, tailLines: 3 });

return {
  refs: {
    CAPTURED_PASSWORD_REF,
    FINAL_SESSION_ID_REF,
    LAST_PROTOCOL_REF,
    REQUEST_TIME_REF
  },
  logBuffer,
  pushAccessLog: logBuffer.push,
  getTailLines: logBuffer.tail
};
}
