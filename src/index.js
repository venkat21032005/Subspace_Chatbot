import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TestApp from './TestApp';

// Switch between test and full app
// Set to true when backend is ready
const USE_FULL_APP = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {USE_FULL_APP ? <App /> : <TestApp />}
  </React.StrictMode>
);