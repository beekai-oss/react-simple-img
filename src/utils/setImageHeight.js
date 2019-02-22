export default function setImageHeight(image, target) {
  image.addEventListener('load', e => {
    target.parentNode.style.height = `${e.target.height}px`; // eslint-disable-line
    target.parentNode.style.visibility = 'visible'; // eslint-disable-line
  });
}
