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

    image.addEventListener('load', e => {
      if (target.parentNode.style.height === '1px') target.parentNode.style.height = `${e.target.height}px`; // eslint-disable-line
      target.parentNode.style.visibility = 'visible'; // eslint-disable-line
    });

    fetchImage(image, src)
      .then(() => {
        applyImage.apply(this, [target, image, src]);
        if (window.__REACT_SIMPLE_IMG__ && window.__REACT_SIMPLE_IMG__.disableAnimateCachedImg) {
          const cachedImages = JSON.parse(window.sessionStorage.getItem('__REACT_SIMPLE_IMG__')) || {};
          cachedImages[src] = +new Date();
          window.sessionStorage.setItem('__REACT_SIMPLE_IMG__', JSON.stringify(cachedImages));
        }
      })
      .catch(e => {
        logError('Fetch image failed with target', target, e);
      });
  } catch (e) {
    logError('Image loader failed with target', target, e);
  }
}
