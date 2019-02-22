// @flow
import React from 'react';
import validImgSrc from './utils/validImgSrc';
import initSimpleImg from './initSimpleImg';
import imageLoader from './logic/imageLoader';
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
import getAspectRatio from './utils/getAspectRatio';

export default class SimpleImg extends React.PureComponent<Props, State> {
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
    if (typeof window !== 'undefined' && !window.__REACT_SIMPLE_IMG__) {
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
    const { src } = this.props;

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
    const element = this.element.current;

    const { observer, imgLoadingRefs } = window.__REACT_SIMPLE_IMG__;
    observer.unobserve(element);

    if (imgLoadingRefs.has(element)) {
      imgLoadingRefs.get(element).src = '';
      imgLoadingRefs.delete(element);
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
      transition: `${animationDuration}s all`,
    };
    const imgPlaceholder = isValidImgSrc ? placeholder : defaultImgPlaceholder;
    const isSrcSetFulfilled = this.element.current && this.element.current.src !== imgPlaceholder;
    const { importance, ...restImgProps } = restProps;
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
        {isValidImgSrc ? <img style={inlineStyle} src={placeholder} {...restImgProps} /> : <div style={inlineStyle} />}
      </div>
    );
  }
}
