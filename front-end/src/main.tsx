import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Background from './components/Background/Background';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Background />
    <App />
  </StrictMode>
);
