<p align="center">
    <a href="https://react-simple-img.now.sh"><img width="180" src="https://raw.githubusercontent.com/bluebill1049/react-simple-img/master/example/src/logo.png" alt="React Simple Img Logo - Animated lazy loading - on demand" /></a>
</p>

<h1 align="center"><a href="https://react-simple-img.now.sh">React Simple Img</a></h1>

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=React+Lazy+load+images+with+Intersection+Observer+API&url=https://github.com/bluebill1049/react-simple-img)&nbsp;[![CircleCI](https://circleci.com/gh/bluebill1049/react-simple-img.svg?style=svg)](https://circleci.com/gh/bluebill1049/react-simple-img) [![Coverage Status](https://coveralls.io/repos/github/bluebill1049/react-simple-img/badge.svg?branch=master)](https://coveralls.io/github/bluebill1049/react-simple-img?branch=master) [![npm downloads](https://img.shields.io/npm/dm/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm](https://img.shields.io/npm/dt/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm](https://badgen.net/bundlephobia/minzip/react-simple-img)](https://badgen.net/bundlephobia/minzip/react-simple-img)

> **Smart react lazy load image with IntersectionObserver API, Priority Hints and animations** :clap:

- Speed up initial page loads by loading only images above the fold
- Responsive with placeholders and animations
- Support [Priority Hints](https://developers.google.com/web/updates/2019/02/priority-hints) with importance attribute
- Smart download logic using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- Simple usage and tiny size includes polyfill (minified + gzipped)

## Install

    npm install react-simple-img

## Quickstart

```jsx
import { SimpleImg } from 'react-simple-img';

export default () => <SimpleImg height={500} src="your image path" />;
```

## API

##### 🔗 `SimpleImg`

Image component working similar with standard `img` tag and with the following props.

| Prop                | Type    | Required | Description                                                                                                                                                                                                        |
| :------------------ | :------ | :------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`               | string  |    ✓     | The large image source                                                                                                                                                                                             |
| `srcSet`            | string  |          | eg: `large.jpg 2x, small.jpg` <br /><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" target="_blank">Reference for examples</a>                            |
| `sizes`             | string  |          | eg: `(max-width: 320px) 280px, (max-width: 480px) 440px` <br /><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" target="_blank">Reference for examples</a> |
| `importance`        | string  |          | Priority Hints with "low" or "auto": set to "auto" will load image after <b>load</b> event, otherwise "low" will load images after <b>load</b> event and lazy load with <b>intersection observer</b>               |
| `placeholder`       | string  |          | Placeholder image source (svg, jpg, png...) or css color value (`white, linear-gradient(blue, pink)`), set to `false` will remove placeholder.       |
| `applyAspectRatio`  | boolean |          | Image will scale automatically with aspect ratio. Note: width and height will need to be supplied                                                                                                                  |
| `animationDuration` | number  |          | animation duration in seconds                                                                                                                                                                                      |

##### 🔗 `initSimpleImg([config], disableAnimationAfterCache = false, logConsoleError = false)` optional

This function is only required, when you want to customise intersection observer configuration.

Arguments

- **config**: (Object) this argument is <b>optional</b>


     - [root]: The element that is used as the viewport for checking
       visibility of the target. Must be the ancestor of the target. Defaults
       to the browser viewport if not specified or if null.

     - [rootMargin]: Margin around the root. Can have values similar to the
       CSS margin property, e.g. "10px 20px 30px 40px" (top, right, bottom,
       left). If the root element is specified, the values can be
       percentages. This set of values serves to grow or shrink each side of
       the root element's bounding box before computing intersections.
       Defaults to all zeros.

     - [threshold]: Either a single number or an array of numbers which
       indicate at what percentage of the target's visibility the observer's
       callback should be executed. If you only want to detect when
       visibility passes the 50% mark, you can use a value of 0.5. If you
       want the callback run every time visibility passes another 25%, you
       would specify the array [0, 0.25, 0.5, 0.75, 1]. The default is 0
       (meaning as soon as even one pixel is visible, the callback will be
       run). A value of 1.0 means that the threshold isn't considered passed
       until every pixel is visible.

- **disableAnimationAfterCache**: (boolean) this argument is <b>optional</b>


     - if you want to disable the reveal animation after image have been cached

- **logConsoleError**: (boolean) this argument is <b>optional</b>


     - if you want to log errors in browser console when image fetch failed, then set the value to true.

## Contributors 
Thanks goes to these wonderful people:

<p float="left">
    <a href="https://github.com/elrumordelaluz"><img src="https://avatars3.githubusercontent.com/u/784056?s=460&v=4" width="50" height="50" /></a>
    <a href="https://github.com/millette"><img src="https://avatars2.githubusercontent.com/u/50741?s=460&v=4" width="50" height="50" /></a>
    <a href="https://github.com/revskill10"><img src="https://avatars1.githubusercontent.com/u/1390196?s=460&v=4" width="50" height="50" /></a>
    <a href="https://github.com/infernalmaster"><img src="https://avatars3.githubusercontent.com/u/1155618?s=460&v=4" width="50" height="50" /></a>
    <a href="https://github.com/five-zero-four-zero"><img src="https://avatars3.githubusercontent.com/u/6634204?s=460&v=4" width="50" height="50" /></a>
    <a href="https://github.com/DeBaum"><img src="https://avatars0.githubusercontent.com/u/11390506?s=460&v=4" width="50" height="50" /></a>
    <a href="https://github.com/0xflotus"><img src="https://avatars2.githubusercontent.com/u/26602940?s=460&v=4" width="50" height="50" /></a>
    <a href="https://github.com/yusinto"><img src="https://avatars1.githubusercontent.com/u/1593077?s=460&v=4" width="50" height="50" /></a>
</p>
