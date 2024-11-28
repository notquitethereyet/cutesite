import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/catppuccin.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error("Root element not found. Make sure there's a <div id='root'></div> in your index.html.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
