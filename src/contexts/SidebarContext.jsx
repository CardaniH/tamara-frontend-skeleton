// src/contexts/SidebarContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [gestionOpen, setGestionOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => {
      const newValue = !prev;
      console.log('Sidebar toggled:', newValue);
      return newValue;
    });
  }, []);

  const closeSidebar = useCallback(() => {
    console.log('Closing sidebar');
    setSidebarOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    console.log('Opening sidebar');
    setSidebarOpen(true);
  }, []);

  return (
    <SidebarContext.Provider value={{
      sidebarOpen,
      gestionOpen,
      setGestionOpen,
      toggleSidebar,
      closeSidebar,
      openSidebar
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};
