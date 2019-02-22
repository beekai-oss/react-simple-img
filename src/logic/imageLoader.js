// @flow
import filterImgSrc from '../utils/filterSrcset';
import fetchImage from './fetchImage';
import applyImage from './applyImage';
import logError from '../utils/logError';
import setImageHeight from '../utils/setImageHeight';
import updateSessionStorage from './updateSessionStorage';

export default function imageLoader(target: any, withObserver: boolean = true) {
  try {
    const image = new Image(); // eslint-disable-line no-undef

    if (withObserver) {
      const { observer, imgLoadingRefs } = window.__REACT_SIMPLE_IMG__;

      observer.unobserve(target);
      imgLoadingRefs.set(target, image);
    }

    const src = filterImgSrc(target);

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
          if (window.__REACT_SIMPLE_IMG__ && window.__REACT_SIMPLE_IMG__.disableAnimateCachedImg) {
            updateSessionStorage(src);
          }
        }
      })
      .catch(e => {
        logError('Fetch image failed with target', target, e);
      });
  } catch (e) {
    logError('Image loader failed with target', target, e);
  }
}
