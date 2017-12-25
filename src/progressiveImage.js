// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Animate from 'react-simple-animate';
import { APPEND_IMAGES_REF, IMAGES_LOADED, REMOVE_IMAGE_REF } from './';

type State = {
  startAnimation: boolean,
  loaded: boolean,
};

type Props = {
  src: string,
  placeHolderSrc: string,
  className: string,
  style: { [string]: string | number },
  width: number,
  height: number,
  alt: string,
  srcSet: string,
  animateDisappearInSecond: number,
  animateStartStyle: { [string]: number | string },
  animateEndStyle: { [string]: number | string },
};

export type Context = {
  __ProgresssiveImagesAppendImageRef__: any => void,
  __ProgresssiveImagesRemoveImageRef__: any => void,
  __ProgresssiveImagesLoaded__: Array<any>,
};

export default class ProgressiveImage extends React.Component<Props, State> {
  static contextTypes = {
    [APPEND_IMAGES_REF]: PropTypes.func,
    [IMAGES_LOADED]: PropTypes.array,
    [REMOVE_IMAGE_REF]: PropTypes.func,
  };

  state: State = {
    startAnimation: true,
    loaded: false,
  };

  componentDidMount() {
    if (this.element) this.context[APPEND_IMAGES_REF](this.element);
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    if (!this.element || this.state.loaded || !nextContext[IMAGES_LOADED].find(element => this.element === element)) {
      return;
    }

    this.setState({
      startAnimation: false,
      loaded: true,
    });

    nextContext[REMOVE_IMAGE_REF](this.element);

    this.timer = setTimeout(
      () =>
        this.setState({
          startAnimation: true,
        }),
      nextProps.animateDisappearInSecond * 1000 || 500,
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
    this.element = null;
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
      animateStartStyle,
      animateEndStyle,
    } = this.props;
    const { startAnimation, loaded } = this.state;
    const disappearInSecond = animateDisappearInSecond || 0.5;

    return (
      <span
        style={{
          position: 'relative',
        }}
        className={className}
      >
        <img
          {...{ width, height, style, srcSet }}
          alt={alt}
          ref={element => {
            this.element = element;
          }}
          src={loaded ? src : placeHolderSrc}
          data-src={src}
        />
        <Animate
          startAnimation={startAnimation}
          durationSeconds={disappearInSecond}
          startStyle={animateStartStyle || { opacity: 1 }}
          endStyle={animateEndStyle || { opacity: 0 }}
        >
          <img
            {...{ width, height, srcSet }}
            alt={alt}
            ref={element => {
              this.element = element;
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            src={placeHolderSrc}
            data-src={src}
          />
        </Animate>
      </span>
    );
  }
}
