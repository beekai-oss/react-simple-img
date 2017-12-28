// @flow
import React from 'react';
import PropTypes from 'prop-types';
import type { Context } from './image';

export const APPEND_IMAGE_REF = '__ProgresssiveImagesAppendImageRef__';
export const REMOVE_IMAGE_REF = '__ProgresssiveImagesRemoveImageRef__';
export const IMAGES_LOADED = '__ProgresssiveImagesLoaded__';
export const contextTypes = {
  [APPEND_IMAGE_REF]: PropTypes.func,
  [REMOVE_IMAGE_REF]: PropTypes.func,
  [IMAGES_LOADED]: PropTypes.array,
};

type State = {
  mountedImages: Array<any>,
  willMountImages: Array<any>,
};

type Config = {
  root?: HTMLElement,
  rootMargin?: string,
  threshold?: number | Array<number>,
};

const defaultConfig = {
  rootMargin: '20px 0px',
  threshold: [0.25, 0.5, 0.75],
};

export default function ObserverProvider(WrappedComponent: any, config: Config = defaultConfig) {
  return class extends React.Component<{}, State> {
    static childContextTypes: Context = contextTypes;

    constructor(props: any) {
      super(props);
      /* eslint-disable */
      if (!window.IntersectionObserver) require('intersection-observer');
      // $FlowIgnoreLine:
      this.observer = new IntersectionObserver(this.onIntersection, config);
      /* eslint-enable */
    }

    state: State = {
      mountedImages: [],
      willMountImages: [],
    };

    getChildContext() {
      return {
        [APPEND_IMAGE_REF]: this.appendImageRef,
        [REMOVE_IMAGE_REF]: this.removeImageRef,
        [IMAGES_LOADED]: this.state.mountedImages,
      };
    }

    onIntersection = (entries: Array<{ intersectionRatio: number, target: HTMLElement }>) =>
      entries.forEach(({ intersectionRatio, target }) => intersectionRatio > 0 && this.preloadImage(target));

    appendImageRef = (image: HTMLElement) => {
      this.observer.observe(image);
      this.setState(previousState => ({
        willMountImages: [...previousState.willMountImages, image],
      }));
    };

    removeImageRef = (image: HTMLElement) =>
      this.setState((previousState) => {
        const filterImages = images => images.filter(loadedImage => loadedImage !== image);
        const willMountImages = filterImages(previousState.willMountImages);
        const mountedImages = filterImages(this.state.willMountImages);

        return {
          mountedImages,
          willMountImages,
        };
      });

    observer = {};

    preloadImage = async (target: HTMLElement) => {
      try {
        const imageSrc = target.dataset.src;

        // Stop watching and load the image
        // $FlowIgnoreLine:
        this.observer.unobserve(target);

        await this.fetchImage(imageSrc);
      } catch (e) {
        throw new Error(`💩 Fetch image failed with target ${JSON.stringify(target, null, 2)} and error message ${e}`);
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

    applyImage = (target: HTMLElement) =>
      this.setState(previousState => ({
        mountedImages: [...previousState.mountedImages, target],
      }));

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
