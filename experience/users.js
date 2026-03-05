// ./experience/users.js

export function createUserGenerator(allIdentities, { randFloat }) {

  function pick(arr) {
    return arr[Math.floor(randFloat() * arr.length)];
  }

  function generateWeirdUsername(group) {

    const identity = allIdentities[group];
    if (!identity || !identity.WEIRD_NAMES?.length) {
      return null;
    }

    let username = pick(identity.WEIRD_NAMES);

    const useYear = randFloat() < 0.60;

    if (useYear) {
      const year = 1968 + Math.floor(randFloat() * 58);
      const sep = randFloat() < 0.50 ? "_" : ".";
      username += sep + year;
    } else {
      const digits =
        (randFloat() < 0.65)
          ? (10 + Math.floor(randFloat() * 90))
          : Math.floor(randFloat() * 9999);

      username += digits;
    }

    return {
      username: username.toLowerCase(),
      group
    };
  }

  function generateNormalUsername(group) {

    const identity = allIdentities[group];

    if (!identity || !identity.FIRST_NAMES?.length) {
      return { username: "unknown", group };
    }

    const firstPool = identity.FIRST_NAMES;
    const lastPool  = identity.LAST_NAMES || [];

    const first = pick(firstPool);
    const includeLast = randFloat() < 0.70 && lastPool.length > 0;

    let username = first;
    let pattern = "first_only";

    if (includeLast) {

      const last = pick(lastPool);
      const separators = [".", "_", "-"];
      const sep = pick(separators);

      const patternRoll = randFloat();

      if (patternRoll < 0.45) {
        username = first + sep + last;
        pattern = "first_sep_last";
      } else if (patternRoll < 0.65) {
        username = last + sep + first;
        pattern = "last_sep_first";
      } else if (patternRoll < 0.85) {
        username = first + last;
        pattern = "firstlast";
      } else {
        username = last + first;
        pattern = "lastfirst";
      }

    } else {

      const variantRoll = randFloat();

      if (variantRoll < 0.35) {
        const year = 1950 + Math.floor(randFloat() * 71);
        username += year;
        return { username: username.toLowerCase(), group };
      }

      if (variantRoll < 0.65) {
        username += Math.floor(randFloat() * 9999);
        return { username: username.toLowerCase(), group };
      }

      if (variantRoll < 0.80) {
        const year = 1950 + Math.floor(randFloat() * 71);
        const sep = randFloat() < 0.5 ? "_" : "-";
        username += sep + year;
        return { username: username.toLowerCase(), group };
      }
    }

    const forbidSuffix =
      pattern === "first_sep_last" ||
      pattern === "last_sep_first";

    if (!forbidSuffix) {

      const suffixChance =
        (pattern === "first_only") ? 0.78 :
        (pattern === "firstlast" || pattern === "lastfirst") ? 0.55 :
        0.30;

      if (randFloat() < suffixChance) {

        if (randFloat() < 0.55) {
          const year = 1968 + Math.floor(randFloat() * 58);
          username += year;
        } else {
          const digits =
            (randFloat() < 0.55)
              ? Math.floor(randFloat() * 99)
              : Math.floor(randFloat() * 9999);

          username += digits;
        }
      }
    }

    return {
      username: username.toLowerCase(),
      group
    };
  }

  function getRandomUserByGroup(group) {

    const weirdChance = 0.35;

    if (randFloat() < weirdChance) {
      const weird = generateWeirdUsername(group);
      if (weird) return weird;
    }

    return generateNormalUsername(group);
  }

  return {
    getRandomUserByGroup,
    generateWeirdUsername,
    generateNormalUsername
  };
}
