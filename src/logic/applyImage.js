// @flow

export function applyStyle(target, withoutPlaceholder): void {
  const style = target.getAttribute('style');

  target.setAttribute(
    'style',
    `${style}${style && style.includes('opacity') ? '' : `opacity: ${withoutPlaceholder ? 1 : 0};`}`,
  );
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
        target.removeEventListener('load', applyStyle);
      }
    });
  }
  window.__REACT_SIMPLE_IMG__.imgLoadingRefs.delete(target);
}
