// @flow
import React from 'react';
import Animate from 'react-simple-animate';
import validImgSrc from './utils/validImgSrc';
import { APPEND_IMAGE_REF, IMAGES_LOADED, REMOVE_IMAGE_REF, DOCUMENT_LOADED, contextTypes } from './simpleImgProvider';

type State = {
  loaded: boolean,
  isDocumentLoad: boolean,
};

type Style = { [string]: number | string };

type Props = {
  src: string,
  placeholder: string,
  wrapperClassName: string,
  imgClassName: string,
  width: number,
  height: number,
  alt: string,
  sizes: string,
  srcSet: string,
  animationDuration: number,
  animationEndStyle: Style,
};

export type Context = {
  __ProgresssiveImagesAppendImageRef__: HTMLElement => void,
  __ProgresssiveImagesRemoveImageRef__: HTMLElement => void,
  __ProgresssiveImagesLoaded__: Set<HTMLElement>,
  __DocumentLoaded__: boolean,
};

const commonStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
};
const rootStyle = {
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
};
const defaultDisappearStyle = { opacity: 0 };
const defaultDisappearInSecond = 0.3;
const defaultImgPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const defaultPlaceholderColor = 'white';
const onCompleteStyle = { display: 'none' };
const fullWidthStyle = { width: '100%' };
const hiddenStyle = { visibility: 'hidden' };

export default class SimpleImg extends React.PureComponent<Props, State> {
  static contextTypes = contextTypes;

  constructor(props: Props, context: Context) {
    super(props);

    this.state = {
      loaded: false,
      useContext: !!context[IMAGES_LOADED],
      isDocumentLoad: false,
    };
  }

  state: State = {
    loaded: false,
    isDocumentLoad: false,
  };

  componentDidMount() {
    if (!this.element) return;

    if (this.state.useContext && this.state.isDocumentLoad) {
      this.context[APPEND_IMAGE_REF](this.element);
    } else {
      /* eslint-disable */
      if (this.state.isDocumentLoad && window.__REACT_SIMPLE_IMG__) {
        window.__REACT_SIMPLE_IMG__.observer.observe(this.element);
      }
      /* eslint-enable */
    }
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    if (!this.element || this.state.loaded) return;

    if (this.state.useContext && nextContext[IMAGES_LOADED].has(this.element)) {
      this.setState({
        loaded: true,
      });

      if (this.element) nextContext[REMOVE_IMAGE_REF](this.element);
    }

    if (nextContext[DOCUMENT_LOADED]) {
      this.setState({
        isDocumentLoad: true,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.isDocumentLoad) {
      if (this.state.useContext) {
        this.context[APPEND_IMAGE_REF](this.element);
      } else {
        /* eslint-disable */
        if (this.element !== null) window.__REACT_SIMPLE_IMG__.observer.observe(this.element);
        /* eslint-enable */
      }
    }
  }

  componentWillUnmount() {
    if (!this.element) return;

    if (this.state.useContext) {
      this.context[REMOVE_IMAGE_REF](this.element);
    } else {
      /* eslint-disable */
      if (!window.__REACT_SIMPLE_IMG__) return;

      const {
        observer,
        imgLoadingRefs,
      } = window.__REACT_SIMPLE_IMG__;
      /* eslint-enable */
      observer.unobserve(this.element);

      if (imgLoadingRefs.has(this.element)) {
        imgLoadingRefs.get(this.element).src = '';
        imgLoadingRefs.delete(this.element);
      }
    }
  }

  element = null;

  render() {
    const {
      src,
      imgClassName: className,
      wrapperClassName,
      width,
      height,
      alt,
      srcSet,
      sizes,
      animationDuration = defaultDisappearInSecond,
      animationEndStyle = defaultDisappearStyle,
      placeholder = defaultPlaceholderColor,
    } = this.props;
    const { loaded } = this.state;
    const isValidImgSrc = validImgSrc(placeholder);
    const inlineStyle = {
      ...commonStyle,
      ...(!isValidImgSrc ? { background: placeholder } : null),
    };
    const imgPlaceholder = isValidImgSrc ? placeholder : defaultImgPlaceholder;
    const isSrcSetFulfilled = this.element && this.element.src !== imgPlaceholder;

    return (
      <span style={rootStyle} className={wrapperClassName}>
        <img
          {...{ width, height, sizes, className }}
          alt={alt}
          ref={(element) => {
            this.element = element;
          }}
          src={loaded ? src : imgPlaceholder}
          srcSet={loaded ? srcSet : ''}
          data-src={src}
          data-srcset={srcSet}
          style={{
            ...(!isValidImgSrc && !loaded && !isSrcSetFulfilled ? hiddenStyle : null),
          }}
        />
        <Animate
          startAnimation={loaded}
          durationSeconds={animationDuration}
          endStyle={{
            ...inlineStyle,
            ...animationEndStyle,
            ...(!isValidImgSrc ? fullWidthStyle : null),
          }}
          onCompleteStyle={onCompleteStyle}
          {...(!isValidImgSrc
            ? {
              startStyle: {
                ...inlineStyle,
                ...fullWidthStyle,
              },
            }
          : null)}
        >
          {isValidImgSrc && <img {...{ width, height, className }} style={inlineStyle} alt={alt} src={placeholder} />}
        </Animate>
      </span>
    );
  }
}
