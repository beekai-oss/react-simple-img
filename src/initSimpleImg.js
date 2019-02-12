// @flow
import type { Config } from './simpleImgProvider';
import observerStart, { defaultConfig } from './logic/observerStart';

export default function initSimpleImg(config: Config = defaultConfig, disableAnimateCachedImg: boolean = false) {
  if (typeof window === 'undefined') return;
  observerStart(config, disableAnimateCachedImg);
}
