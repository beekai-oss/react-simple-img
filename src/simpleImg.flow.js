// @flow
export type Style = { [string]: number | string };

export type State = {
  isDocumentLoad: boolean,
  isCached: boolean,
};

export type Props = {
  src: string,
  placeholder?: string | boolean,
  applyAspectRatio?: boolean,
  className?: string,
  width?: number,
  height?: number,
  alt?: string,
  sizes?: string,
  srcSet?: string,
  style?: Style,
  animationDuration?: number,
  importance?: 'low' | 'auto',
  onComplete?: () => void,
  imgStyle: Style,
};
