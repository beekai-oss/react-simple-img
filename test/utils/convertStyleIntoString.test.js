import convertStyleIntoString from '../../src/utils/convertStyleIntoString';

describe('convertStyleIntoString', () => {
  it('should convert object into string', () => {
    expect(
      convertStyleIntoString({
        opacity: 0,
        display: 'block',
      }),
    ).toEqual('opacity:0;display:block;');
  });
});
