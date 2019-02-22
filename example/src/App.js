import React from 'react';
import { SimpleImg } from 'react-simple-img';
import Logo from './logo.png';
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

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SimpleImg src={Logo} alt="logo" height={150} />
      </header>
      <div className="App-container">
        {images.map((image, i) => (
          <SimpleImg
            alt="whatever"
            key={i}
            placeholder={image.svg}
            animationDuration={3}
            src={image.img}
            applyAspectRatio
            width={800}
            height={500}
          />
        ))}
      </div>
    </div>
  );
}
