import { getAnalytics } from 'firebase/analytics';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { firebaseApp } from './firebase';

export const analytics = getAnalytics(firebaseApp);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
