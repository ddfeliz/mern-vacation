// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import du Provider de react-redux
import store from './store'; // Import du store Redux

import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      {/* Le Provider enveloppe votre application et y injecte le store */}
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
