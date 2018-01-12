// @flow
import filterImgSrc from '../logic/filterSrcset';

const fetchImage = (imageSrc: string) =>
  new Promise((resolve, error) => {
    const image = new Image(); // eslint-disable-line no-undef
    image.src = imageSrc;
    image.onload = resolve;
    image.onerror = error;
  });

function applyImage(target: any, src: string) {
  if (this) {
    this.setState(previousState => ({
      mountedImages: new Set(previousState.mountedImages.add(target)),
    }));
  } else {
    /* eslint-disable */
    target.src = src;
    target.style.visibility = 'visible';
    /* eslint-enable */
    const nextSiblingElm = target.nextSibling;
    nextSiblingElm.setAttribute('style', `opacity: 0; transition: 0.3s all; ${nextSiblingElm.getAttribute('style')}`);
  }
}

export default async function imageLoader(target: any) {
  try {
    if (this) {
      this.observer.unobserve(target);
    } else {
      window.reactSimpleImgobserver.unobserve(target); // eslint-disable-line no-undef
    }

    const src = filterImgSrc(target);
    await fetchImage(filterImgSrc(target));

    applyImage.apply(this, [target, src]);
  } catch (e) {
    throw new Error(`💩 Fetch image failed with target ${JSON.stringify(target, null, 2)} and error message ${e}`);
  }
}
