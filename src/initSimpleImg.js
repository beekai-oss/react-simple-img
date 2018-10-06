// @flow
import type { Config, OnErrorFunction } from './simpleImgProvider';
import observerStart, { defaultConfig } from './logic/observerStart';

export default function initSimpleImg(config: Config = defaultConfig, onError?: OnErrorFunction) {
  if (typeof window === 'undefined') return;
  window.addEventListener('load', () => {
    observerStart(config, onError);
  });
}
