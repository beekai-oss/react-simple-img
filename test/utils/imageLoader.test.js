import imageLoader from '../../src/logic/imageLoader';
import fetchImage from '../../src/logic/fetchImage';
import applyImage from '../../src/logic/applyImage';
import setImageHeight from '../../src/utils/setImageHeight';
import logError from '../../src/utils/logError';
import filterImgSrc from '../../src/utils/filterSrcset';
import updateSessionStorage from '../../src/logic/updateSessionStorage';

jest.mock('../../src/utils/filterSrcset');
jest.mock('../../src/utils/logError');
jest.mock('../../src/utils/setImageHeight');
jest.mock('../../src/logic/updateSessionStorage');
jest.mock('../../src/logic/fetchImage');
jest.mock('../../src/logic/applyImage');
jest.mock('../../src/utils/logError');

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

  it('should call applyImage when image resolved', async () => {
    filterImgSrc.mockReturnValueOnce(true);
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
    filterImgSrc.mockReturnValueOnce(true);
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

  describe('when target node is defined and height is set to 1px', () => {
    it('should trigger setImageHeight', async () => {
      filterImgSrc.mockReturnValueOnce(true);
      imageLoader({
        parentNode: {
          style: {
            height: '1px',
          },
        },
      });
      expect(setImageHeight).toBeCalled();
    });
  });

  describe('when image src return as empty', () => {
    it('should break the function and log error', () => {
      filterImgSrc.mockReturnValueOnce(false);
      expect(imageLoader({})).toBeUndefined();
      expect(logError).toBeCalled();
    });
  });

  describe('when set disableAnimationCachedImg to true', () => {
    it('should updateSessionStorage after loaded', async () => {
      filterImgSrc.mockReturnValueOnce(true);
      fetchImage.mockReturnValueOnce(new Promise(resolve => resolve('test')));
      window.__REACT_SIMPLE_IMG__ = {
        disableAnimateCachedImg: true,
        observer: {
          unobserve: () => {},
        },
        imgLoadingRefs: {
          set: () => {},
          delete: () => {},
        },
      };
      await imageLoader({});
      expect(updateSessionStorage).toHaveBeenCalled();
    });
  });
});
