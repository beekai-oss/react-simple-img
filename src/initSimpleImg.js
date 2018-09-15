// @flow
import imageLoader from './utils/imageLoader';
import type { Config } from './simpleImgProvider';

export const defaultConfig = {
  rootMargin: '0px 0px',
  threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
};

export function onIntersection(entries: Array<{ intersectionRatio: number, target: any }>) {
  for (let i = 0, len = entries.length; i < len; i++) {
    const { intersectionRatio, target } = entries[i];
    if (intersectionRatio > 0) {
      imageLoader.call(this, target);
    }
  }
}

export function observerStart(config: Config = defaultConfig) {
  if (!window.IntersectionObserver) require('intersection-observer');
  // $FlowIgnoreLine:
  const observer = new IntersectionObserver(entries => onIntersection.call(this, entries), config);
  if (this) return observer;

  window.__REACT_SIMPLE_IMG__ = {
    observer,
    imgLoadingRefs: new Map(),
  };

  return null;
}

export default function initSimpleImg(config: Config = defaultConfig) {
  if (typeof window === 'undefined') return;
  window.addEventListener('load', () => {
    observerStart(config);
  });
}
