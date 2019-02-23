// @flow

export function applyStyle(target: any, withoutPlaceholder: boolean): void {
  /* eslint-disable */
  target.style.opacity = withoutPlaceholder ? 0 : 1;
  /* eslint-enable */
}

export default function applyImage(target: any, image: Image, src: string) {
  /* eslint-disable */
  target.src = src;
  if (target.dataset.srcset) {
    target.srcset = target.dataset.srcset;
  }

  target.style.visibility = 'visible';

  const withoutPlaceholder = target.getAttribute('data-placeholder') === 'false';
  /* eslint-enable */
  const currentTarget = withoutPlaceholder ? target : target.nextSibling;

  if (currentTarget || withoutPlaceholder) {
    target.addEventListener('load', () => {
      if (target) {
        applyStyle(currentTarget, withoutPlaceholder);
      }
      target.removeEventListener('load', applyStyle);
    });
  }
  window.__REACT_SIMPLE_IMG__.imgLoadingRefs.delete(target);
}
