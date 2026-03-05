export async function loadConfig(options = {}) {
  const {
    basePath = "./data",
    cache = "no-store"
  } = options;

  const files = [
    "traffic.txt",
    "themes.txt",
    "policy.txt",
    "ui.txt",
    "visuals.txt"
  ];

  const results = await Promise.all(
    files.map(async (name) => {
      const response = await fetch(`${basePath}/${name}`, { cache });

      if (!response.ok) {
        throw new Error(`Config load failed: ${name} (${response.status})`);
      }

      return response.json();
    })
  );

  const [
    TRAFFIC,
    THEMES,
    POLICY,
    UI,
    VISUALS
  ] = results;

  const CONFIG = Object.assign(
    {},
    TRAFFIC,
    THEMES,
    POLICY,
    UI,
    VISUALS
  );

  validateConfig(CONFIG);

  return CONFIG;
}

export function validateConfig(CONFIG) {
  if (!CONFIG || typeof CONFIG !== "object") {
    throw new Error("Config invalid: expected object");
  }

  const requiredKeys = [
    "GROUP_WEIGHTS",
    "GROUP_LABELS",
    "UI_TEXT",
    "FLAG_THEMES"
  ];

  for (const key of requiredKeys) {
    if (!(key in CONFIG)) {
      throw new Error(`Config missing ${key}`);
    }
  }

  if (typeof CONFIG.GROUP_WEIGHTS !== "object") {
    throw new Error("Config invalid: GROUP_WEIGHTS must be an object");
  }

  if (typeof CONFIG.GROUP_LABELS !== "object") {
    throw new Error("Config invalid: GROUP_LABELS must be an object");
  }

  if (typeof CONFIG.UI_TEXT !== "object") {
    throw new Error("Config invalid: UI_TEXT must be an object");
  }

  if (typeof CONFIG.FLAG_THEMES !== "object") {
    throw new Error("Config invalid: FLAG_THEMES must be an object");
  }
}
