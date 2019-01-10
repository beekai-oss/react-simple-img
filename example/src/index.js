import React from 'react';
import ReactDOM from 'react-dom';
import { initSimpleImg } from 'react-simple-img';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

initSimpleImg();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
