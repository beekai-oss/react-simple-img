// @flow
import React from 'react';
import PropTypes from 'prop-types';
import type { Context } from './simpleImg';
import filterImgSrc from './logic/filterSrcset';

export const APPEND_IMAGE_REF = '__ProgresssiveImagesAppendImageRef__';
export const REMOVE_IMAGE_REF = '__ProgresssiveImagesRemoveImageRef__';
export const IMAGES_LOADED = '__ProgresssiveImagesLoaded__';
export const contextTypes = {
  [APPEND_IMAGE_REF]: PropTypes.func,
  [REMOVE_IMAGE_REF]: PropTypes.func,
  [IMAGES_LOADED]: PropTypes.object,
};

type State = {
  mountedImages: Set<HTMLElement>,
};

type Config = {
  root?: HTMLElement,
  rootMargin?: string,
  threshold?: number | Array<number>,
};

const defaultConfig = {
  rootMargin: '20px 0px',
  threshold: [0, 0.25, 0.5, 0.75, 1],
};

export default function SimpleImgProvider(WrappedComponent: any, config: Config = defaultConfig) {
  return class extends React.Component<any, State> {
    static childContextTypes: Context = contextTypes;
    static displayName = `SimpleImgProvider(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    constructor(props: any) {
      super(props);
      /* eslint-disable */
      if (!window.IntersectionObserver) require('intersection-observer');
      // $FlowIgnoreLine:
      this.observer = new IntersectionObserver(this.onIntersection, config);
      /* eslint-enable */
    }

    state: State = {
      mountedImages: new Set(),
    };

    getChildContext() {
      return {
        [APPEND_IMAGE_REF]: this.appendImageRef,
        [REMOVE_IMAGE_REF]: this.removeImageRef,
        [IMAGES_LOADED]: this.state.mountedImages,
      };
    }

    onIntersection = (entries: Array<{ intersectionRatio: number, target: HTMLElement }>) =>
      entries.forEach(({ intersectionRatio, target }) => {
        if (intersectionRatio > 0) this.preloadImage(target);
      });

    appendImageRef = (image: HTMLElement) => this.observer.observe(image);

    removeImageRef = (image: HTMLElement) =>
      this.setState(({ mountedImages }) => {
        mountedImages.delete(image);
        return {
          mountedImages,
        };
      });

    observer = {};

    preloadImage = async (target: HTMLElement) => {
      try {
        // Stop watching and load the image
        // $FlowIgnoreLine:
        this.observer.unobserve(target);
        await this.fetchImage(filterImgSrc(target));
      } catch (e) {
        throw new Error(`💩 Fetch image failed with target ${JSON.stringify(target, null, 2)} and error message ${e}`);
      }

      this.applyImage(target);
    };

    fetchImage = (imageSrc: string) =>
      new Promise((resolve, error) => {
        const image = new Image(); // eslint-disable-line no-undef
        image.src = imageSrc;
        image.onload = resolve;
        image.onerror = error;
      });

    applyImage = (target: HTMLElement) =>
      this.setState(previousState => ({
        mountedImages: new Set(previousState.mountedImages.add(target)),
      }));

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
