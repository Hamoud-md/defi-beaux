import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { I18nProvider } from './i18n/I18nContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Element racine #root introuvable dans le document.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
