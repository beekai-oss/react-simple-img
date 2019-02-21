import applyImage from '../../src/utils/applyImage';

describe('applyImage', () => {
  it('should update mount images state when applyImage is called', () => {
    const setAttributeSpy = jest.fn();
    const getAttributeSpy = jest.fn();
    const addEventListener = jest.fn();
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
          addEventListener,
          src: 'test',
          dataset: {
            srcset: 'srcset',
          },
          srcset: 'srcset',
          style: {
            visibility: 'hidden',
          },
          getAttribute: getAttributeSpy,
          nextSibling: {
            setAttribute: setAttributeSpy,
          },
        },
        'loadedImg',
      ),
    ).toMatchSnapshot();
    expect(getAttributeSpy).toHaveBeenCalled();
    expect(addEventListener).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();

    window.__REACT_SIMPLE_IMG__ = undefined;
  });
});
