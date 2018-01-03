import filterImgSrc, { findClosestDpr } from '../../src/logic/filterSrcset';

describe('filterImgSrc', () => {
  it('should produce the correct image path', () => {
    expect(filterImgSrc({ srcset: 'test.jpg 2x, test-small.jpg', dataset: { src: 'test.jpg' } })).toMatchSnapshot();
  });
});

describe('findClosestDpr', () => {
  it('should find the closest dpr', () => {
    expect(findClosestDpr([
      { dpr: 1 },
      { dpr: 1.8 },
      { dpr: 1.2 },
    ], 2)).toMatchSnapshot();
  });
});
