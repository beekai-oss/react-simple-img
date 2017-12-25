// @flow
import React from 'react';
import PropTypes from 'prop-types';
import type { Context } from './progressiveImage';

export const APPEND_IMAGES_REF = '__ProgresssiveImagesAppendImageRef__';
export const REMOVE_IMAGE_REF = '__ProgresssiveImagesRemoveImageRef__';
export const IMAGES_LOADED = '__ProgresssiveImagesLoaded__';

type State = {
  loadedImages: Array<any>,
};

type Config = {
  root: any,
  rootMargin: any,
  threshold: any,
};

export default function withLazyLoadImages(WrappedComponent: any, config: Config) {
  return class extends React.Component<{}, State> {
    static childContextTypes: Context = {
      [APPEND_IMAGES_REF]: PropTypes.func,
      [REMOVE_IMAGE_REF]: PropTypes.func,
      [IMAGES_LOADED]: PropTypes.array,
    };

    state: State = {
      loadedImages: [],
    };

    getChildContext() {
      return {
        [APPEND_IMAGES_REF]: this.appendImageRef,
        [REMOVE_IMAGE_REF]: this.removeImageRef,
        [IMAGES_LOADED]: this.state.loadedImages,
      };
    }

    componentDidMount() {
      /* eslint-disable */
      if (!window.IntersectionObserver) require('intersection-observer');
      // $FlowIgnoreLine:
      this.observer = new IntersectionObserver(this.onIntersection, config);
      /* eslint-enable */
      this.images.forEach(image => this.observer.observe(image));
    }

    onIntersection = (entries: Array<{ intersectionRatio: number, target: HTMLElement }>) =>
      entries.forEach(({ intersectionRatio, target }) => intersectionRatio > 0 && this.preloadImage(target));

    appendImageRef = (image: any) => this.images.push(image);

    removeImageRef = (image: any) =>
      this.setState({
        loadedImages: this.state.loadedImages.filter(loadedImage => loadedImage !== image) || [],
      });

    observer = {};

    images: Array<any> = [];

    preloadImage = async (target: HTMLElement) => {
      const imageSrc = target.dataset.src;

      // Stop watching and load the image
      // $FlowIgnoreLine:
      this.observer.unobserve(target);

      try {
        await this.fetchImage(imageSrc);
      } catch (e) {
        throw new Error(
          `💩 Fetch image failed with image src ${imageSrc}, target ${JSON.stringify(
            target,
            null,
            2,
          )} and error message ${e}`,
        );
      }

      this.applyImage(target);
    };

    fetchImage = (imageSrc: string) =>
      new Promise((resolve, error) => {
        /* eslint-disable */
        const image = new Image();
        /* eslint-enable */
        image.src = imageSrc;
        image.onload = resolve;
        image.onerror = error;
      });

    applyImage = (target: HTMLElement) => {
      this.setState({
        loadedImages: [...this.state.loadedImages, target],
      });
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
