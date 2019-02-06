import filterImgSrc from '../../src/logic/filterSrcset';
import findClosestDpr from '../../src/utils/findClosestDpr';

jest.mock('../../src/utils/findClosestDpr');

describe('filterImgSrc', () => {
  it('should produce the correct image path', () => {
    findClosestDpr.mockReturnValueOnce({
      url: 'test',
    });
    expect(
      filterImgSrc({ srcset: 'test.jpg 2x, test-small.jpg', dataset: { src: 'test.jpg', srcset: 'test.jpg' } }),
    ).toMatchSnapshot();
  });

  it('should return src if srcset not been set', () => {
    expect(filterImgSrc({ dataset: { src: 'test' } })).toBe('test');
  });

  it('should return found src url', () => {
    expect(
      filterImgSrc({
        dataset: {
          src: 'elva-fairy-800w.jpg',
          srcset: 'elva-fairy-320w.jpg 1x, elva-fairy-480w.jpg 2x, elva-fairy-800w.jpg 3x',
        },
      }),
    ).toBe('elva-fairy-320w.jpg');
  });

  it('should return the closest dpr image when parse src return undefined', () => {
    expect(
      filterImgSrc({
        dataset: {
          src: 'elva-fairy-800w.jpg',
          srcset: 'elva-fairy-320X.jpg 800w',
        },
      }),
    ).toBe('test');
  });
});
