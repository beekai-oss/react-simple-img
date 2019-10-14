// @flow
import logError from '../utils/logError';

export default function updateSessionStorage(src: string) {
  try {
    const cachedImages = JSON.parse(window.sessionStorage.getItem('__REACT_SIMPLE_IMG__')) || {};
    cachedImages[src] = +new Date();
    window.sessionStorage.setItem('__REACT_SIMPLE_IMG__', JSON.stringify(cachedImages));
  } catch (e) {
    logError(`Error marking image as cached ${e}`);
  }
}
