import React from 'react';
import PropTypes from 'prop-types';
import Animate from 'react-simple-animate';
import { APPEND_IMAGES_REF, IMAGES_LOADED, REMOVE_IMAGE_REF } from './ProgresssiveImages';

export default class ProgressiveImage extends React.Component {
  static contextTypes = {
    [APPEND_IMAGES_REF]: PropTypes.func,
    [IMAGES_LOADED]: PropTypes.array,
    [REMOVE_IMAGE_REF]: PropTypes.func,
  };

  state = {
    startAnimation: true,
    loaded: false,
  };

  element = null;
  timer = null;

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.state.loaded || !nextContext[IMAGES_LOADED].find(element => this.element === element)) return;

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
      100,
    );
  }

  componentDidMount() {
    this.element && this.context[APPEND_IMAGES_REF](this.element);
  }

  componentWillUnmount() {
    this.timer = null;
    this.element = null;
  }

  render() {
    const { src, placeHolderSrc, className, style, width, height, alt, srcSet } = this.props;
    const { startAnimation, loaded } = this.state;

    return (
      <Animate
        startAnimation={startAnimation}
        durationSeconds={startAnimation ? 0.3 : 0.01}
        startStyle={{ opacity: 0 }}
        endStyle={{ opacity: 1 }}
      >
        <img
          ref={element => (this.element = element)}
          {...{ width, height, className, style, srcSet }}
          alt={alt}
          src={loaded ? src : placeHolderSrc}
          data-src={src}
          data-id="image"
        />
      </Animate>
    );
  }
}
