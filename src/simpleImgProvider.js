// @flow
import React from 'react';
import PropTypes from 'prop-types';
import type { Context } from './simpleImg';
import { observerStart, defaultConfig } from './initSimpleImg';

export const APPEND_IMAGE_REF = '__ProgresssiveImagesAppendImageRef__';
export const REMOVE_IMAGE_REF = '__ProgresssiveImagesRemoveImageRef__';
export const IMAGES_LOADED = '__ProgresssiveImagesLoaded__';
export const DOCUMENT_LOADED = '__DocumentLoaded__';
export const contextTypes = {
  [APPEND_IMAGE_REF]: PropTypes.func,
  [REMOVE_IMAGE_REF]: PropTypes.func,
  [IMAGES_LOADED]: PropTypes.object,
  [DOCUMENT_LOADED]: PropTypes.bool,
};

type State = {
  mountedImages: Set<HTMLElement>,
  isDocumentLoad: boolean,
};

export type Config = {
  root?: HTMLElement,
  rootMargin?: string,
  threshold?: number | Array<number>,
};

export default function SimpleImgProvider(WrappedComponent: any, config: Config = defaultConfig) {
  return class extends React.Component<any, State> {
    static childContextTypes: Context = contextTypes;
    static displayName = `SimpleImgProvider(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    state: State = {
      mountedImages: new Set(),
      isDocumentLoad: false,
    };

    getChildContext() {
      return {
        [APPEND_IMAGE_REF]: this.appendImageRef,
        [REMOVE_IMAGE_REF]: this.removeImageRef,
        [IMAGES_LOADED]: this.state.mountedImages,
        [DOCUMENT_LOADED]: this.state.isDocumentLoad,
      };
    }

    componentDidMount() {
      /* eslint-disable */
      window.addEventListener('load', () => {
        this.observer = observerStart.call(this, config);
        this.setState({
          isDocumentLoad: true,
        });
      });

      if (document.readyState === 'complete') {
        this.observer = observerStart.call(this, config);
      }
      /* eslint-enable */
    }

    componentWillUnmount() {
      this.imageLoadRefs.forEach((image) => {
        // cancel all loading images;
        image.src = ''; // eslint-disable-line no-param-reassign
      });
      this.imageLoadRefs.clear();
    }

    appendImageRef = (image: HTMLElement) => this.observer && this.observer.observe(image);

    removeImageRef = (image: HTMLElement) => {
      // $FlowIgnoreLine:
      this.observer.unobserve(image);
      this.setState(({ mountedImages }) => {
        mountedImages.delete(image);
        return {
          mountedImages,
        };
      });
    };

    appendImgLoadingRef = (image: Image) => {
      this.imageLoadRefs.add(image);
    };

    removeImgLoadingRef = (image: Image) => {
      this.imageLoadRefs.delete(image);
    };

    observer = {};

    imageLoadRefs = new Set();

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
