import parseSrcset from '../../src/utils/parseSrcset';

describe('parseSrcset', () => {
  it('should parse src set correctly', () => {
    expect(parseSrcset('medium.jpg 1000w, large.jpg 2000w')).toMatchSnapshot();
    expect(parseSrcset('large.jpg 3x, medium.jpg 2x, large.jpg')).toMatchSnapshot();
  });

  it('should throw error when invalid srcset is passed', () => {
    try {
      parseSrcset(23192381293123);
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });
});
