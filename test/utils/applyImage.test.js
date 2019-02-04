import applyImage from '../../src/utils/applyImage';

describe('applyImage', () => {
  it('should return false when target is not exist', () => {
    expect(applyImage(undefined, 'loadedImg')).toBeFalsy();
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
