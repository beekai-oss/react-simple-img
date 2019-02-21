// @flow
export type Style = { [string]: number | string };

export type State = {
  loaded: boolean,
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
  animationEndStyle?: Style,
  importance?: 'low' | 'high',
};
