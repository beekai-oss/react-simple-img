import validImg from '../../src/utils/validImgSrc';

describe('validImgSrc', () => {
  it('should valid the following src', () => {
    expect(validImg('http://')).toBeTruthy();
    expect(validImg('https://')).toBeTruthy();
    expect(validImg('/test/')).toBeTruthy();
    expect(validImg('test/test1/test2')).toBeTruthy();
    expect(validImg('data:image')).toBeTruthy();
  });

  it('should not valid the following src', () => {
    expect(validImg('white')).toBeFalsy();
    expect(validImg('linear-gradient(to right, red , yellow)')).toBeFalsy();
  });
});
