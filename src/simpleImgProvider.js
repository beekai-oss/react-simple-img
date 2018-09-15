// @flow
import React from 'react';
import observerStart, { defaultConfig } from './logic/observerStart';

// $FlowIgnoreLine:
export const SimpleImgContext = React.createContext({
  animationStates: {},
  register: undefined,
});

type State = {
  isDocumentLoad: boolean,
  mountedImages: Set<HTMLElement>,
};

export type Config = {
  root?: HTMLElement,
  rootMargin?: string,
  threshold?: number | Array<number>,
};

type Props = {
  config: Object,
  children: any,
};

export default class SimpleImgProvider extends React.Component<Props, State> {
  static displayName = 'SimpleImgProvider';

  static defaultProps = {
    config: defaultConfig,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      mountedImages: new Set(),
      isDocumentLoad: typeof window === 'undefined' ? document.readyState === 'complete' : false,
    };
  }

  componentDidMount() {
    const { config } = this.props;

    if (document.readyState === 'complete') {
      this.observer = observerStart.call(this, config);
    } else {
      window.addEventListener('load', () => {
        this.observer = observerStart.call(this, config);
        this.setState({
          isDocumentLoad: true,
        });
      });
    }
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
    return (
      <SimpleImgContext.Provider
        value={{
          ...{
            ...this.state,
            useContext: true,
            appendImageRef: this.appendImageRef,
            removeImageRef: this.removeImageRef,
            appendImgLoadingRef: this.appendImgLoadingRef,
            removeImgLoadingRef: this.removeImgLoadingRef,
          },
        }}
      >
        {this.props.children}
      </SimpleImgContext.Provider>
    );
  }
}
