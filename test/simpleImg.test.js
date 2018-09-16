import renderer from 'react-test-renderer';
import { SimpleImg } from '../src/simpleImg';
import { shallow, mount } from 'enzyme';
import React from 'react';

jest.mock('react-simple-animate', () => ({ Animate: 'Animate' }));

const appendImageRef = jest.fn();
const removeImageRef = jest.fn();
const removeImgLoadingRef = jest.fn();

const props = {
  src: 'src',
  imgClassName: 'img className',
  wrapperClassName: 'wrapper className',
  width: 100,
  height: 1000,
  alt: 'alt',
  sizes: 'sizes',
  srcSet: 'srcSet',
  animationDuration: 1,
  animationEndStyle: { opacity: 0 },
  useContext: true,
  appendImageRef,
  removeImageRef,
  removeImgLoadingRef,
  mountedImages: new Set([1, 2, 3]),
};
const addEventListener = window.addEventListener;

describe('SimpleImg', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.addEventListener = jest.fn();
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        observe: jest.fn(),
      },
    };
  });

  afterEach(() => {
    window.addEventListener = addEventListener;
    window.__REACT_SIMPLE_IMG__ = undefined;
  });

  it('should render correctly', () => {
    const tree = renderer.create(<SimpleImg {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render background color', () => {
    const tree = renderer.create(<SimpleImg {...{ ...props, placeholder: 'red' }} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render out placeholder as image', () => {
    const tree = renderer.create(<SimpleImg {...{ ...props, placeholder: '/test/image.jpg' }} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render out as image data', () => {
    const tree = renderer.create(<SimpleImg {...{ ...props, placeholder: 'data:image//test' }} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render only span when place holder src is not supplied', () => {
    const { placeholder, ...omitProps } = props;
    const tree = renderer.create(<SimpleImg {...omitProps} />);
    expect(tree).toMatchSnapshot();
  });

  it('should append image ref when image mounted', () => {
    const tree = mount(<SimpleImg {...props} />);
    const instance = tree.instance();
    instance.element = {
      current: 1,
    };
    tree.setProps({
      isContextDocumentLoad: true,
    });
    expect(appendImageRef).toHaveBeenCalled();
    expect(removeImgLoadingRef).toHaveBeenCalled();
  });

  it('should remove item from observer when component removed', () => {
    const tree = shallow(<SimpleImg {...props} />);
    tree.instance().element.current = {};
    tree.unmount();
    expect(removeImageRef).toHaveBeenCalled();
  });

  it('should remove window object reference when component removed', () => {
    const unobserveSpy = jest.fn();
    const hasSpy = jest.fn();
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        observe: () => {},
        unobserve: unobserveSpy,
      },
      imgLoadingRefs: {
        set: () => {},
        delete: () => {},
        has: hasSpy,
      },
    };
    const tree = shallow(<SimpleImg {...{ ...props, useContext: false }} />);
    tree.setState({
      useContext: false,
    });
    tree.instance().element = {
      current: 'test',
    };
    tree.unmount();
    expect(unobserveSpy).toHaveBeenCalled();
    expect(hasSpy.mock.calls[0][0]).toEqual('test');

    window.__REACT_SIMPLE_IMG__ = undefined;
  });
});
