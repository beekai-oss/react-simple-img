import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import SimpleImgWithProvider, { SimpleImg } from '../src/simpleImg';
import SimpleImgProvider from "./simpleImgProvider.test";

const appendImageRef = jest.fn();
const removeImageRef = jest.fn();
const removeImgLoadingRef = jest.fn();

const props = {
  src: 'src',
  imgClassName: 'img className',
  wrapperClassName: 'wrapper className',
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
const removeEventListener = window.removeEventListener;

describe('SimpleImg', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        observe: jest.fn(),
      },
    };
  });

  afterEach(() => {
    window.addEventListener = addEventListener;
    window.removeEventListener = removeEventListener;
    window.__REACT_SIMPLE_IMG__ = undefined;
  });

  it('should render correctly with context consumer', () => {
    const tree = renderer.create(<SimpleImgWithProvider {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<SimpleImg {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render out cached img', () => {
    const tree = shallow(<SimpleImg {...props} />);
    tree.setState({
      isCached: true,
    });
    expect(tree).toMatchSnapshot();
  });

  it('should apply aspect ratio when height and width is supplied', () => {
    const tree = renderer.create(<SimpleImg {...{ ...props, applyAspectRatio: true }} />);
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

  it('should update isDocumentLoad state', () => {
    const tree = shallow(<SimpleImg {...props} />);
    tree.instance().setDocumentLoaded();
    expect(tree.state('isDocumentLoad')).toBeTruthy();
  });

  it('should remove image refs on componentWillUnmount', () => {
    const deleteSpy = jest.fn();
    const getSpy = jest.fn();

    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        observe: () => {},
        unobserve: () => {},
      },
      imgLoadingRefs: {
        set: () => {},
        delete: deleteSpy,
        get: getSpy,
        has: () => true,
      },
    };

    const tree = shallow(<SimpleImg {...{ ...props, useContext: false }} />);
    const instance = tree.instance();
    getSpy.mockReturnValueOnce({
      src: 'test',
    });
    instance.element = {
      current: 1,
    };
    instance.componentWillUnmount();

    expect(getSpy).toBeCalled();
    expect(deleteSpy).toBeCalled();
  });

  it('should remove image ref when component update and finished loaded with context', () => {
    const removeImageRefSpy = jest.fn();
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        observe: () => {},
      },
    };

    const tree = shallow(
      <SimpleImg {...{ ...props, mountedImages: new Set([1]), removeImageRef: removeImageRefSpy, useContext: true }} />,
    );
    const instance = tree.instance();
    instance.element = {
      current: 1,
    };

    tree.setState({
      isDocumentLoad: true,
    });

    expect(removeImageRefSpy).toBeCalled();
  });

  it('should remove image ref when component update and finished loaded with context', () => {
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        observe: () => {},
      },
    };

    const tree = shallow(<SimpleImg {...{ ...props, mountedImages: new Set([1]), useContext: false }} />);
    const instance = tree.instance();
    instance.element = {
      current: 1,
    };

    tree.setProps({
      src: 'test',
    });

    expect(tree.state('loaded')).toBeTruthy();
  });

  it('should set document loaded ready when document is on ready state', () => {
    window.__REACT_SIMPLE_IMG__ = undefined;
    const tree = shallow(<SimpleImg {...{ ...props, mountedImages: new Set([1]), useContext: false }} />);

    expect(tree.state('isDocumentLoad')).toBeTruthy();
  });
});
