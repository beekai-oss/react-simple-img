// @flow

export default function applyImage(target: any, image: Image, src: string, isCached: boolean) {
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
      const style = nextSiblingElm.getAttribute('style');
      nextSiblingElm.setAttribute(
        'style',
        `${style && style.includes('opacity') ? '' : 'opacity: 0;'} ${style} ${isCached ? 'display: none' : ''}`,
      );
    }
    window.__REACT_SIMPLE_IMG__.imgLoadingRefs.delete(target);
  }
}
