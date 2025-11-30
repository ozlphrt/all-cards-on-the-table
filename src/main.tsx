import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use base path for production (GitHub Pages), empty for dev
    const basePath = window.location.hostname === 'ozlphrt.github.io' ? '/all-cards-on-the-table' : '';
    navigator.serviceWorker.register(`${basePath}/sw.js`)
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

