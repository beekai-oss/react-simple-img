import { observerStart, onIntersection } from '../src/initSimpleImg';
jest.mock('../src/utils/imageLoader');

const imageLoader = require('../src/utils/imageLoader').default;
const imageLoaderSpy = jest.fn();
imageLoader.mockImplementation(imageLoaderSpy);

const IntersectionObserver = window.IntersectionObserver;

describe('intersectionStart', () => {
  afterEach(() => {
    window.IntersectionObserver = IntersectionObserver;
    window.__REACT_SIMPLE_IMG__ = undefined;
  });

  it('should return observer and set window object when context is not passed', () => {
    const IntersectionObserverSpy = jest.fn();
    window.IntersectionObserver = IntersectionObserverSpy;

    expect(observerStart({})).toEqual(undefined);
    expect(IntersectionObserverSpy).toHaveBeenCalled();
    expect(window.__REACT_SIMPLE_IMG__).toEqual({
      observer: {},
      imgLoadingRefs: new Map(),
    });
  });

  it('should return observer when context is passed', () => {
    const IntersectionObserverSpy = jest.fn();
    window.IntersectionObserver = IntersectionObserverSpy;

    expect(observerStart.call({}, {})).toEqual({});
    expect(IntersectionObserverSpy).toHaveBeenCalled();
    expect(window.__REACT_SIMPLE_IMG__).toBe(undefined);
  });
});

describe('onIntersection', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call image loader when image hit intersectionRatio ratio', () => {
    const entries = [
      { intersectionRatio: 1, target: null },
    ];
    onIntersection(entries);
    expect(imageLoaderSpy).toHaveBeenCalled();
  });

  it('should not call image loader when image not intersected yet', () => {
    const entries = [
      { intersectionRatio: 0, target: null },
    ];
    onIntersection(entries);
    expect(imageLoaderSpy).not.toHaveBeenCalled();
  });
});
