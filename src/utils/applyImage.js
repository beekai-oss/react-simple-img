// @flow

export default function applyImage(target: any, image: Image, src: string) {
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
    if (nextSiblingElm) {
      nextSiblingElm.setAttribute('style', `opacity: 0; transition: 0.3s all; ${nextSiblingElm.getAttribute('style')}`);
    }
    window.__REACT_SIMPLE_IMG__.imgLoadingRefs.delete(target);
  }
}
