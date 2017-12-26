import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import withLazyLoadImages from '../lazyLoadImages/withLazyLoadImages';

const TestComponent = () => <div>Test</div>;
const IntersectionObserverSpy = jest.fn();
let IntersectionObserver;

describe('withLazyLoadImages', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    IntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = IntersectionObserverSpy;
  });

  afterEach(() => {
    global.IntersectionObserver = IntersectionObserver;
  });

  it('should render correctly', () => {
    const Component = withLazyLoadImages(TestComponent);
    const tree = renderer.create(<Component />);
    expect(tree).toMatchSnapshot();
  });

  it('should initialise IntersectionObserver and observe each images', () => {
    const Component = withLazyLoadImages(TestComponent);

    mount(<Component />);

    expect(IntersectionObserverSpy).toHaveBeenCalled();
  });

  it('should append image into images', () => {
    const Component = withLazyLoadImages(TestComponent);
    const tree = mount(<Component />);
    tree.instance().appendImageRef('image');
    tree.update();

    expect(tree.instance().images).toEqual(['image']);
  });

  it('should remove image from images', () => {
    const Component = withLazyLoadImages(TestComponent);
    const tree = mount(<Component />);
    tree.instance().removeImageRef('image');
  });
});