import filterImgSrc from '../../src/logic/filterSrcset';

jest.mock('../../src/utils/parseSrcset', () => () => []);
jest.mock('../../src/utils/findClosestDpr', () => () => ({ url: 'test' }));

describe('filterImgSrc', () => {
  it('should produce the correct image path', () => {
    expect(
      filterImgSrc({ srcset: 'test.jpg 2x, test-small.jpg', dataset: { src: 'test.jpg', srcset: 'test.jpg' } }),
    ).toMatchSnapshot();
  });

  it('should return src if srcset not been set', () => {
    expect(filterImgSrc({ dataset: { src: 'test' } })).toBe('test');
  });
});
