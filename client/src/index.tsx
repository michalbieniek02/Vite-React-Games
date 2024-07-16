import './index.css';
import React from 'react';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { createRoot } from 'react-dom/client';

const element = document.getElementById('root');
const root = createRoot(element!);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
