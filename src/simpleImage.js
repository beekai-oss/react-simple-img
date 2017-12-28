// @flow
import React from 'react';
import Animate from 'react-simple-animate';
// import parseSrcset from './utils/parseSrcset';
import { APPEND_IMAGE_REF, IMAGES_LOADED, REMOVE_IMAGE_REF, contextTypes } from './simpleImageProvider';

type State = {
  loaded: boolean,
};

type Style = { [string]: number | string };

type Props = {
  src: string,
  placeHolderSrc: string,
  className: string,
  width: number,
  height: number,
  alt: string,
  srcSet: string,
  style: Style,
  placeHolderBackgroundColor: string,
  animateDisappearInSecond: number,
  animateDisappearStyle: Style,
};

export type Context = {
  __ProgresssiveImagesAppendImageRef__: HTMLElement => void,
  __ProgresssiveImagesRemoveImageRef__: HTMLElement => void,
  __ProgresssiveImagesLoaded__: Array<HTMLElement>,
};

const commonStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
};
const rootStyle = {
  position: 'relative',
  overflow: 'hidden',
};
const defaultDisappearStyle = { opacity: 0 };
const defaultDisappearInSecond = 0.5;
const onCompleteStyle = { display: 'none' };

export default class Image extends React.Component<Props, State> {
  static contextTypes = contextTypes;

  state: State = {
    loaded: false,
  };

  componentDidMount() {
    // if (srcSet) {
    //   try {
    //     const srcs = parseSrcset(srcSet);
    //     const width = document.documentElement.clientWidth || window.innerWidth;
    //
    //     const srcWithDpr = srcs.map(src => ({
    //       ...src,
    //       ...(!src.dpr ? { dpr: src.width / width } : null),
    //     }));
    //
    //     const exactSrc = srcWithDpr.find(({dpr}) => window.devicePixelRatio === dpr);
    //
    //     if (!exactSrc) {
    //       const last = srcWithDpr.reduce(function(prev, curr) {
    //         return (Math.abs(curr.dpr - window.devicePixelRatio) < Math.abs(prev.dpr - window.devicePixelRatio) ? curr : prev);
    //       });
    //       console.log(last);
    //     }
    //   } catch (e) {
    //     console.log('fucked');
    //   }
    // }
    if (this.element) this.context[APPEND_IMAGE_REF](this.element);
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    if (!this.element || this.state.loaded || !nextContext[IMAGES_LOADED].find(element => this.element === element)) {
      return;
    }

    this.setState({
      loaded: true,
    });

    if (this.element) nextContext[REMOVE_IMAGE_REF](this.element);
  }

  componentWillUnmount() {
    if (this.element) this.context[REMOVE_IMAGE_REF](this.element);
    clearTimeout(this.timer);
    this.timer = null;
  }

  element = null;
  timer = null;

  render() {
    const {
      src,
      placeHolderSrc,
      className,
      style,
      width,
      height,
      alt,
      srcSet,
      animateDisappearInSecond,
      animateDisappearStyle,
      placeHolderBackgroundColor,
    } = this.props;
    const { loaded } = this.state;
    const disappearInSecond = animateDisappearInSecond || defaultDisappearInSecond;
    const inlineStyle = {
      ...commonStyle,
      background: placeHolderBackgroundColor,
    };

    return (
      <span
        style={rootStyle}
        className={className}
      >
        <img
          {...{ width, height, style, srcSet }}
          alt={alt}
          ref={(element) => {
            this.element = element;
          }}
          src={loaded ? src : placeHolderSrc}
          data-src={src}
        />
        <Animate
          startAnimation={loaded}
          durationSeconds={disappearInSecond}
          endStyle={animateDisappearStyle || defaultDisappearStyle}
          onCompleteStyle={onCompleteStyle}
        >
          {placeHolderSrc ? (
            <img {...{ width, height }} style={inlineStyle} alt={alt} src={placeHolderSrc} />
          ) : (
            <span style={inlineStyle} />
          )}
        </Animate>
      </span>
    );
  }
}
