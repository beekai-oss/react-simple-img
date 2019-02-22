import imageLoader from '../../src/logic/imageLoader';
import fetchImage from '../../src/logic/fetchImage';
import applyImage from '../../src/logic/applyImage';

jest.mock('../../src/logic/setImageHeight');
jest.mock('../../src/logic/updateSessionStorage');
jest.mock('../../src/utils/fetchImage');
jest.mock('../../src/utils/applyImage');
jest.mock('../../src/utils/logError');
jest.mock('../../src/logic/filterSrcset', () => () => true);

describe('imageLoader', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should catch error failed', async () => {
    try {
      await imageLoader({});
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });

  describe('when context is provided', () => {
    window.addEventListener('load', done => {
      it('should call api remove and add images', async () => {
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

      done();
    });
  });

  it('should call applyImage when image resolved', async () => {
    fetchImage.mockReturnValueOnce(new Promise(resolve => resolve('test')));
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        unobserve: () => {},
      },
      imgLoadingRefs: {
        set: () => {},
        delete: () => {},
      },
    };
    await imageLoader({});
    expect(fetchImage).toHaveBeenCalled();
    expect(applyImage).toHaveBeenCalled();
  });

  it('should report error when image fetch failed', async () => {
    fetchImage.mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error('test'));
      }),
    );
    window.__REACT_SIMPLE_IMG__ = {
      observer: {
        unobserve: () => {},
      },
      imgLoadingRefs: {
        set: () => {},
        delete: () => {},
      },
    };
    await imageLoader({});
    expect(fetchImage).toHaveBeenCalled();
    expect(applyImage).not.toHaveBeenCalled();
  });
});
