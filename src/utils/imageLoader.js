// @flow
import filterImgSrc from '../logic/filterSrcset';
import fetchImage from './fetchImage';
import applyImage from './applyImage';
import logError from './logError';

export default function imageLoader(target: any) {
  try {
    const image = new Image(); // eslint-disable-line no-undef

    if (this) {
      this.observer.unobserve(target);
      this.appendImgLoadingRef(image);
    } else {
      const { observer, imgLoadingRefs } = window.__REACT_SIMPLE_IMG__;

      observer.unobserve(target);
      imgLoadingRefs.set(target, image);
    }

    const src = filterImgSrc(target);

    if (!src) {
      logError('Filter Image source returned empty image source', target);
      return;
    }

    fetchImage(image, src)
      .then(() => {
        applyImage.apply(this, [target, image, src]);
      })
      .catch(e => {
        logError('Fetch image failed with target', target, e);
      });
  } catch (e) {
    logError('Image loader failed with target', target, e);
  }
}
