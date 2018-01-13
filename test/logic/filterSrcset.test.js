import filterImgSrc  from '../../src/logic/filterSrcset';

describe('filterImgSrc', () => {
  it('should produce the correct image path', () => {
    expect(filterImgSrc({ srcset: 'test.jpg 2x, test-small.jpg', dataset: { src: 'test.jpg' } })).toMatchSnapshot();
  });
});
