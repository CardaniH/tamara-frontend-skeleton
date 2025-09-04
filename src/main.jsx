
import './index.css'
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SidebarProvider } from './contexts/SidebarContext.jsx'; // ← Añade esto

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>  ← Comenta StrictMode temporalmente
    <SidebarProvider>  {/* ← Envuelve aquí */}
      <App />
    </SidebarProvider>
  // </React.StrictMode>
);
