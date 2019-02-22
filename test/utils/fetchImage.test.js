import fetchImage from '../../src/logic/fetchImage';

describe('fetchImage', () => {
  it('should resolve when onload is triggered', async () => {
    const test = new Image();
    const promise = fetchImage(test, 'test');

    test.onload();

    const result = await promise;
    expect(result).toBeUndefined();
  });
});
