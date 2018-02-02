import imageLoader, { applyImage } from '../../src/utils/imageLoader';
jest.mock('../../src/utils/fetchImage', () => () => new Promise(resolve => resolve('test')));

describe('imageLoader', () => {
  it('should catch error failed', async () => {
    try {
      await imageLoader({});
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });

  describe('when context is provided', () => {
    it('should fetch the image and apply src to original image', async () => {
      const unobserveSpy = jest.fn();
      const setStateSpy = jest.fn();
      const appendImgLoadingRefSpy = jest.fn();
      const removeImgLoadingRefSpy = jest.fn();
      const target = { dataset: { src: 'test' } };
      await imageLoader.call(
        {
          observer: {
            unobserve: unobserveSpy,
          },
          setState: setStateSpy,
          appendImgLoadingRef: appendImgLoadingRefSpy,
          removeImgLoadingRef: removeImgLoadingRefSpy,
        },
        target,
      );

      expect(unobserveSpy).toHaveBeenCalled();
      expect(setStateSpy).toHaveBeenCalled();
      expect(appendImgLoadingRefSpy).toHaveBeenCalled();
      expect(removeImgLoadingRefSpy).toHaveBeenCalled();
    });

    it('should fetch the image and apply src to original image', async () => {
      const setAttributeSpy = jest.fn();
      const getAttributeSpy = jest.fn();
      window.__REACT_SIMPLE_IMG__ = {
        observer: {
          unobserve: () => {},
        },
        imgLoadingRefs: {
          set: () => {},
          delete: () => {},
        },
      };
      const target = {
        dataset: {
          src: 'test',
        },
        style: { visibility: '' },
        nextSibling: { setAttribute: setAttributeSpy, getAttribute: getAttributeSpy },
      };
      await imageLoader.call(undefined, target);
      expect(target).toMatchSnapshot();
      expect(setAttributeSpy.mock.calls[0]).toMatchSnapshot();
      expect(getAttributeSpy.mock.calls[0]).toMatchSnapshot();
    });
  });

  it('should return false when target is not exist', () => {
    expect(
      applyImage(
        undefined,
        'loadedImg',
      ),
    ).toBeFalsy();
  });

  it('should update mount images state when applyImage is called', () => {
    const setAttributeSpy = jest.fn();
    const getAttributeSpy = jest.fn();
    const deleteSpy = jest.fn();
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        unobserve: () => {},
      },
      imgLoadingRefs: {
        set: () => {},
        delete: deleteSpy,
      },
    };
    expect(
      applyImage(
        {
          src: 'test',
          dataset: {
            srcset: 'srcset',
          },
          srcset: 'srcset',
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
    expect(deleteSpy).toHaveBeenCalled();

    window.__REACT_SIMPLE_IMG__ = undefined;
  });
});
