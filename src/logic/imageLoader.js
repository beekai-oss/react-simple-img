// @flow
import filterImgSrc from '../utils/filterSrcset';
import fetchImage from './fetchImage';
import applyImage from './applyImage';
import logError from '../utils/logError';
import setImageHeight from '../utils/setImageHeight';
import updateSessionStorage from './updateSessionStorage';

export default function imageLoader(target: any) {
  try {
    const image = new Image(); // eslint-disable-line no-undef

    const { observer, imgLoadingRefs } = window.__REACT_SIMPLE_IMG__;
    const src = filterImgSrc(target);

    observer.unobserve(target);
    imgLoadingRefs.set(target, image);

    if (!src) {
      logError('Filter Image source returned empty image source', target);
      return;
    }

    if (target.parentNode && target.parentNode.style.height === '1px') {
      setImageHeight(image, target);
    }

    fetchImage(image, src)
      .then(() => {
        if (target) {
          applyImage(target, image, src);

          if (!window.__REACT_SIMPLE_IMG__) return;

          if (window.__REACT_SIMPLE_IMG__.disableAnimateCachedImg) {
            updateSessionStorage(src);
          }
          window.__REACT_SIMPLE_IMG__.callBackRefs.get(target)();
          window.__REACT_SIMPLE_IMG__.callBackRefs.delete(target);
        }
      })
      .catch(e => {
        logError('Fetch image failed with target', target, e);
      });
  } catch (e) {
    logError('Image loader failed with target', target, e);
  }
}
