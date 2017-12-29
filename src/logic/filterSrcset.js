// @flow
import parseSrcset from '../utils/parseSrcset';

export const findClosestDpr = (result: Array<Object>, target: number) =>
  result.reduce((prev, curr) => (Math.abs(curr.dpr - target) < Math.abs(prev.dpr - target) ? curr : prev));

// $FlowIgnoreLine: srcset is part of HTML
export default function filterImgSrc({ srcset, dataset }: HTMLElement) {
  if (!srcset) return dataset.src;

  // $FlowIgnoreLine: DOM api
  const clientWidth = document.documentElement.clientWidth || window.innerWidth; // eslint-disable-line no-undef
  const devicePixelRatio = window.devicePixelRatio; // eslint-disable-line no-undef
  const parsedSrcset = parseSrcset(srcset);
  const srcInArray = parsedSrcset.map(src => ({
    ...src,
    ...(!src.dpr && src.width ? { dpr: src.width / clientWidth } : null),
  }));
  const src = srcInArray.find(({ dpr }) => devicePixelRatio === dpr);

  return src ? src.url : findClosestDpr(srcInArray, devicePixelRatio).url;
}
