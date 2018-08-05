import renderer from 'react-test-renderer';
import SimpleImg from '../src/simpleImg';
import { shallow, mount } from 'enzyme';
import { APPEND_IMAGE_REF, IMAGES_LOADED, REMOVE_IMAGE_REF, DOCUMENT_LOADED } from '../src/simpleImgProvider';
import React from 'react';

jest.mock('react-simple-animate', () => 'Animate');

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
};
const appendImage = jest.fn();
const imageLoaded = jest.fn();
const removeImage = jest.fn();
const context = {
  [APPEND_IMAGE_REF]: appendImage,
  [IMAGES_LOADED]: imageLoaded,
  [REMOVE_IMAGE_REF]: removeImage,
  [DOCUMENT_LOADED]: true,
};

describe('SimpleImg', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
    const tree = mount(<SimpleImg {...props} />, { context });
    tree.setState({
      isDocumentLoad: true,
    });
    expect(appendImage).toHaveBeenCalled();
  });

  describe('when first time image is loaded', () => {
    it('should set state as loaded and remove the image from the stack', () => {
      const tree = shallow(<SimpleImg {...props} />, { context: { ...context, [IMAGES_LOADED]: new Set(['test']) } });
      tree.instance().element = 'test';
      tree.setProps({});
      expect(tree.state('loaded')).toBeTruthy();
      expect(removeImage).toHaveBeenCalled();
      expect(removeImage.mock.calls[0][0]).toBe('test');
    });
  });

  it('should remove item from observer when component removed', () => {
    const tree = shallow(<SimpleImg {...props} />, { context: { ...context } });
    tree.setState({
      useContext: true,
    });
    tree.instance().element = {};
    tree.unmount();
    expect(removeImage).toHaveBeenCalled();
  });

  it('should remove window object reference when component removed', () => {
    const unobserveSpy = jest.fn();
    const hasSpy = jest.fn();
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        unobserve: unobserveSpy,
      },
      imgLoadingRefs: {
        set: () => {},
        delete: () => {},
        has: hasSpy,
      },
    };
    const tree = shallow(<SimpleImg {...props} />, { context: { ...context } });
    tree.setState({
      useContext: false,
    });
    tree.instance().element = 'test';
    tree.unmount();
    expect(unobserveSpy).toHaveBeenCalled();
    expect(hasSpy.mock.calls[0][0]).toEqual('test');

    window.__REACT_SIMPLE_IMG__ = undefined;
  });
});
