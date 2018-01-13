const fetchImage = (imageSrc: string) =>
  new Promise((resolve, error) => {
    const image = new Image(); // eslint-disable-line no-undef
    image.src = imageSrc;
    image.onload = resolve;
    image.onerror = error;
  });

export default fetchImage;
