export function createLogBuffer({
  maxSize = 50,
  tailLines = 3
} = {}) {

  const buffer = [];

  function push(entry) {
    buffer.push(entry);
    if (buffer.length > maxSize) {
      buffer.shift();
    }
  }

  function tail(n = tailLines) {
    return buffer.slice(-n);
  }

  function reset() {
    buffer.length = 0;
  }

  return {
    push,
    tail,
    reset
  };
}
