// @flow
import React from 'react';
import Animate from 'react-simple-animate';
import { APPEND_IMAGE_REF, IMAGES_LOADED, REMOVE_IMAGE_REF, contextTypes } from './simpleImgProvider';

type State = {
  loaded: boolean,
};

type Style = { [string]: number | string };

type Props = {
  src: string,
  placeHolderSrc: string,
  wrapperClassName: string,
  imgClassName: string,
  width: number,
  height: number,
  alt: string,
  srcSet: string,
  backgroundColor: string,
  disappearInSecond: number,
  disappearStyle: Style,
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
  height: '100%',
};
const rootStyle = {
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
};
const defaultDisappearStyle = { opacity: 0 };
const defaultDisappearInSecond = 0.5;
const onCompleteStyle = { display: 'none' };
const fullWidthStyle = { width: '100%' };
const hiddenStyle = { visibility: 'hidden' };

export default class SimpleImg extends React.Component<Props, State> {
  static contextTypes = contextTypes;

  state: State = {
    loaded: false,
  };

  componentDidMount() {
    if (this.element) this.context[APPEND_IMAGE_REF](this.element);
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    if (!this.element || this.state.loaded) return;

    if (nextContext[IMAGES_LOADED].find(element => this.element === element)) {
      this.setState({
        loaded: true,
      });

      if (this.element) nextContext[REMOVE_IMAGE_REF](this.element);
    }
  }

  shouldComponentUpdate(
    {
      src,
      placeHolderSrc,
      width,
      height,
      alt,
      srcSet,
      wrapperClassName,
      imgClassName,
      backgroundColor,
      disappearInSecond,
      disappearStyle,
    }: Props,
    { loaded }: State,
  ) {
    return (
      this.state.loaded !== loaded ||
      this.props.src !== src ||
      this.props.placeHolderSrc !== placeHolderSrc ||
      this.props.wrapperClassName !== wrapperClassName ||
      this.props.imgClassName !== imgClassName ||
      this.props.width !== width ||
      this.props.height !== height ||
      this.props.alt !== alt ||
      this.props.srcSet !== srcSet ||
      this.props.backgroundColor !== backgroundColor ||
      this.props.disappearInSecond !== disappearInSecond ||
      this.props.disappearStyle !== disappearStyle
    );
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
      imgClassName,
      wrapperClassName,
      width,
      height,
      alt,
      srcSet,
      disappearInSecond,
      disappearStyle,
      backgroundColor,
    } = this.props;
    const { loaded } = this.state;
    const durationSeconds = disappearInSecond || defaultDisappearInSecond;
    const inlineStyle = {
      ...commonStyle,
      background: backgroundColor,
    };
    const endStyle = disappearStyle || defaultDisappearStyle;

    return (
      <span style={rootStyle} className={wrapperClassName}>
        <img
          {...{ width, height }}
          alt={alt}
          ref={(element) => {
            this.element = element;
          }}
          className={imgClassName}
          src={loaded ? src : placeHolderSrc}
          srcSet={loaded ? srcSet : ''}
          data-src={src}
          data-srcset={srcSet}
          style={{
            ...(!placeHolderSrc && !loaded ? hiddenStyle : null),
          }}
        />
        <Animate
          startAnimation={loaded}
          durationSeconds={durationSeconds}
          endStyle={{
            ...inlineStyle,
            ...endStyle,
            ...(backgroundColor
              ? fullWidthStyle
              : null),
          }}
          onCompleteStyle={onCompleteStyle}
          {...(backgroundColor
            ? {
              startStyle: {
                ...inlineStyle,
                ...fullWidthStyle,
              },
            }
            : null)}
        >
          {placeHolderSrc && <img {...{ width, height }} style={inlineStyle} className={imgClassName} alt={alt} src={placeHolderSrc} />}
        </Animate>
      </span>
    );
  }
}
