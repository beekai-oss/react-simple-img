declare module "react-simple-img" {
  import * as React from "react";

  interface State {
    isDocumentLoad: boolean;
    isCached: boolean;
  }

  interface Props {
    src: string;
    placeholder?: string | boolean;
    applyAspectRatio?: boolean;
    className?: string;
    width?: number;
    height?: number;
    alt?: string;
    sizes?: string;
    srcSet?: string;
    style?: React.CSSProperties;
    animationDuration?: number;
    importance?: "low" | "high";
    onComplete?: VoidFunction;
    imgStyle?: React.CSSProperties;
  }

  declare class SimpleImg extends React.Component<Props, State> {
    public render(): JSX.Element;
  }

  interface Config {
    root?: HTMLElement;
    rootMargin?: string;
    threshold?: number | Array<number>;
  }

  declare function initSimpleImg(
    config?: Config,
    disableAnimateCachedImg: boolean = false,
    logConsoleError: boolean = false
  );

  export { SimpleImg, initSimpleImg };
}
