// @flow
import React from 'react';
import PropTypes from 'prop-types';
import type { Context } from './simpleImg';
import init from './init';

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

export type Config = {
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
      this.observer = init.call(this, config);
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

    appendImageRef = (image: HTMLElement) => this.observer && this.observer.observe(image);

    removeImageRef = (image: HTMLElement) =>
      this.setState(({ mountedImages }) => {
        mountedImages.delete(image);
        return {
          mountedImages,
        };
      });

    observer = {};

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
