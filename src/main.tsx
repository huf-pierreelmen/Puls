import React from 'react';
import ReactDOM from 'react-dom/client';
import '@hufvudstaden/design-system/styles.css';
import '@hufvudstaden/design-system/brands/hufvudstaden.css';
import '@hufvudstaden/design-system/fonts/hufvudstaden.css';
import './styles.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
