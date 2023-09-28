import { getAnalytics } from 'firebase/analytics';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { app } from './firebase';

export const analytics = getAnalytics(app);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
