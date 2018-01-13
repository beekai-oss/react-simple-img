// @flow
import imageLoader from './utils/imageLoader';
import type { Config } from './simpleImgProvider';

export default function initSimpleImg(config: Config) {
  /* eslint-disable */
  if (!window.IntersectionObserver) require('intersection-observer');
  // $FlowIgnoreLine:
  const observer = new IntersectionObserver(entries => onIntersection.call(this, entries), config);
  return this ? observer : window.reactSimpleImgObserver = observer;
  /* eslint-enable */
}

export function onIntersection(entries: Array<{ intersectionRatio: number, target: any }>) {
  for (let i = 0, len = entries.length; i < len; i++) { // eslint-disable-line no-plusplus
    const { intersectionRatio, target } = entries[i];
    if (intersectionRatio > 0) {
      imageLoader.call(this, target);
      break;
    }
  }
}
