// @flow

export function applyStyle(target: any, withoutPlaceholder: boolean): void {
  /* eslint-disable */
  target.style.opacity = withoutPlaceholder ? 0 : 1;
  /* eslint-enable */
}

export default function applyImage(target: any, image: Image, src: string) {
  /* eslint-disable */
  target.src = src;
  target.style.visibility = 'visible';

  if (target.dataset.srcset) {
    target.srcset = target.dataset.srcset;
  }

  const withoutPlaceholder = target.getAttribute('data-placeholder') === 'false';
  /* eslint-enable */
  const targetElement = withoutPlaceholder ? target : target.nextSibling;

  if (targetElement) {
    target.addEventListener('load', () => {
      if (!target) return;

      applyStyle(targetElement, withoutPlaceholder);
      target.removeEventListener('load', applyStyle);
    });
  }
  window.__REACT_SIMPLE_IMG__.imgLoadingRefs.delete(target);
}
