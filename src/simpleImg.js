// @flow
import React from 'react';
import validImgSrc from './utils/validImgSrc';
import initSimpleImg from './initSimpleImg';
import imageLoader from './logic/imageLoader';
import type { State, Props } from './simpleImg.flow';
import {
  commonStyle,
  defaultImgPlaceholder,
  defaultPlaceholderColor,
  hiddenStyle,
  expendWidth,
  aspectRatioChildStyle,
  wrapperCommonStyle,
} from './constants';
import getAspectRatio from './utils/getAspectRatio';
import logError from './utils/logError';

export default class SimpleImg extends React.PureComponent<Props, State> {
  static defaultProps = {
    animationDuration: 0.3,
    importance: 'low',
    placeholder: defaultPlaceholderColor,
  };

  state: State = {
    isDocumentLoad: false,
    isCached: false,
  };

  element: any = React.createRef();

  constructor(props: Props) {
    super(props);
    if (typeof window !== 'undefined' && !window.__REACT_SIMPLE_IMG__) {
      initSimpleImg();
    }
  }

  componentDidMount() {
    const cachedImagesRefString = window.sessionStorage.getItem('__REACT_SIMPLE_IMG__');
    const { src } = this.props;
    const element = this.element.current;

    if (
      cachedImagesRefString &&
      window.__REACT_SIMPLE_IMG__.disableAnimateCachedImg &&
      element &&
      !element.getAttribute('data-from-server')
    ) {
      try {
        const cachedImagesRef = JSON.parse(cachedImagesRefString);

        if (cachedImagesRef[src]) {
          this.setState({
            isCached: true,
          });
          return;
        }
      } catch (e) {
        logError(`JSON parsing is broken ${e}`);
      }
    }

    if (document.readyState === 'complete') {
      this.triggerImageLoadOrObserver();
    } else {
      window.addEventListener('load', this.setDocumentLoaded);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.isDocumentLoad && this.state.isDocumentLoad) {
      this.triggerImageLoadOrObserver();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.setDocumentLoaded);
    if (!this.element.current) return;
    const element = this.element.current;

    const { observer, imgLoadingRefs, callBackRefs } = window.__REACT_SIMPLE_IMG__;
    observer.unobserve(element);

    if (imgLoadingRefs.has(element)) {
      imgLoadingRefs.get(element).src = '';
      imgLoadingRefs.delete(element);
    }

    callBackRefs.delete(element);
  }

  setDocumentLoaded = () => {
    this.setState({
      isDocumentLoad: true,
    });
  };

  triggerImageLoadOrObserver() {
    const { importance, onComplete } = this.props;
    const { observer, callBackRefs } = window.__REACT_SIMPLE_IMG__;

    if (importance === 'auto') {
      imageLoader(this.element.current);
    } else {
      observer.observe(this.element.current);
    }

    if (onComplete) callBackRefs.set(this.element.current, onComplete);
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
      placeholder = defaultPlaceholderColor,
      style = {},
      ...restProps
    } = this.props;
    const { isCached } = this.state;
    const disablePlaceholder = placeholder === false;
    const isValidImgSrc = validImgSrc(placeholder);
    const inlineStyle = {
      ...commonStyle,
      ...(!isValidImgSrc ? { background: placeholder } : null),
      transition: `${animationDuration}s all`,
    };
    const imgPlaceholder = isValidImgSrc ? placeholder : defaultImgPlaceholder;
    const isSrcSetFulfilled = this.element.current && this.element.current.src !== imgPlaceholder;
    const { importance, onComplete, ...restImgProps } = restProps;
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
    const imageProps = {
      alt,
      src: isCached ? src : imgPlaceholder,
      srcSet: isCached ? srcSet : '',
      ...(typeof window === 'undefined' ? { 'data-from-server': 'yes' } : { 'data-from-server': 'no' } ),
      ...(isCached
        ? null
        : {
            ref: this.element,
            ...(disablePlaceholder ? { 'data-placeholder': 'false' } : null),
            'data-src': src,
            'data-srcset': srcSet,
          }),
      ...restImgProps,
    };

    if (disablePlaceholder && !applyAspectRatio) {
      return (
        <img
          style={{
            ...style,
            ...(isCached
              ? null
              : {
                  transition: `${animationDuration}s all`,
                  opacity: 0,
                }),
          }}
          className={className}
          {...heightWidth}
          {...imageProps}
        />
      );
    }
    const placeholderComponent = isValidImgSrc ? (
      <img style={inlineStyle} src={placeholder} {...restImgProps} />
    ) : (
      <div style={inlineStyle} />
    );

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
            ...(!isValidImgSrc && !isSrcSetFulfilled ? hiddenStyle : {}),
            ...(shouldUseAspectRatio ? aspectRatioChildStyle : null),
            ...(disablePlaceholder
              ? {
                  transition: `${animationDuration}s all`,
                  opacity: 0,
                }
              : null),
          }}
          {...imageProps}
        />
        {!disablePlaceholder && placeholderComponent}
      </div>
    );
  }
}
