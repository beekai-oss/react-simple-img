import updateSessionStorage from '../../src/logic/updateSessionStorage';

describe('updateSessionStorage', () => {
  it('should update session storage', () => {
    updateSessionStorage('test');
    expect(Object.keys(JSON.parse(window.sessionStorage.getItem('__REACT_SIMPLE_IMG__')))).toMatchSnapshot();
  });
});
