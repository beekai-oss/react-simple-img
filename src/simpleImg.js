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
  sizes: string,
  srcSet: string,
  backgroundColor: string,
  animationDuration: number,
  animationEndStyle: Style,
};

export type Context = {
  __ProgresssiveImagesAppendImageRef__: HTMLElement => void,
  __ProgresssiveImagesRemoveImageRef__: HTMLElement => void,
  __ProgresssiveImagesLoaded__: Set<HTMLElement>,
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

    if (nextContext[IMAGES_LOADED].has(this.element)) {
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
      animationDuration,
      animationEndStyle,
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
      this.props.animationDuration !== animationDuration ||
      this.props.animationEndStyle !== animationEndStyle
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
      imgClassName: className,
      wrapperClassName,
      width,
      height,
      alt,
      srcSet,
      sizes,
      animationDuration,
      animationEndStyle,
      backgroundColor,
    } = this.props;
    const { loaded } = this.state;
    const durationSeconds = animationDuration || defaultDisappearInSecond;
    const inlineStyle = {
      ...commonStyle,
      background: backgroundColor,
    };
    const endStyle = animationEndStyle || defaultDisappearStyle;

    return (
      <span style={rootStyle} className={wrapperClassName}>
        <img
          {...{ width, height, sizes, className }}
          alt={alt}
          ref={(element) => {
            this.element = element;
          }}
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
          {placeHolderSrc && <img {...{ width, height, className }} style={inlineStyle} alt={alt} src={placeHolderSrc} />}
        </Animate>
      </span>
    );
  }
}
