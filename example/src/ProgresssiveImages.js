import React from 'react';
import PropTypes from 'prop-types';

export const APPEND_IMAGES_REF = '__ProgresssiveImagesAppendImageRef';
export const REMOVE_IMAGE_REF = '__ProgresssiveImagesRemoveImageRef';
export const IMAGES_LOADED = '__ProgresssiveImagesLoaded__';

export default function ProgresssiveImages(WrappedComponent, config) {
  return class extends React.Component {
    static childContextTypes = {
      [APPEND_IMAGES_REF]: PropTypes.func,
      [REMOVE_IMAGE_REF]: PropTypes.func,
      [IMAGES_LOADED]: PropTypes.array,
    };

    state = {
      loadedImages: [],
    };

    getChildContext() {
      return {
        [APPEND_IMAGES_REF]: this.appendImageRef,
        [REMOVE_IMAGE_REF]: this.removeImageRef,
        [IMAGES_LOADED]: this.state.loadedImages,
      };
    }

    observer = null;
    images = [];

    appendImageRef = image => this.images.push(image);

    removeImageRef = image =>
      this.setState({
        loadedImages: this.state.loadedImages.filter(loadedImage => loadedImage !== image),
      });

    componentDidMount() {
      if (!window.IntersectionObserver) require('intersection-observer');

      this.observer = new IntersectionObserver(this.onIntersection, config);
      this.images.forEach(image => this.observer.observe(image));
    }

    componentWillUnmount() {
      this.observer = null;
      this.images = null;
    }

    onIntersection = entries =>
      entries.forEach(({ intersectionRatio, target }) => intersectionRatio > 0 && this.preloadImage(target));

    preloadImage = async target => {
      const imageSrc = target.dataset.src;

      // Stop watching and load the image
      this.observer.unobserve(target);

      try {
        await this.fetchImage(imageSrc);
      } catch (e) {
        throw new Error(`💩 Fetch image failed with image src ${imageSrc}, target ${target} and error message ${e}`);
      }

      this.applyImage(target, imageSrc);
    };

    fetchImage(imageSrc) {
      return new Promise((resolve, error) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = resolve;
        image.onerror = error;
      });
    }

    applyImage = (target) => {
      this.setState({
        loadedImages: [...this.state.loadedImages, target],
      });
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
