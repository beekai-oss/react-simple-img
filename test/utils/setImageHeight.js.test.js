import setImageHeight from '../../src/utils/setImageHeight';

describe('setImageHeight', () => {
  it('should render correctly', () => {
    const image = {};
    const map = {};
    image.addEventListener = jest.fn((event, callback) => {
      map[event] = callback;
    });
    const target = {
      parentNode: {
        style: {},
      },
    };
    setImageHeight(image, target);
    map.load({
      target: {
        height: 20,
      },
    });
    expect(target).toEqual({ parentNode: { style: { height: '20px', visibility: 'visible' } } });
  });
});
