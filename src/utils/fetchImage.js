// @flow

const fetchImage = (image: Image, imageSrc: string) =>
  new Promise((resolve, error) => {
    image.src = imageSrc; // eslint-disable-line no-param-reassign
    image.onload = resolve; // eslint-disable-line no-param-reassign
    image.onerror = error; // eslint-disable-line no-param-reassign
  });

export default fetchImage;
