// @flow

function applyStyle(target, endStyle, withoutPlaceholder) {
  if (withoutPlaceholder) {
    target.style.opacity = 1; // eslint-disable-line
  } else {
    const style = target.getAttribute('style');
    target.setAttribute('style', `${style && style.includes('opacity') ? '' : 'opacity: 0;'}${style}${endStyle}`);
  }
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
        const endStyle = target.getAttribute('data-end-style') || '';
        applyStyle(currentTarget, endStyle, withoutPlaceholder);
        target.removeEventListener('load', applyStyle);
      }
    });
  }
  window.__REACT_SIMPLE_IMG__.imgLoadingRefs.delete(target);
}
