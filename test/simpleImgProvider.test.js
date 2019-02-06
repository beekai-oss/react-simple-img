import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import SimpleImgProvider from '../src/simpleImgProvider';

const IntersectionObserverSpy = jest.fn();
const observeSpy = jest.fn();
const unobserveSpy = jest.fn();
let IntersectionObserver;

describe('SimpleImgProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    IntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = IntersectionObserverSpy;
    global.IntersectionObserver.prototype.observe = observeSpy;
    global.IntersectionObserver.prototype.unobserve = unobserveSpy;
  });

  afterEach(() => {
    global.IntersectionObserver = IntersectionObserver;
  });

  it('should render correctly', () => {
    const tree = renderer.create(
      <SimpleImgProvider>
        <div>test</div>
      </SimpleImgProvider>,
    );
    expect(tree).toMatchSnapshot();
  });

  describe('when window load event triggered', () => {
    it('should initialise IntersectionObserver and observe each images', () => {
      mount(<SimpleImgProvider>test</SimpleImgProvider>);
      expect(IntersectionObserverSpy).toHaveBeenCalled();
    });

    it('should remove image from will mount images and update state', () => {
      const tree = mount(<SimpleImgProvider>test</SimpleImgProvider>);
      tree.setState({
        mountedImages: new Set(['image', 'image1']),
      });
      tree.instance().removeImageRef('image');
      expect(tree.state('mountedImages')).toEqual(new Set(['image1']));
    });

    it('should remove image from will mount images and update state', () => {
      const tree = mount(<SimpleImgProvider>test</SimpleImgProvider>);
      tree.setState({
        mountedImages: new Set(['image', 'image1']),
      });
      tree.instance().removeImageRef('image');
      expect(tree.state('mountedImages')).toEqual(new Set(['image1']));
    });

    describe('when all will mount images removed', () => {
      const tree = mount(<SimpleImgProvider>test</SimpleImgProvider>);
      it('should remove image and reset mounted images', () => {
        tree.setState({
          mountedImages: new Set(['image1']),
        });
        tree.instance().removeImageRef('image1');
        expect(tree.state('mountedImages')).toEqual(new Set());
      });
    });
  });

  it('should clear all images ref when component unmount', () => {
    const tree = shallow(<SimpleImgProvider />);
    const instance = tree.instance();
    instance.imageLoadRefs = [{ src: 'test' }];
    instance.componentWillUnmount();
    expect(instance.imageLoadRefs).toEqual([{ src: '' }]);
  });

  it('should should start the observer when app loaded', () => {
    Object.defineProperty(document, 'readyState', {
      get() {
        return 'loading';
      },
    });
    const map = {};
    window.addEventListener = jest.fn((event, callback) => {
      map[event] = callback;
    });
    const tree = shallow(<SimpleImgProvider />);
    map.load();

    expect(tree.state('isContextDocumentLoad')).toBeTruthy();
  });

  it('should start observe images when observer is ready', () => {
    const tree = shallow(<SimpleImgProvider />);
    const observe = jest.fn();

    const instance = tree.instance();

    instance.observer = {
      observe,
    };

    instance.appendImageRef('test');

    expect(observe).toBeCalledWith('test');
  });

  it('should add image ref into imageLoadRefs', () => {
    const tree = shallow(<SimpleImgProvider />);
    const instance = tree.instance();

    instance.imageLoadRefs = new Set();
    instance.appendImgLoadingRef('test');
    expect(instance.imageLoadRefs).toEqual(new Set(['test']));
  });

  it('should add image ref into imageLoadRefs', () => {
    const tree = shallow(<SimpleImgProvider />);
    const instance = tree.instance();

    instance.imageLoadRefs = new Set(['test']);
    instance.removeImgLoadingRef('test');
    expect(instance.imageLoadRefs).toEqual(new Set());
  });
});
