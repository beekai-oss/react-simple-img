// @flow
import React from 'react';
import { Animate } from 'react-simple-animate';
import validImgSrc from './utils/validImgSrc';
import { SimpleImgContext } from './simpleImgProvider';

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
  animationDuration?: number,
  animationEndStyle: Style,
  useContext: boolean,
  isContextDocumentLoad: boolean,
  mountedImages: Set<any>,
  appendImageRef: HTMLElement => void,
  removeImageRef: HTMLElement => void,
  removeImgLoadingRef: HTMLElement => void,
  wrapperStyle: Style,
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
  };

  state: State = {
    loaded: false,
    isDocumentLoad: false,
    isCached: false,
  };

  element: any = React.createRef();

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
      window.__REACT_SIMPLE_IMG__.observer.observe(this.element.current);
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

    if (!prevState.isDocumentLoad && this.state.isDocumentLoad) {
      window.__REACT_SIMPLE_IMG__.observer.observe(element);
    } else if (this.props.src !== prevProps.src) {
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
      imgClassName: className,
      wrapperClassName,
      height,
      width,
      alt,
      srcSet,
      animationDuration,
      animationEndStyle = defaultDisappearStyle,
      placeholder = defaultPlaceholderColor,
      wrapperStyle = {},
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
      ...restImgProps
    } = restProps;
    const heightWidth = {
      ...(height ? { height: wrapperStyle.height || height } : null),
      ...(width ? { width: wrapperStyle.width || width } : null),
    };
    const isHeightAndWidthNotSet = !height && !width;

    if (isCached) {
      return (
        <span
          style={{
            ...wrapperCommonStyle,
            ...wrapperStyle,
          }}
          className={wrapperClassName}
        >
          <img
            className={className}
            alt={alt}
            src={src}
            srcSet={srcSet}
            style={{ ...(isHeightAndWidthNotSet ? expendWidth : heightWidth) }}
            {...restImgProps}
          />
        </span>
      );
    }

    return (
      <span
        style={{
          ...wrapperCommonStyle,
          ...(height ? { height } : { height: 1, visibility: 'hidden' }),
          ...wrapperStyle,
        }}
        className={wrapperClassName}
      >
        <img
          className={className}
          alt={alt}
          ref={this.element}
          src={loaded ? src : imgPlaceholder}
          srcSet={loaded ? srcSet : ''}
          data-src={src}
          data-srcset={srcSet}
          style={{
            ...(isHeightAndWidthNotSet ? expendWidth : heightWidth),
            ...(!isValidImgSrc && !loaded && !isSrcSetFulfilled ? hiddenStyle : {}),
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
          render={({ style }) => {
            const combinedStyle = { ...inlineStyle, ...style };

            return isValidImgSrc ? (
              <img className={className} style={combinedStyle} alt={alt} src={placeholder} {...restImgProps} />
            ) : (
              <div className={className} style={{ ...combinedStyle, width: '100%', height: '100%' }} />
            );
          }}
        />
      </span>
    );
  }
}

export default (props: Props) => (
  <SimpleImgContext.Consumer>{values => <SimpleImg {...{ ...props, ...values }} />}</SimpleImgContext.Consumer>
);
