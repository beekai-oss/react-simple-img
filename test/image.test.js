import renderer from 'react-test-renderer';
import Image from '../src/image';
import { shallow, mount } from 'enzyme';
import { APPEND_IMAGE_REF, IMAGES_LOADED, REMOVE_IMAGE_REF } from '../src/withLazyLoadImages';
import React from 'react';

jest.mock('react-simple-animate', () => 'Animate');

const props = {
  src: 'src',
  placeHolderSrc: 'placeHolderSrc',
  className: 'className',
  width: 100,
  height: 1000,
  alt: 'alt',
  srcSet: 'srcSet',
  placeHolderBackgroundColor: 'red',
  animateDisappearInSecond: 1,
  animateDisappearStyle: { opacity: 0 },
};
const appendImage = jest.fn();
const imageLoaded = jest.fn();
const removeImage = jest.fn();
const context = {
  [APPEND_IMAGE_REF]: appendImage,
  [IMAGES_LOADED]: imageLoaded,
  [REMOVE_IMAGE_REF]: removeImage,
};

describe('Image', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const tree = renderer.create(<Image {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render only span when place holder src is not supplied', () => {
    const { placeHolderSrc, ...omitProps } = props;
    const tree = renderer.create(<Image {...omitProps} />);
    expect(tree).toMatchSnapshot();
  });

  it('should append image ref when image mounted', () => {
    mount(<Image {...props} />, { context });
    expect(appendImage).toHaveBeenCalled();
  });

  describe('when first time image is loaded', () => {
    it('should set state as loaded and remove the image from the stack', () => {
      const tree = shallow(<Image {...props} />, { context: { ...context, [IMAGES_LOADED]: ['test'] } });
      tree.instance().element = 'test';
      tree.setProps({});
      expect(tree.state('loaded')).toBeTruthy();
      expect(removeImage).toHaveBeenCalled();
      expect(removeImage.mock.calls[0][0]).toBe('test');
    });
  });
});
