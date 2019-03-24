// @flow
import observerStart, { defaultConfig } from './logic/observerStart';

export type Config = {
  root?: HTMLElement,
  rootMargin?: string,
  threshold?: number | Array<number>,
};

export default function initSimpleImg(
  config: Config = defaultConfig,
  disableAnimateCachedImg: boolean = false,
  logConsoleError: boolean = false,
) {
  if (typeof window === 'undefined') return;
  observerStart(config, disableAnimateCachedImg, logConsoleError);
}
