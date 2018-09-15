// @flow
import parseSrcset from '../utils/parseSrcset';
import findClosestDpr from '../utils/findClosestDpr';

export default function filterImgSrc({ dataset: { src, srcset } }: any) {
  if (!srcset) return src;

  // $FlowIgnoreLine: DOM api
  const clientWidth = document.documentElement.clientWidth || window.innerWidth; // eslint-disable-line no-undef
  const devicePixelRatio = window.devicePixelRatio; // eslint-disable-line no-undef
  const parsedSrcset = parseSrcset(srcset);
  const srcInArray = parsedSrcset.map(s => ({
    ...s,
    ...(!s.dpr && s.width ? { dpr: s.width / clientWidth } : null),
  }));
  const foundSrc = srcInArray.find(({ dpr }) => devicePixelRatio === dpr);

  return foundSrc ? foundSrc.url : findClosestDpr(srcInArray, devicePixelRatio).url;
}
