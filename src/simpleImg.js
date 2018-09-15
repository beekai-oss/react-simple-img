// @flow
import React from 'react';
import { Animate } from 'react-simple-animate';
import validImgSrc from './utils/validImgSrc';
import { SimpleImgContext } from './simpleImgProvider';

type State = {
  loaded: boolean,
  isLocalDocumentLoad: boolean,
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
  isDocumentLoad: boolean,
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
const defaultImgPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
const defaultPlaceholderColor = 'white';
const onCompleteStyle = { display: 'none' };
const fullWidthStyle = { width: '100%' };
const hiddenStyle = { visibility: 'hidden' };

export class SimpleImg extends React.PureComponent<Props, State> {
  static defaultProps = {
    removeImgLoadingRef: undefined,
    appendImageRef: undefined,
  };

  state: State = {
    loaded: false,
    isLocalDocumentLoad: false,
  };

  componentDidMount() {
    const { isDocumentLoad, appendImageRef } = this.props;

    if (isDocumentLoad) {
      appendImageRef(this.element.current);
    } else {
      /* eslint-disable */
      if ((this.state.isLocalDocumentLoad || document.readyState === 'complete') && window.__REACT_SIMPLE_IMG__) {
        window.__REACT_SIMPLE_IMG__.observer.observe(this.element.current);
      } else {
        window.addEventListener('load', () => {
          this.setState({
            isLocalDocumentLoad: true,
          });
        });
      }
      /* eslint-enable */
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { appendImgLoadingRef, removeImageRef, isDocumentLoad } = this.props;
    const element = this.element.current;

    if (!prevState.isLocalDocumentLoad && this.state.isLocalDocumentLoad) {
      window.__REACT_SIMPLE_IMG__.observer.observe(element);
    } else if (isDocumentLoad) {
      appendImgLoadingRef(element);
    }

    // if (this.element.current && removeImageRef) removeImageRef(this.element.current);
  }

  componentWillUnmount() {
    if (!this.element.current) return;
    const { removeImgLoadingRef } = this.props;

    if (removeImgLoadingRef) {
      removeImgLoadingRef(this.element.current);
    } else {
      /* eslint-disable */
      if (!window.__REACT_SIMPLE_IMG__) return;

      const { observer, imgLoadingRefs } = window.__REACT_SIMPLE_IMG__;
      /* eslint-enable */
      observer.unobserve(this.element.current);

      if (imgLoadingRefs.has(this.element.current)) {
        imgLoadingRefs.get(this.element.current).src = '';
        imgLoadingRefs.delete(this.element.current);
      }
    }
  }
  element = React.createRef();

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
      animationDuration,
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
    const isSrcSetFulfilled = this.element.current && this.element.current.src !== imgPlaceholder;

    return (
      <span style={rootStyle} className={wrapperClassName}>
        <img
          {...{ width, height, sizes, className }}
          alt={alt}
          ref={this.element}
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

export default () => <SimpleImgContext.consumer>{props => <SimpleImg {...props} />}</SimpleImgContext.consumer>;
