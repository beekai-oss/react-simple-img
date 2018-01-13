import init, { onIntersection } from '../src/init';
jest.mock('../src/utils/imageLoader');

const imageLoader = require('../src/utils/imageLoader').default;
const imageLoaderSpy = jest.fn();
imageLoader.mockImplementation(imageLoaderSpy);

const IntersectionObserver = window.IntersectionObserver;

describe('init', () => {
  afterEach(() => {
    window.IntersectionObserver = IntersectionObserver;
    window.reactSimpleImgObserver = undefined;
  });

  it('should return observer and set window object when context is not passed', () => {
    const IntersectionObserverSpy = jest.fn();
    window.IntersectionObserver = IntersectionObserverSpy;

    expect(init({})).toEqual({});
    expect(IntersectionObserverSpy).toHaveBeenCalled();
    expect(window.reactSimpleImgObserver).toEqual({});
  });

  it('should return observer when context is passed', () => {
    const IntersectionObserverSpy = jest.fn();
    window.IntersectionObserver = IntersectionObserverSpy;

    expect(init.call({}, {})).toEqual({});
    expect(IntersectionObserverSpy).toHaveBeenCalled();
    expect(window.reactSimpleImgObserver).toBe(undefined);
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
