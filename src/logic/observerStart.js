// @flow
import imageLoader from './imageLoader';

export const defaultConfig = {
  rootMargin: '0px 0px',
  threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
};

export function onIntersection(entries: Array<{ intersectionRatio: number, target: any }>) {
  for (let i = 0, len = entries.length; i < len; i++) {
    const { intersectionRatio, target } = entries[i];
    if (intersectionRatio > 0) {
      imageLoader(target);
    }
  }
}

export default function observerStart(
  config: {
    root?: HTMLElement,
    rootMargin?: string,
    threshold?: number | Array<number>,
  } = defaultConfig,
  disableAnimateCachedImg: boolean = false,
  logConsoleError: boolean,
) {
  // $FlowIgnoreLine:
  const observer = new IntersectionObserver(entries => onIntersection(entries), config);

  window.__REACT_SIMPLE_IMG__ = {
    observer,
    imgLoadingRefs: new Map(),
    callBackRefs: new Map(),
    disableAnimateCachedImg,
    logConsoleError,
  };

  return undefined;
}
