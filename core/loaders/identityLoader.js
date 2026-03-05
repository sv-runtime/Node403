export async function preloadAllIdentities({
  groups,
  basePath = "./data",
  cache = "no-store",
  onProgress = () => {}
}) {
  const result = {};
  let loaded = 0;
  const total = groups.length || 1;

  for (const group of groups) {
    try {
      const r = await fetch(`${basePath}/identity/${group}.txt`, { cache });

      if (!r.ok) {
        console.warn("Missing identity file:", group);
      } else {
        const text = await r.text();
        result[group] = JSON.parse(text);
      }

    } catch (err) {
      console.warn("Broken identity file:", group, err);
    }

    loaded++;
    onProgress(Math.round((loaded / total) * 100));
  }

  return result;
}
