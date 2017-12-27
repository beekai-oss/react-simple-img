# React Lazyload Image
### Under development

[![npm version](https://img.shields.io/npm/v/react-lazyload-image.svg?style=flat-square)](https://www.npmjs.com/package/react-lazyload-image) [![npm downloads](https://img.shields.io/npm/dm/react-lazyload-image.svg?style=flat-square)](https://www.npmjs.com/package/react-lazyload-image) [![npm](https://img.shields.io/npm/dt/react-lazyload-image.svg?style=flat-square)](https://www.npmjs.com/package/react-lazyload-image) [![npm](https://img.shields.io/npm/l/react-lazyload-image.svg?style=flat-square)](https://www.npmjs.com/package/react-lazyload-image)

> **Make image load simple and web page load faster** :clap:

Features:

 - Boost your web app performance due to large images
 - Make image lazy load easy
 - Use `IntersectionObserver` API to welcome the future web
 - Support old browsers
 - Super easy to use
 - Tiny size

## Install

    $ yarn add react-lazyload-images
    or
    $ npm install react-lazyload-images -S

## Example

Navigate into `example` folder and install

    $ yarn && yarn start
    or
    $ npm install && npm run start

Screenshots of the example app below

## Quick start
    import react from 'react';
    import { Image, withLazyLoadImages } from './react-lazyLoad-images';

    function SexyComponent(props) {
	    return <div>
            <Image
                className="class"
                placeHolderSrc={image.svg}
                src={image.img}
                />
        </div>;
    }

    export default withLazyLoadImages(SexyComponent);

## API

#### `withLazyLoadImages([Component], [config])`

This high order component will connect all your Image component to observe images to be loaded.

Arguments
[`Component`]: react component
[`config`] (`Object`): this argument is optional


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

### `Image`

| Prop | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `src` | string | ✓ | The large image source |
| `placeHolderSrc` | string | ✓ | Placeholder image source (svg, jpg, png...) |
| `width` | number | ✓ | image width apply to original image and placeholder |
| `height` | number | ✓ | image height apply to original image and placeholder |
| `style` | object | ✓ | only applied to large image |
| `placeHolderBackgroundColor` | string | ✓ | apply color style to the placeholder  |
| `animateDisappearInSecond` | string | ✓ | animation duration for placeholder to disappear  |
| `animateDisappearStyle` | object | ✓ | style applied to make placeholder disappear (default to fade out as `{opacity: 0}`)  |
| `className` | string | ✓ |  |
| `alt` | string | ✓ | |
| `srcSet` | string | ✓ | |