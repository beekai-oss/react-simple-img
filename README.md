<p align="center">
    <img width="675" src="https://raw.githubusercontent.com/bluebill1049/react-simple-img/master/example/src/logo.png" alt="React Simple Img Logo - Animated lazy loading - on demand" />
</p>

[![npm version](https://img.shields.io/npm/v/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm downloads](https://img.shields.io/npm/dm/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm](https://img.shields.io/npm/dt/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-simple-img)
[![npm](https://img.shields.io/npm/l/react-simple-img.svg?style=flat-square)](https://www.npmjs.com/package/react-lazyload-image)

> **Make responsive image lazy load simple and faster page load** :clap:

Features:

* Boost your web pages performance due to large images
* Make images lazy load easy
* Support responsive images with `srcset`
* Use `IntersectionObserver` API
* Support placeholder (image/placeholder color) for transition
* Super easy to use and small size

## Install

    $ yarn add react-simple-img@0.0.1-beta.18
    or
    $ npm install react-simple-img@0.0.1-beta.18 -S

## Example

Navigate into `example` folder and install

    $ yarn && yarn start
    or
    $ npm install && npm run start

<a href="https://react-simple-img.herokuapp.com/" target="_blank">Check out the interactive demo.</a> 😍

**Tip for the following effect**

To generate svg placeholder, please install [SQIP](https://github.com/technopagan/sqip/) to generate placeholders.

<p align="center">
    <a href="https://react-simple-img.herokuapp.com/" target="_blank">
        <img width="300" src="https://raw.githubusercontent.com/bluebill1049/react-simple-img/master/example/src/example.gif" alt="Logo" />
    </a>
</p>

## Quick start

    import { SimpleImg, init } from './react-lazyLoad-images';

    init();

    export const App = () => <div>
        <SimpleImg height={500} src="your image path" />
    </div>;

## API

#### 🔗 `init([config])` optional

This function will set up global intersection observer and watch all `<SimpleImg />` appear in the viewport through your
app

Arguments

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

#### 🔗 `SimpleImgProvider([Component], [config])`

This high order component will connect all your `SimpleImg` to be observed per section, and **overwrite global config by
`init()`**.

Arguments

* [Component]: (React Component) react component

* [config]: (Object) this argument is optional (same as `init` config argument)

### 🔗 `SimpleImg`

Image component working similar with standard `img` tag and with the following props.

| Prop           | Type   | Required | Description                                                                                                                                                                                                        |
| :------------- | :----- | :------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`          | string |    ✓     | The large image source                                                                                                                                                                                             |
| `srcSet`       | string |          | eg: `large.jpg 2x, small.jpg` <br /><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" target="_blank">Reference for examples</a>                            |
| `sizes`        | string |          | eg: `(max-width: 320px) 280px, (max-width: 480px) 440px` <br /><a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" target="_blank">Reference for examples</a> |
| `placeholder`  | string |          | Placeholder image source (svg, jpg, png...) or css color value (`white, linear-gradient(blue, pink)`)                                                                                                              |
| `imgClassName` | string |          | class for the image itself, which also applied to the placeholder                                                                                                                                                  |
| `width`        | number |          | image width apply to original image and placeholder                                                                                                                                                                |
| `height`       | number |          | image height apply to original image and placeholder                                                                                                                                                               |
| `alt`          | string |          |                                                                                                                                                                                                                    |

## Advance Example

Set up React Simple Img per page, you can use the following example without `init()`😘

    import { SimpleImg, SimpleImgProvider } from './react-simple-img';

    const Home = () => <div>
        // placeholder background color example
        <SimpleImg
            height={500}
            placeholderColor="linear-gradient(rgb(30, 87, 153) 0%, rgb(125, 185, 232) 100%)"
            src="your image path"
        />

        // placeholder background image example
        <SimpleImg
            height={500}
            placeholderSrc="your placeholder svg or image path"
            src="your image path" />
    </div>;

    export default SimpleImgProvider(App, {
        threshold: [0.5], // load image when 50 percentage of image in the view port
    });
