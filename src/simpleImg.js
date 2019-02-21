// @flow
import React from 'react';
import { Animate } from 'react-simple-animate';
import validImgSrc from './utils/validImgSrc';
import { SimpleImgContext } from './simpleImgProvider';
import initSimpleImg from './initSimpleImg';
import imageLoader from './utils/imageLoader';
import convertStyleIntoString from './utils/convertStyleIntoString';
import type { State, Props } from './simpleImg.flow';
import {
  commonStyle,
  defaultDisappearStyle,
  defaultImgPlaceholder,
  defaultPlaceholderColor,
  hiddenStyle,
  expendWidth,
  aspectRatioChildStyle,
  wrapperCommonStyle,
} from './constants';
import getAspectRatio from './logic/getAspectRatio';

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
    if (typeof window !== 'undefined' && !props.useContext && !window.__REACT_SIMPLE_IMG__) {
      initSimpleImg();
    }
  }

  componentDidMount() {
    const cachedImagesRefString = window.sessionStorage.getItem('__REACT_SIMPLE_IMG__');
    const { src } = this.props;

    if (
      cachedImagesRefString &&
      window.__REACT_SIMPLE_IMG__ &&
      window.__REACT_SIMPLE_IMG__.disableAnimateCachedImg &&
      !this.element.current.getAttribute('data-from-server')
    ) {
      const cachedImagesRef = JSON.parse(cachedImagesRefString);

      if (cachedImagesRef[src]) {
        this.setState({
          isCached: true,
        });
        return;
      }
    }

    if (window.__REACT_SIMPLE_IMG__ && document.readyState === 'complete') {
      this.triggerImageLoadOrObserver();
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
      this.triggerImageLoadOrObserver();
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
    } else if (window.__REACT_SIMPLE_IMG__) {
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

  triggerImageLoadOrObserver() {
    if (this.props.importance === 'auto') {
      imageLoader(this.element.current, false);
    } else {
      window.__REACT_SIMPLE_IMG__.observer.observe(this.element.current);
    }
  }

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
    const { shouldUseAspectRatio, aspectRatioStyle } = getAspectRatio({
      height,
      width,
      applyAspectRatio,
    });
    const animationEndStyleString = convertStyleIntoString(animationEndStyle);
    const imageProps = {
      alt,
      src: loaded || isCached ? src : imgPlaceholder,
      srcSet: loaded || isCached ? srcSet : '',
      ...(typeof window === 'undefined' ? { 'data-from-server': 'yes' } : null),
      ...(isCached
        ? null
        : {
            ref: this.element,
            ...(placeholder === false ? { 'data-placeholder': 'false' } : null),
            'data-src': src,
            'data-srcset': srcSet,
            'data-end-style': animationEndStyleString,
          }),
      ...restImgProps,
    };

    if (placeholder === false) {
      return (
        <img
          style={{
            ...(isCached
              ? null
              : {
                  transition: `${animationDuration}s all`,
                  opacity: 0,
                }),
            ...style,
          }}
          className={className}
          {...imageProps}
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
            style={{
              ...(isHeightAndWidthNotSet ? expendWidth : heightWidth),
              ...(shouldUseAspectRatio ? aspectRatioChildStyle : null),
            }}
            {...imageProps}
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
          style={{
            ...(isHeightAndWidthNotSet ? expendWidth : heightWidth),
            ...(!isValidImgSrc && !loaded && !isSrcSetFulfilled ? hiddenStyle : {}),
            ...(shouldUseAspectRatio ? aspectRatioChildStyle : null),
          }}
          {...imageProps}
        />
        <Animate
          play={loaded}
          durationSeconds={animationDuration}
          endStyle={{
            ...inlineStyle,
            ...animationEndStyle,
            ...heightWidth,
          }}
          render={({ style: animateStyle }) => {
            const combinedStyle = { ...inlineStyle, ...animateStyle };

            return isValidImgSrc ? (
              <img style={combinedStyle} src={placeholder} {...restImgProps} />
            ) : (
              <div style={combinedStyle} />
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
