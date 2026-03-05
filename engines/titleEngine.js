export function createTitleEngine({ getVisitorIP }) {

  let titleLogLines = [];

  function generateTitleLogs() {

    const base = new Date();

    function pad(n){ return n.toString().padStart(2,"0"); }

    function format(d){
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
             `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    titleLogLines = [];

    const events = [
      `nginx: connection from ${getVisitorIP()} accepted`,
      `http: GET / → access control engaged`,
      `auth-module: request context received`,
      `authz: evaluation pending (rbac)`,
    ];

    for (let i = 0; i < events.length; i++) {
      const d = new Date(base.getTime() + (i * 1000));
      titleLogLines.push(`[${format(d)}] ${events[i]}`);
    }
  }

  function getTitleText() {
    return `

${titleLogLines.join("\n")}
`;
  }

  return {
    generateTitleLogs,
    getTitleText
  };
}
