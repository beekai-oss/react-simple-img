// @flow
import React from 'react';
import { Animate } from 'react-simple-animate';
import validImgSrc from './utils/validImgSrc';
import { SimpleImgContext } from './simpleImgProvider';
import initSimpleImg from './initSimpleImg';
import imageLoader from './utils/imageLoader';
import convertStyleIntoString from './utils/convertStyleIntoString';

type State = {
  loaded: boolean,
  isDocumentLoad: boolean,
  isCached: boolean,
};

type Style = { [string]: number | string };

type Props = {
  src: string,
  placeholder?: string | boolean,
  applyAspectRatio?: boolean,
  className?: string,
  width?: number,
  height?: number,
  alt?: string,
  sizes?: string,
  srcSet?: string,
  style?: Style,
  animationDuration?: number,
  animationEndStyle?: Style,
  useContext: boolean,
  isContextDocumentLoad: boolean,
  mountedImages: Set<any>,
  appendImageRef: HTMLElement => void,
  removeImageRef: HTMLElement => void,
  removeImgLoadingRef: HTMLElement => void,
  importance?: 'low' | 'high',
};

const commonStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
};
const defaultDisappearStyle = { opacity: 0 };
const defaultImgPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const defaultPlaceholderColor = 'white';
const onCompleteStyle = { display: 'none' };
const hiddenStyle = { visibility: 'hidden' };
const expendWidth = { width: '100%' };
const wrapperCommonStyle = {
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export class SimpleImg extends React.PureComponent<Props, State> {
  static defaultProps = {
    animationDuration: 0.3,
    importance: 'low',
    placeholder: defaultPlaceholderColor,
  };

  state: State = {
    loaded: false,
    isDocumentLoad: false,
    isCached: false,
  };

  element: any = React.createRef();

  constructor(props: Props) {
    super(props);
    if (typeof window === 'undefined') return;

    if (!props.useContext && !window.__REACT_SIMPLE_IMG__) {
      initSimpleImg();
    }
  }

  componentDidMount() {
    const cachedImagesRefString = window.sessionStorage.getItem('__REACT_SIMPLE_IMG__');
    if (cachedImagesRefString && window.__REACT_SIMPLE_IMG__ && window.__REACT_SIMPLE_IMG__.disableAnimateCachedImg) {
      const cachedImagesRef = JSON.parse(cachedImagesRefString);

      window.sessionStorage.setItem('__REACT_SIMPLE_IMG__', JSON.stringify(cachedImagesRef));
      if (cachedImagesRef[this.props.src]) {
        this.setState({
          isCached: true,
        });

        return;
      }
    }

    if (window.__REACT_SIMPLE_IMG__ && document.readyState === 'complete') {
      if (this.props.importance === 'high') {
        imageLoader(this.element.current, false);
      } else {
        window.__REACT_SIMPLE_IMG__.observer.observe(this.element.current);
      }
    } else if (document.readyState === 'complete') {
      this.setDocumentLoaded();
    } else {
      window.addEventListener('load', this.setDocumentLoaded);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      appendImageRef,
      useContext,
      removeImageRef,
      mountedImages,
      removeImgLoadingRef,
      isContextDocumentLoad,
      importance,
      src,
    } = this.props;
    const element = this.element.current;

    if (useContext) {
      if (
        ((!prevProps.isContextDocumentLoad && isContextDocumentLoad) ||
          (!prevState.isDocumentLoad && this.state.isDocumentLoad)) &&
        element
      ) {
        appendImageRef(element);
        removeImgLoadingRef(element);
      }

      if (element && mountedImages.has(element)) {
        setTimeout(() =>
          this.setState({
            loaded: true,
          }),
        );
        removeImageRef(element);
      }
      return;
    }

    if (window.__REACT_SIMPLE_IMG__ && !prevState.isDocumentLoad && this.state.isDocumentLoad) {
      if (importance === 'high') {
        imageLoader(this.element.current, false);
      } else {
        window.__REACT_SIMPLE_IMG__.observer.observe(element);
      }
    } else if (src !== prevProps.src) {
      this.setState({
        loaded: true,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.setDocumentLoaded);
    if (!this.element.current) return;
    const { removeImgLoadingRef, removeImageRef, useContext } = this.props;
    const element = this.element.current;

    if (useContext && element) {
      removeImgLoadingRef(element);
      removeImageRef(element);
    } else {
      if (!window.__REACT_SIMPLE_IMG__) return;

      const { observer, imgLoadingRefs } = window.__REACT_SIMPLE_IMG__;
      observer.unobserve(element);

      if (imgLoadingRefs.has(element)) {
        imgLoadingRefs.get(element).src = '';
        imgLoadingRefs.delete(element);
      }
    }
  }

  setDocumentLoaded = () => {
    this.setState({
      isDocumentLoad: true,
    });
  };

  render() {
    const {
      src,
      className,
      height,
      width,
      alt,
      srcSet,
      applyAspectRatio,
      animationDuration = 0.3,
      animationEndStyle = defaultDisappearStyle,
      placeholder = defaultPlaceholderColor,
      style = {},
      ...restProps
    } = this.props;
    const { loaded, isCached } = this.state;
    const isValidImgSrc = validImgSrc(placeholder);
    const inlineStyle = {
      ...commonStyle,
      ...(!isValidImgSrc ? { background: placeholder } : null),
    };
    const imgPlaceholder = isValidImgSrc ? placeholder : defaultImgPlaceholder;
    const isSrcSetFulfilled = this.element.current && this.element.current.src !== imgPlaceholder;
    const {
      useContext,
      isContextDocumentLoad,
      mountedImages,
      appendImageRef,
      removeImageRef,
      removeImgLoadingRef,
      importance,
      ...restImgProps
    } = restProps;
    const heightWidth = {
      ...(height ? { height: style.height || height } : null),
      ...(width ? { width: style.width || width } : null),
    };
    const isHeightAndWidthNotSet = !height && !width;
    const aspectRatio = parseInt(height, 10) / parseInt(width, 10);
    const shouldUseAspectRatio = applyAspectRatio && !Number.isNaN(aspectRatio);
    const aspectRatioStyle = {
      position: 'relative',
      display: 'block',
      paddingBottom: shouldUseAspectRatio ? `${Math.abs(aspectRatio * 100)}%` : '',
    };
    const animationEndStyleString = convertStyleIntoString(animationEndStyle);

    if (placeholder === false) {
      return (
        <img
          alt={alt}
          ref={this.element}
          src={loaded || isCached ? src : imgPlaceholder}
          srcSet={loaded || isCached ? srcSet : ''}
          data-placeholder="false"
          data-src={src}
          data-srcset={srcSet}
          height={height}
          width={width}
          style={{
            ...style,
            ...(isCached
              ? null
              : {
                  transition: `${animationDuration}s all`,
                  opacity: 0,
                }),
          }}
          {...restImgProps}
        />
      );
    }

    if (isCached) {
      return (
        <div
          style={{
            ...(shouldUseAspectRatio
              ? aspectRatioStyle
              : {
                  ...heightWidth,
                  ...wrapperCommonStyle,
                  ...style,
                }),
          }}
          className={className}
        >
          <img
            alt={alt}
            src={src}
            srcSet={srcSet}
            style={{
              ...(isHeightAndWidthNotSet ? expendWidth : heightWidth),
              ...(shouldUseAspectRatio
                ? { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
                : null),
            }}
            {...restImgProps}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          ...(shouldUseAspectRatio
            ? aspectRatioStyle
            : {
                ...wrapperCommonStyle,
                ...(height ? { height } : { height: 1, visibility: 'hidden' }),
                ...style,
              }),
        }}
        className={className}
      >
        <img
          alt={alt}
          ref={this.element}
          src={loaded ? src : imgPlaceholder}
          srcSet={loaded ? srcSet : ''}
          data-src={src}
          data-srcset={srcSet}
          data-end-style={animationEndStyleString}
          style={{
            ...(isHeightAndWidthNotSet ? expendWidth : heightWidth),
            ...(!isValidImgSrc && !loaded && !isSrcSetFulfilled ? hiddenStyle : {}),
            ...(shouldUseAspectRatio ? { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 } : null),
          }}
          {...restImgProps}
        />
        <Animate
          play={loaded}
          durationSeconds={animationDuration}
          endStyle={{
            ...inlineStyle,
            ...animationEndStyle,
            ...heightWidth,
          }}
          onCompleteStyle={onCompleteStyle}
          render={({ style: animateStyle }) => {
            const combinedStyle = { ...inlineStyle, ...animateStyle };

            return isValidImgSrc ? (
              <img style={combinedStyle} alt={alt} src={placeholder} {...restImgProps} />
            ) : (
              <div style={{ ...combinedStyle, width: '100%', height: '100%' }} />
            );
          }}
        />
      </div>
    );
  }
}

export default (props: Props) => (
  <SimpleImgContext.Consumer>{values => <SimpleImg {...{ ...props, ...values }} />}</SimpleImgContext.Consumer>
);
