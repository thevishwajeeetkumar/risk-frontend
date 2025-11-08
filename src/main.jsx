import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';

const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <App />
        </AuthProvider>
        <ToastContainer position="top-right" autoClose={2500} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
