// @flow
import filterImgSrc from '../logic/filterSrcset';
import fetchImage from './fetchImage';

export function applyImage(target: any, image: Image, src: string) {
  if (this) {
    this.setState(previousState => ({
      mountedImages: new Set(previousState.mountedImages.add(target)),
    }));
    this.removeImgLoadingRef(image);
  } else {
    if (!target) return;

    /* eslint-disable */
    target.src = src;
    if (target.dataset.srcset) {
      target.srcset = target.dataset.srcset;
    }
    target.style.visibility = 'visible';
    /* eslint-enable */
    const nextSiblingElm = target.nextSibling;
    nextSiblingElm.setAttribute('style', `opacity: 0;${nextSiblingElm.getAttribute('style')}`);
    window.__REACT_SIMPLE_IMG__.imgLoadingRefs.delete(target);
  }
}

function logError(message: string, target: any, e: any) {
  const errorObject = { message, target, e };

  if (this && this.props.onError) {
    this.props.onError(errorObject);
  } else if (window.__REACT_SIMPLE_IMG__.onError) {
    window.__REACT_SIMPLE_IMG__.onError(errorObject);
  } else {
    console.error(`💩 ${message}\n\n${target.outerHTML}\n\n and error message ${JSON.stringify(e, null, 2)}`);
  }
}

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
      logError.apply(this, 'Filter Image source returned empty image source', target);
      return;
    }

    fetchImage(image, src)
      .then(() => {
        applyImage.apply(this, [target, image, src]);
      })
      .catch(e => {
        logError.apply(this, 'Fetch image failed with target', target, e);
      });
  } catch (e) {
    logError.apply(this, 'Image loader failed with target', target, e);
  }
}
