import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import SimpleImg from '../src/simpleImg';
import imageLoader from '../src/logic/imageLoader';
import initSimpleImg from '../src/initSimpleImg';
import logError from '../src/utils/logError';

jest.mock('../src/logic/imageLoader');
jest.mock('../src/initSimpleImg');
jest.mock('../src/utils/logError');

const props = {
  src: 'src',
  className: 'className',
  alt: 'alt',
  sizes: 'sizes',
  srcSet: 'srcSet',
  animationDuration: 1,
};
const addEventListener = window.addEventListener;
const removeEventListener = window.removeEventListener;

describe('SimpleImg', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    window.__REACT_SIMPLE_IMG__ = {
      callBackRefs: new Map(),
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

  it('should render correctly', () => {
    const tree = renderer.create(<SimpleImg {...props} />);
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

  it('should render correctly when placeholder set to false', () => {
    const tree = renderer.create(<SimpleImg {...{ ...props, placeholder: false }} />);
    expect(tree).toMatchSnapshot();
  });

  it('should remove window object reference when component removed', () => {
    const unobserveSpy = jest.fn();
    const hasSpy = jest.fn();
    window.__REACT_SIMPLE_IMG__ = {
      callBackRefs: new Map(),
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
      callBackRefs: new Map(),
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

  it('should set state to be is cached when image ref is stored in sessionStorage', () => {
    window.sessionStorage.setItem('__REACT_SIMPLE_IMG__', JSON.stringify({ src: 'test' }));
    window.__REACT_SIMPLE_IMG__ = {
      callBackRefs: new Map(),
      disableAnimateCachedImg: true,
      observer: {
        observe: () => {},
      },
    };
    const tree = mount(<SimpleImg {...props} />);
    expect(tree.state('isCached')).toBeTruthy();
  });

  describe('when importance set as auto', () => {
    it('should start loading image right after load event', () => {
      mount(<SimpleImg {...{ ...props, importance: 'auto' }} />);
      expect(imageLoader).toBeCalled();
    });
  });

  describe('when component mount', () => {
    it('should call initSimpleImg if window.__REACT_SIMPLE_IMG__ is not defined', () => {
      window.__REACT_SIMPLE_IMG__ = undefined;
      initSimpleImg.mockImplementation(() => {
        window.__REACT_SIMPLE_IMG__ = {
          observer: {
            observe: () => {},
            unobserve: () => {},
          },
        };
      });
      shallow(<SimpleImg {...props} />);
      expect(initSimpleImg).toBeCalled();
    });
  });

  describe('when parse error happens', () => {
    it('should call log error', () => {
      window.__REACT_SIMPLE_IMG__ = {
        disableAnimateCachedImg: true,
        observer: {
          observe: () => {},
          unobserve: () => {},
        },
      };
      window.sessionStorage.setItem('__REACT_SIMPLE_IMG__', undefined);
      const tree = mount(<SimpleImg {...props} />);
      const instance = tree.instance();

      instance.element.current = {
        getAttribute: () => {},
      };
      instance.componentDidMount();
      expect(logError).toBeCalled();
    });
  });
});
