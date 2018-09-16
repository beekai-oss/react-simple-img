import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import SimpleImgProvider from '../src/simpleImgProvider';

const IntersectionObserverSpy = jest.fn();
const observeSpy = jest.fn();
const unobserveSpy = jest.fn();
let IntersectionObserver;
let tree;

describe('SimpleImgProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    IntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = IntersectionObserverSpy;
    global.IntersectionObserver.prototype.observe = observeSpy;
    global.IntersectionObserver.prototype.unobserve = unobserveSpy;
    tree = mount(<SimpleImgProvider>test</SimpleImgProvider>);
  });

  afterEach(() => {
    global.IntersectionObserver = IntersectionObserver;
  });

  it('should render correctly', () => {
    tree = renderer.create(
      <SimpleImgProvider>
        <div>test</div>
      </SimpleImgProvider>,
    );
    expect(tree).toMatchSnapshot();
  });

  describe('when window load event triggered', () => {
    it('should initialise IntersectionObserver and observe each images', () => {
      expect(IntersectionObserverSpy).toHaveBeenCalled();
    });

    it('should remove image from will mount images and update state', () => {
      tree.setState({
        mountedImages: new Set(['image', 'image1']),
      });
      tree.instance().removeImageRef('image');
      expect(tree.state('mountedImages')).toEqual(new Set(['image1']));
    });

    it('should remove image from will mount images and update state', () => {
      tree.setState({
        mountedImages: new Set(['image', 'image1']),
      });
      tree.instance().removeImageRef('image');
      expect(tree.state('mountedImages')).toEqual(new Set(['image1']));
    });

    describe('when all will mount images removed', () => {
      it('should remove image and reset mounted images', () => {
        tree.setState({
          mountedImages: new Set(['image1']),
        });
        tree.instance().removeImageRef('image1');
        expect(tree.state('mountedImages')).toEqual(new Set());
      });
    });
  });
});
