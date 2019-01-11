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
    animationDuration: 0.3,
  };

  state: State = {
    loaded: false,
    isDocumentLoad: false,
  };

  element: any = React.createRef();

  componentDidMount() {
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
    } else if (!prevState.isDocumentLoad && this.state.isDocumentLoad) {
      window.__REACT_SIMPLE_IMG__.observer.observe(element);
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
      alt,
      srcSet,
      animationDuration,
      animationEndStyle = defaultDisappearStyle,
      placeholder = defaultPlaceholderColor,
      ...restProps
    } = this.props;
    const { loaded } = this.state;
    const isValidImgSrc = validImgSrc(placeholder);
    const inlineStyle = {
      ...commonStyle,
      ...(!isValidImgSrc ? { background: placeholder } : null),
      height,
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

    return (
      <span style={rootStyle} className={wrapperClassName}>
        <img
          className={className}
          height={height}
          alt={alt}
          ref={this.element}
          src={loaded ? src : imgPlaceholder}
          srcSet={loaded ? srcSet : ''}
          data-src={src}
          data-srcset={srcSet}
          style={{
            ...(!isValidImgSrc && !loaded && !isSrcSetFulfilled ? hiddenStyle : null),
          }}
          {...restImgProps}
        />
        {isValidImgSrc && (
          <Animate
            play={loaded}
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
            render={({ style }) => (
              <img
                className={className}
                style={{ ...inlineStyle, ...style }}
                height={height}
                alt={alt}
                src={placeholder}
                {...restImgProps}
              />
            )}
          />
        )}
      </span>
    );
  }
}

export default (props: Props) => (
  <SimpleImgContext.Consumer>{values => <SimpleImg {...{ ...props, ...values }} />}</SimpleImgContext.Consumer>
);
