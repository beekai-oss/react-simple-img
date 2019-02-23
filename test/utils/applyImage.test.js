import applyImage, { applyStyle } from '../../src/logic/applyImage';

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

describe('applyStyle', () => {
  it('should get target style to opaicty 1', () => {
    const setAttribute = jest.fn();
    const target = {
      getAttribute: () => 'display: none;',
      setAttribute,
    };
    applyStyle(target, 'display: block', true);
    expect(setAttribute).toBeCalledWith('style', 'display: none;opacity: 1;');
  });
});
