import * as React from "react";

export interface State {
  isDocumentLoad: boolean;
  isCached: boolean;
}

export interface Props {
  src: string;
  placeholder?: string | boolean;
  applyAspectRatio?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  sizes?: string;
  srcSet?: string;
  style?: React.CSSProperties;
  animationDuration?: number;
  importance?: "low" | "auto";
  onComplete?: VoidFunction;
  imgStyle?: React.CSSProperties;
}

export interface Config {
  root?: HTMLElement;
  rootMargin?: string;
  threshold?: number | Array<number>;
}

export class SimpleImg extends React.Component<Props, State> {
  public render(): JSX.Element;
}

export function initSimpleImg(
  config?: Config,
  disableAnimateCachedImg?: boolean,
  logConsoleError?: boolean
): undefined;
