import parseSrcset from '../utils/parseSrcset';

export const findClosestDpr = (result, target) =>
  result.reduce((prev, curr) => (Math.abs(curr.dpr - target) < Math.abs(prev.dpr - target) ? curr : prev));

export default function filterImgSrc({ srcset, dataset }) {
  if (srcset) {
    const clientWidth = document.documentElement.clientWidth || window.innerWidth;
    const devicePixelRatio = window.devicePixelRatio;
    const srcInArray = parseSrcset(srcset).map(src => ({
      ...src,
      ...(!src.dpr ? { dpr: src.width / clientWidth } : null),
    }));
    const src = srcInArray.find(({ dpr }) => devicePixelRatio === dpr);

    if (!!src) return src.url;

    return findClosestDpr(srcInArray, devicePixelRatio).url;
  }

  return dataset.src;
}
