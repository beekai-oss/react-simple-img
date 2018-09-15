// @flow
import type { Config } from './simpleImgProvider';
import observerStart, { defaultConfig } from './logic/observerStart';

export default function initSimpleImg(config: Config = defaultConfig) {
  if (typeof window === 'undefined') return;
  window.addEventListener('load', () => {
    observerStart(config);
  });
}
