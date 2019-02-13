<p align="center">
    <a href="https://react-simple-img.herokuapp.com/"><img width="675" src="https://raw.githubusercontent.com/bluebill1049/react-simple-img/master/example/src/logo.png" alt="React Simple Img Logo - Animated lazy loading - on demand" /></a>
</p>

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=React+Lazy+load+images+with+Intersection+Observer+API&url=https://github.com/bluebill1049/react-simple-img)&nbsp;[![CircleCI](https://circleci.com/gh/bluebill1049/react-simple-img.svg?style=svg)](https://circleci.com/gh/bluebill1049/react-simple-img) [![Coverage Status](https://coveralls.io/repos/github/bluebill1049/react-simple-img/badge.svg?branch=master)](https://coveralls.io/github/bluebill1049/react-simple-img?branch=master) [![npm downloads](https://img.shields.io/npm/dm/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm](https://img.shields.io/npm/dt/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm](https://img.shields.io/npm/l/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-lazyload-image)

> **Smart react lazy load image with IntersectionObserver API and animations** :clap:

- Speed up initial page loads by loading only images above the fold
- Responsive with placeholders and animations
- Smart download logic using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- Simple usage and tiny size

## Install

    npm install react-simple-img

## Example

<p align="center">
    <a href="https://react-simple-img.herokuapp.com/" target="_blank">
        <img width="600" src="https://raw.githubusercontent.com/bluebill1049/react-simple-img/master/example/src/example.gif" alt="Logo" />
    </a>
</p>

Navigate into `example` folder and install

    npm install && npm run start

😍 <a href="https://react-simple-img.herokuapp.com/" target="_blank">Check it out.</a>

**Tip for the above effect**

To generate svg placeholder, please install [SQIP](https://github.com/technopagan/sqip/) to generate placeholders.

## Quickstart

```jsx
import { SimpleImg, initSimpleImg } from 'react-simple-img';

initSimpleImg(); // run once at your root component or at file which calls `ReactDOM.render`

export default () => <SimpleImg height={500} src="your image path" />;
```

## API

#### 🔗 `initSimpleImg([config], disableAnimateCachedImg)` optional

This function will set up **global** intersection observer and watch all `<SimpleImg />` appear in the viewport through your
entire app

Arguments

- **config**: (Object) this argument is <b>optional</b>


     - [root]: The element that is used as the viewport for checking
       visiblity of the target. Must be the ancestor of the target. Defaults
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

- **disableAnimateCachedImg**: (boolean) this argument is <b>optional</b>


     - if you want to disable the reveal animation after image have been cached

#### 🔗 `SimpleImgProvider([Component], [config])` <b>optional</b>

This high order component will connect all your `SimpleImg` to be observed per section, and **overwrite global config by
`initSimpleImg()`**.

Arguments

- **Component**: (Component) react component

- **config**: (Object) this argument is optional (same as `initSimpleImg` config argument)

#### 🔗 `SimpleImg`

Image component working similar with standard `img` tag and with the following props.

| Prop                | Type    | Required | Description                                                                                                                                                                                                        |
| :------------------ | :------ | :------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`               | string  |    ✓     | The large image source                                                                                                                                                                                             |
| `srcSet`            | string  |          | eg: `large.jpg 2x, small.jpg` <br /><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" target="_blank">Reference for examples</a>                            |
| `sizes`             | string  |          | eg: `(max-width: 320px) 280px, (max-width: 480px) 440px` <br /><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" target="_blank">Reference for examples</a> |
| `placeholder`       | string  |          | Placeholder image source (svg, jpg, png...) or css color value (`white, linear-gradient(blue, pink)`)                                                                                                              |
| `applyAspectRatio`  | boolean |          | image will scale automatically with aspect ratio, note width and height will need to be supplied.                                                                                                                  |
| `wrapperStyle`      | Object  |          | inline style for root wrapper                                                                                                                                                                                      |
| `wrapperClassName`  | string  |          | className for element wrapping img tag                                                                                                                                                                             |
| `imgClassName`      | string  |          | class for the image itself, which also applied to the placeholder                                                                                                                                                  |
| `animationDuration` | number  |          | animation duration in seconds <br />passed as `durationSeconds` to [react-simple-animate](https://github.com/bluebill1049/react-simple-animate#api)                                                                |
| `animationEndStyle` | Object  |          | style to transition to <br />passed as `endStyle` to [react-simple-animate](https://github.com/bluebill1049/react-simple-animate#api)                                                                              |

## Advance Example

Set up React Simple Img per page, you can use the following example without `initSimpleImg()`😘

```jsx
import { SimpleImg, SimpleImgProvider } from 'react-simple-img';

export default () => (
  <SimpleImgProvider
    config={{
      threshold: [0.5], // load image when 50 percentage of image in the view port
    }}
  >
    // placeholder background color example
    <SimpleImg
      height={500}
      placeholder="linear-gradient(rgb(30, 87, 153) 0%, rgb(125, 185, 232) 100%)"
      src="your image path"
    />
    // placeholder background image example
    <SimpleImg height={500} placeholder="your placeholder svg or image path" src="your image path" />
  </SimpleImgProvider>
);
```

## Reference

https://medium.com/jsdownunder/optimising-web-page-a-simple-step-66f7f4ba417c
