import React, { Component } from 'react';
import Logo from './logo.jpg';
import svg1 from './wallpapers/Isles.svg';
import svg2 from './wallpapers/Lake.svg';
import svg3 from './wallpapers/Mountain-Range.svg';
import svg4 from './wallpapers/Pink-Forest.svg';
import svg5 from './wallpapers/Snow.svg';
import svg6 from './wallpapers/Lion.svg';
import image1 from './wallpapers/Isles.jpg';
import image2 from './wallpapers/Lake.jpg';
import image3 from './wallpapers/Mountain-Range.jpg';
import image4 from './wallpapers/Pink-Forest.jpg';
import image5 from './wallpapers/Snow.jpg';
import image6 from './wallpapers/Lion.jpg';
import { SimpleImg, SimpleImgProvider } from 'react-simple-img';
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
  {
    img: image6,
    svg: svg6,
  },
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <SimpleImg src={Logo} wrapperClassName="App-logo" alt="logo" backgroundColor="white" />
        </header>
        <div className="App-container">
          {images.map((image, i) => <SimpleImg
            alt="whatever"
            key={i}
            placeHolderSrc={image.svg}
            animationDuration={3}
            src={image.img}
            height={500}
          />)}
        </div>
      </div>
    );
  }
}

export default SimpleImgProvider(App, {
  rootMargin: '20px 0px',
  threshold: [0.25, 0.5, 0.75],
});
