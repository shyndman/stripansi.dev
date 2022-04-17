import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.scss';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root') as HTMLElement;
const rootJsx = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, rootJsx);
} else {
  ReactDOM.createRoot(rootElement).render(rootJsx);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
