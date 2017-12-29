// @flow
export default function parseSrcset(srcset: string) {
  const sSources = srcset.match(/\s*(?:[\S]*)(?:\s+(?:-?(?:\d+(?:\.(?:\d+)?)?|\.\d+)[a-zA-Z]))?(?:\s*,)?/g);
  if (!Array.isArray(sSources)) throw new Error(`💩 srcset is invalid ${JSON.stringify(sSources, null, 2)}`);

  const sources = [];

  for (let i = 0; i < sSources.length; i += 1) {
    let sSource = sSources[i].trim();

    if (sSource.substr(-1) === ',') {
      sSource = sSource.substr(0, sSource.length - 1).trim();
    }

    const parts = sSource.split(/\s+/, 2);

    if (parts.length === 0 || (parts.length === 1 && !parts[0]) || (parts.length === 2 && !parts[0] && !parts[1])) {
      continue; // eslint-disable-line no-continue
    }

    const url = parts[0];

    if (parts.length === 1 || (parts.length === 2 && !parts[1])) {
      // If no "w" or "x" specified, we assume it's "1x".
      sources.push({ url, width: undefined, dpr: 1 });
    } else {
      const spec = parts[1].toLowerCase();
      const lastChar = spec.substring(spec.length - 1);
      if (lastChar === 'w') {
        sources.push({ url, width: parseFloat(spec), dpr: undefined });
      } else if (lastChar === 'x') {
        sources.push({ url, width: undefined, dpr: parseFloat(spec) });
      }
    }
  }

  return sources;
}
