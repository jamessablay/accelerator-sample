
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// The compiled stylesheet. Replaces the Tailwind CDN <script>, which shipped a
// JIT compiler to the browser and generated the whole stylesheet at runtime on
// every load, on a third party network path that a corporate firewall could
// block into an unstyled deck.
import './styles/app.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Dev-only. Asserts the five silent string joins between the data files
// (segment keys, emblem titles, persona categories, asset paths, budget totals).
// Tree shaken out of the production bundle.
if (import.meta.env.DEV) {
  import('./data/__integrity').then((m) => m.runIntegrityChecks());
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
