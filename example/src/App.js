import React, { Component } from 'react';
import logo from './logo.svg';
import svg1 from './wallpapers/Isles.svg';
import svg2 from './wallpapers/Lake.svg';
import svg3 from './wallpapers/Mountain-Range.svg';
import svg4 from './wallpapers/Pink-Forest.svg';
import svg5 from './wallpapers/Snow.svg';
import image1 from './wallpapers/Isles.jpg';
import image2 from './wallpapers/Lake.jpg';
import image3 from './wallpapers/Mountain-Range.jpg';
import image4 from './wallpapers/Pink-Forest.jpg';
import image5 from './wallpapers/Snow.jpg';
import { Image, withImagesObserved } from 'react-lazyload-images';
import './App.css';

const images = [
  {
    img: image1,
    svg: svg1,
  },
  {
    img: image2,
    svg: svg2,
  },
  {
    img: image3,
    svg: svg3,
  },
  {
    img: image4,
    svg: svg4,
  },
  {
    img: image5,
    svg: svg5,
  },
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React Lazy Load Images</h1>
          <p><span role="img" aria-label="glass">🍸</span> Scroll slowly to view the transition and image lazy load</p>
        </header>
        <div className="App-container">
          {images.map((image, i) => <Image
            alt="whatever"
            key={i}
            className="App-images"
            placeHolderSrc={image.svg}
            animateDisappearInSecond={2.5}
            src={image.img}
            style={{ display: 'block' }}
            height={500}
          />)}
        </div>
      </div>
    );
  }
}

export default withImagesObserved(App, {
  rootMargin: '20px 0px',
  threshold: [0.25, 0.5, 0.75],
});
