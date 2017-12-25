import React, { Component } from 'react';
import logo from './logo.svg';
import ProgresssiveImages from './ProgresssiveImages';
import ProgressiveImage from './ProgressiveImage';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ProgressiveImage
          alt="test"
          placeHolderSrc="https://deanhume.github.io/lazy-observer-load/img/dog-running.svg"
          src="https://cdn.images.express.co.uk/img/dynamic/151/590x/big-bang-818018.jpg"
          style={{ display: 'block' }}
          height={500}
        />
        <ProgressiveImage
          alt="test"
          placeHolderSrc="https://deanhume.github.io/lazy-observer-load/img/dog-running.svg"
          src="https://www.visitnsw.com/nsw-tales/wp-content/uploads/2013/08/The-Big-Playable-Guitar-Image-Credit-Bec-Flickr.jpg"
          style={{ display: 'block' }}
          height={500}
        />
        <ProgressiveImage
          alt="test"
          placeHolderSrc="https://deanhume.github.io/lazy-observer-load/img/dog-running.svg"
          src="https://calendar.perfplanet.com/wp-content/uploads/2017/12/image3.png"
          style={{ display: 'block' }}
          height={500}
        />
        <ProgressiveImage
          alt="test"
          placeHolderSrc="https://deanhume.github.io/lazy-observer-load/img/dog-running.svg"
          src="https://calendar.perfplanet.com/wp-content/uploads/2017/12/image4.png"
          style={{ display: 'block' }}
          height={500}
        />
      </div>
    );
  }
}

export default ProgresssiveImages(App, {
  rootMargin: '50px 0px',
  threshold: 0.01,
});
