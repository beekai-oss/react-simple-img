// @flow
import imageLoader from './utils/imageLoader';
import type { Config } from './simpleImgProvider';

export default function init(config: Config) {
  /* eslint-disable */
  if (!window.IntersectionObserver) require('intersection-observer');
  // $FlowIgnoreLine:
  const observer = new IntersectionObserver(entries => onIntersection.call(this, entries), config);

  if (this) {
    return observer;
  } else {
    return window.reactSimpleImgobserver = observer;
  }
  /* eslint-enable */
}

function onIntersection(entries: Array<{ intersectionRatio: number, target: any }>) {
  entries.forEach(({ intersectionRatio, target }) => (intersectionRatio > 0) && imageLoader.call(this, target));
}
