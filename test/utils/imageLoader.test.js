import imageLoader, { applyImage } from '../../src/utils/imageLoader';
jest.mock('../../src/utils/fetchImage', () => () => new Promise(resolve => resolve('test')));

describe('imageLoader', () => {
  describe('when preloadImage called', () => {
    it('should catch error failed', async () => {
      try {
        await imageLoader({});
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });

    it.skip('should fetch the image and apply src to original image', async () => {
      const unobserveSpy = jest.fn();
      const setStateSpy = jest.fn();
      const target = { dataset: { src: 'test' } };
      await imageLoader.call(
        {
          observer: {
            unobserve: unobserveSpy,
          },
          setState: setStateSpy,
        },
        target,
      );

      expect(unobserveSpy).toHaveBeenCalled();
      expect(setStateSpy).toHaveBeenCalled();
    });
  });

  it.skip('should update mount images state when applyImage is called', () => {
    const setAttributeSpy = jest.fn();
    const getAttributeSpy = jest.fn();
    expect(
      applyImage(
        {
          src: 'test',
          style: {
            visibility: 'hidden',
          },
          nextSibling: {
            setAttribute: setAttributeSpy,
            getAttribute: getAttributeSpy,
          },
        },
        'loadedImg',
      ),
    ).toMatchSnapshot();
    expect(getAttributeSpy).toHaveBeenCalled();
    expect(setAttributeSpy).toHaveBeenCalled();
  });
});
