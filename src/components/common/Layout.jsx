import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useSidebar } from '../../contexts/SidebarContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const { 
    sidebarOpen, 
    gestionOpen, 
    setGestionOpen, 
    toggleSidebar, 
    closeSidebar 
  } = useSidebar();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // ✅ USEEFFECT CORREGIDO
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // SOLO auto-cerrar en la transición inicial desktop -> móvil
      // NO cuando el usuario abre manualmente el sidebar
    };

    checkScreenSize(); // Ejecutar al cargar
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []); // ← SIN DEPENDENCIAS PROBLEMÁTICAS

  // ✅ USEEFFECT SEPARADO PARA DETECTAR CAMBIO A MÓVIL
  useEffect(() => {
    // Solo cerrar automáticamente cuando se detecta por primera vez que es móvil
    if (isMobile && window.innerWidth < 1024) {
      // Pequeño delay para evitar conflictos con toggles manuales
      const timer = setTimeout(() => {
        if (isMobile) closeSidebar();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile]); // Solo escucha cambios en isMobile

  // SOLO ADMINISTRADORES VEN "GESTIÓN"
  const adminItems = [
    { title: "Dashboard", path: "/dashboard", icon: "📊" },
    {
      title: "Gestión",
      icon: "🛠️",
      submenu: [
        { title: "Departamentos", path: "/departments", icon: "🏢" },
        { title: "Subdepartamentos", path: "/subdepartments", icon: "🏗️" },
      ],
    },
    { title: "Tareas", path: "/tasks", icon: "✅" },
    { title: "Calendario", path: "/calendar", icon: "📅" },
    { title: "SharePoint", path: "/documents", icon: "📁" },
    { title: "Usuarios", path: "/users", icon: "👥" },
  ];

  const employeeItems = [
    { title: "Dashboard", path: "/dashboard", icon: "📊" },
    { title: "Mis Tareas", path: "/tasks", icon: "✅" },
    { title: "Mi Calendario", path: "/calendar", icon: "📅" },
    { title: "SharePoint", path: "/documents", icon: "📁" },
  ];

  const navItems = user?.role_id === 1 ? adminItems : employeeItems;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform
                   ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                   transition-transform duration-300 ease-in-out`}
      >
        {/* Header del Sidebar */}
        <header className="h-16 flex items-center justify-between px-6 bg-blue-600 text-white">
          <h1 className="font-bold">Intranet Tamara</h1>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-blue-700 rounded transition-colors text-white font-bold"
            aria-label="Cerrar sidebar"
          >
            ✕
          </button>
        </header>

        {/* Info del Usuario */}
        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">
                {user?.role?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="mt-4 px-2 space-y-1">
          {navItems.map((item) => {
            if (item.submenu) {
              const isOpen = gestionOpen;
              return (
                <div key={item.title}>
                  <button
                    onClick={() => setGestionOpen(!gestionOpen)}
                    className={`flex w-full items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors
                               ${isOpen ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((sub) => {
                        const active = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                       ${active ? "bg-blue-100 text-blue-700 border-l-2 border-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                          >
                            <span className="mr-2 text-lg">{sub.icon}</span>
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            } else {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-5 py-3 rounded-lg text-sm font-medium transition-colors
                             ${active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.title}
                </Link>
              );
            }
          })}
        </nav>

        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          className="absolute bottom-0 left-0 w-full flex items-center px-5 py-3 text-red-600 bg-red-50 hover:bg-red-100 text-sm"
        >
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : ''}`}>
        {/* Top bar */}
        <header className="sticky top-0 bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6 z-30">
          {/* BOTÓN HAMBURGUESA - Siempre visible en móvil */}
          <button
            onClick={toggleSidebar}
            className={`mr-4 p-2 text-gray-500 hover:text-gray-700 rounded transition-colors
           ${isMobile ? '' : (sidebarOpen ? 'hidden' : 'block')}`}

          >
            ☰
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find((i) => i.path === location.pathname)?.title || "Dashboard"}
          </h2>

          <div className="ml-auto flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Sistema Online</span>
            <span className="text-xs text-gray-400 ml-2">
              {isMobile ? '📱' : '🖥️'}
            </span>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay móvil */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
