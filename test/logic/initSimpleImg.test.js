import initSimpleImg from '../../src/initSimpleImg';
import observerStart, { defaultConfig } from '../../src/logic/observerStart';

jest.mock('../../src/logic/observerStart');

describe('initSimpleImg', () => {
  it('should start the observer', () => {
    initSimpleImg();
    expect(observerStart).toBeCalledWith(defaultConfig, false, false);
  });
});
