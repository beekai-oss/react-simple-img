<p align="center">
    <img width="675" src="https://raw.githubusercontent.com/yusinto/react-simple-img/master/assets/logo.jpg" alt="Logo" />
</p>

[![npm version](https://img.shields.io/npm/v/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm downloads](https://img.shields.io/npm/dm/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm](https://img.shields.io/npm/dt/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm](https://img.shields.io/npm/l/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-lazyload-image)

> **Smart react image with IntersectionObserver API and animations** :clap:

Why this package?

* Speed up initial page loads by loading only images above the fold 
* Responsive with placeholders and animations
* Smart download logic using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
* Simple usage and tiny size

## Installation
```bash
yarn add react-simple-img
```

## Demo
Check it out [here](https://react-simple-img.herokuapp.com/) 😍

## Basic usage
```js
import react from 'react';
import { SimpleImg, SimpleImgProvider } from 'react-simple-img';

const App = () => <div>
  <SimpleImg src="/path/to/image" />
</div>;

// Wrap your app once with the provider 
export default SimpleImgProvider(App);
```

## Usage with placeholder and animation
TODO

## API

#### 🔗 `SimpleImgProvider([Component], [config])`

This high order component will connect all your Image component to observe images to be loaded.

Arguments

* [Component]: (React Component) react component

* [config]: (Object) this argument is optional


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

### 🔗 `SimpleImg`

Image component working similar with standard `img` tag and with the following props.

| Prop                | Type   | Required | Description                                                               |
| :------------------ | :----- | :------: | :-------------------------------------------------------------------------|
| `src`               | string |    ✓     | The large image source                                                    |
| `srcSet`            | string |          | Responsive images eg: `large.jpg 2x, small.jpg`                           |
| `placeholder`       | string |          | Placeholder image (svg, jpg, png, ...) or color (white, red, blue, ...)   |
| `width`             | number |          | Width of image. Also applies to placeholder.                              |
| `height`            | number |          | Height of image. Also applies to placeholder.                             |
| `imgClassName`      | string |          | Class of image. Also applies to placeholder.                              |
| `sizes`             | string |          |                                                                           |
| `alt`               | string |          |                                                                           |
