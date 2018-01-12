// @flow
import React from 'react';
import Animate from 'react-simple-animate';
import validImgSrc from './utils/validImgSrc';
import { APPEND_IMAGE_REF, IMAGES_LOADED, REMOVE_IMAGE_REF, contextTypes } from './simpleImgProvider';

type State = {
  loaded: boolean,
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

export default class SimpleImg extends React.Component<Props, State> {
  static contextTypes = contextTypes;

  constructor(props: Props, context: Context) {
    super(props);

    this.state = {
      loaded: false,
      useContext: !!context[IMAGES_LOADED],
    };
  }

  state: State = {
    loaded: false,
  };

  componentDidMount() {
    if (!this.element) return;
    if (this.state.useContext) {
      this.context[APPEND_IMAGE_REF](this.element);
    } else {
      window.reactSimpleImgobserver.observe(this.element); // eslint-disable-line no-undef
    }
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    if (!this.element || this.state.loaded || !this.state.useContext) return;

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
      placeholder,
      width,
      height,
      alt,
      srcSet,
      wrapperClassName,
      imgClassName,
      animationDuration,
      animationEndStyle,
    }: Props,
    { loaded }: State,
  ) {
    return (
      this.state.loaded !== loaded ||
      this.props.src !== src ||
      this.props.placeholder !== placeholder ||
      this.props.wrapperClassName !== wrapperClassName ||
      this.props.imgClassName !== imgClassName ||
      this.props.width !== width ||
      this.props.height !== height ||
      this.props.alt !== alt ||
      this.props.srcSet !== srcSet ||
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
            ...(!isValidImgSrc && !loaded ? hiddenStyle : null),
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
