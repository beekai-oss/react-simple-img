import findClosestDpr from '../../src/utils/findClosestDpr';

describe('findClosestDpr', () => {
  it('should find the closest dpr', () => {
    expect(findClosestDpr([
      { dpr: 1 },
      { dpr: 1.8 },
      { dpr: 1.2 },
    ], 2)).toMatchSnapshot();
  });
});
