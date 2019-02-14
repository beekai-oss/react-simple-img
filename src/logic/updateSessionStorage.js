// @flow

export default function updateSessionStorage(src) {
  const cachedImages = JSON.parse(window.sessionStorage.getItem('__REACT_SIMPLE_IMG__')) || {};
  cachedImages[src] = +new Date();
  window.sessionStorage.setItem('__REACT_SIMPLE_IMG__', JSON.stringify(cachedImages));
}
