import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import withLazyLoadImages from '../src/withLazyLoadImages';

const TestComponent = () => <div>Test</div>;
const IntersectionObserverSpy = jest.fn();
const observeSpy = jest.fn();
const unobserveSpy = jest.fn();
let IntersectionObserver;
let Component;
let tree;

describe('withLazyLoadImages', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    IntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = IntersectionObserverSpy;
    global.IntersectionObserver.prototype.observe = observeSpy;
    global.IntersectionObserver.prototype.unobserve = unobserveSpy;
    Component = withLazyLoadImages(TestComponent);
    tree = shallow(<Component />);
  });

  afterEach(() => {
    global.IntersectionObserver = IntersectionObserver;
  });

  it('should render correctly', () => {
    tree = renderer.create(<Component />);
    expect(tree).toMatchSnapshot();
  });

  it('should initialise IntersectionObserver and observe each images', () => {
    expect(IntersectionObserverSpy).toHaveBeenCalled();
  });

  it('should append image into images', () => {
    tree.instance().appendImageRef('image');
    tree.instance().observer = null;
    tree.update();

    expect(tree.state('willMountImages')).toEqual(['image']);
    expect(observeSpy).toHaveBeenCalled();
  });

  it('should remove image from will mount images and update state', () => {
    tree.setState({
      willMountImages: ['image', 'image1'],
    });
    tree.instance().removeImageRef('image');
    expect(tree.state('willMountImages')).toEqual(['image1']);
  });

  describe('when all will mount images removed', () => {
    it('should remove image and reset mounted images', () => {
      tree.setState({
        willMountImages: ['image'],
        mountedImages: ['image1'],
      });
      tree.instance().removeImageRef('image');
      expect(tree.state('willMountImages')).toEqual([]);
      expect(tree.state('mountedImages')).toEqual([]);
    });
  });

  it('should start loading images when observe image about to appear', () => {
    const preloadImageSpy = jest.fn();
    const target = 'target';
    tree.instance().preloadImage = preloadImageSpy;
    tree.instance().onIntersection([
      {
        intersectionRatio: 1,
        target,
      },
    ]);
    tree.update();

    expect(preloadImageSpy.mock.calls[0][0]).toBe(target);
  });

  it('should not loading images when observe image is not about to appear', () => {
    const preloadImageSpy = jest.fn();
    const target = 'target';
    tree.instance().preloadImage = preloadImageSpy;
    tree.instance().onIntersection([
      {
        intersectionRatio: 0,
        target,
      },
    ]);
    tree.update();

    expect(preloadImageSpy).not.toHaveBeenCalled();
  });

  describe('when preloadImage called', () => {
    it('should catch error failed', async () => {
      try {
        await tree.instance().preloadImage({});
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    it('should fetch the image and apply src to original image', async () => {
      const target = { dataset: { src: 'test' } };
      const fetchImageSpy = jest.fn();
      const applyImageSpy = jest.fn();
      tree.instance().fetchImage = fetchImageSpy;
      tree.instance().applyImage = applyImageSpy;
      tree.update();
      await tree.instance().preloadImage(target);

      expect(unobserveSpy).toHaveBeenCalled();
      expect(fetchImageSpy).toHaveBeenCalled();
      expect(applyImageSpy).toHaveBeenCalled();
      expect(unobserveSpy.mock.calls[0][0]).toBe(target);
      expect(applyImageSpy.mock.calls[0][0]).toBe(target);
    });
  });

  it('should update mount images state when applyImage is called', () => {
    tree.instance().applyImage('target');
    expect(tree.state('mountedImages')).toEqual(['target']);
  });
});
