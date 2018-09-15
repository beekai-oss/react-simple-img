// @flow
import React from 'react';
import { observerStart, defaultConfig } from './initSimpleImg';

export const SimpleImgContext = React.createContext({
  animationStates: {},
  register: undefined,
});

type State = {
  isDocumentLoad: boolean,
};

export type Config = {
  root?: HTMLElement,
  rootMargin?: string,
  threshold?: number | Array<number>,
};

type Props = {
  config: Object,
};

export default class SimpleImgProvider extends React.Component<Props, State> {
  static displayName = 'SimpleImgProvider';

  static defaultProps = {
    config: defaultConfig,
  };

  state: State = {
    isDocumentLoad: false,
  };

  componentDidMount() {
    const { config } = this.props;

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
    this.imageLoadRefs.forEach(image => {
      // cancel all loading images;
      image.src = ''; // eslint-disable-line no-param-reassign
    });
  }

  appendImageRef = (image: HTMLElement) => this.observer && this.observer.observe(image);

  removeImageRef = (image: HTMLElement) => {
    // $FlowIgnoreLine:
    this.observer.unobserve(image);
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
    return (
      <SimpleImgContext.provider
        value={{ ...{ ...this.state, appendImageRef: this.appendImageRef, removeImageRef: this.removeImageRef } }}
      >
        {this.props.children}
      </SimpleImgContext.provider>
    );
  }
}
