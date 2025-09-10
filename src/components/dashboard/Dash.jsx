import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import apiClient from '../../utils/apiClient.js';

// Importes para dashboards específicos con lazy loading
const AdminGlobalDash = React.lazy(() => import('./roles/AdminGlobalDash.jsx'));
const DirectorDash = React.lazy(() => import('./roles/DirectorDash.jsx'));
const JefeDash = React.lazy(() => import('./roles/JefeDash.jsx'));
const EmpleadoDash = React.lazy(() => import('./roles/EmpleadoDash.jsx'));
const AuditorDash = React.lazy(() => import('./roles/AuditorDash.jsx'));
const PrestadorDash = React.lazy(() => import('./roles/PrestadorDash.jsx'));

// Configuración de roles y dashboards
const ROLE_DASHBOARDS = {
  1: { component: AdminGlobalDash, name: 'Admin' },
  2: { component: DirectorDash, name: 'Director' },
  3: { component: JefeDash, name: 'Jefe' },
  4: { component: EmpleadoDash, name: 'Empleado' },
  5: { component: AuditorDash, name: 'Auditor' },
  6: { component: PrestadorDash, name: 'Prestador' }
};

// Componente de loading reutilizable
const LoadingSpinner = ({ message = "Cargando..." }) => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

// Componente de error
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-red-600 mb-4">
      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar el dashboard</h3>
    <p className="text-red-600 text-sm mb-4">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    )}
  </div>
);

// Indicador de estado de datos en vivo
const LiveDataIndicator = ({ lastUpdate, isRefreshing, sharePointData, onRefresh }) => (
  <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${sharePointData ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {sharePointData ? 'SharePoint Conectado' : 'Conectando...'}
          </span>
          {isRefreshing && (
            <span className="text-xs text-blue-600">Actualizando datos...</span>
          )}
        </div>

        {sharePointData && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Documentos: {sharePointData.sharepoint_docs || 0}</span>
            <span>Sitio: {sharePointData.sharepoint_site_name || 'No conectado'}</span>
            {lastUpdate && (
              <span>Actualizado: {lastUpdate.toLocaleTimeString()}</span>
            )}
          </div>
        )}
      </div>

      <button
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <span>{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
      </button>
    </div>
  </div>
);

export default function Dash() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (!dashboardData) {
        setLoading(true);
      }
      
      setError(null);
      
      const response = await apiClient.get('/api/dashboard/stats');
      
      if (response.data.success) {
        setDashboardData(response.data.data);
        setLastUpdate(new Date());
        
        // Log para debugging - datos SharePoint
        console.log('Dashboard Data Updated:', {
          timestamp: new Date().toLocaleTimeString(),
          sharepoint_docs: response.data.data.sharepoint_docs,
          new_docs_week: response.data.data.new_docs_week,
          sharepoint_site: response.data.data.sharepoint_site_name
        });
      } else {
        setError(response.data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Error de conexión');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch inicial y polling automático
  useEffect(() => {
    fetchDashboardData();

    // Polling cada 30 segundos
    const interval = setInterval(() => {
      console.log('Auto-refresh dashboard data...');
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Función de refresh manual
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Memoizar las props comunes para evitar re-renders innecesarios
  const commonProps = useMemo(() => ({
    user,
    data: dashboardData,
    onRefresh: handleRefresh,
    lastUpdate
  }), [user, dashboardData, lastUpdate]);

  // Obtener fecha y hora actuales
  const currentDate = useMemo(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }, []);

  // Renderizar dashboard específico por rol
  const renderDashboardByRole = () => {
    if (loading && !dashboardData) {
      return <LoadingSpinner message="Cargando datos de SharePoint..." />;
    }

    if (error && !dashboardData) {
      return (
        <ErrorMessage 
          message={error} 
          onRetry={() => fetchDashboardData(true)}
        />
      );
    }

    const roleConfig = ROLE_DASHBOARDS[user?.role_id];
    
    if (!roleConfig) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-yellow-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Rol no reconocido</h3>
          <p className="text-yellow-600 text-sm">Contacta al administrador para configurar tu rol correctamente.</p>
        </div>
      );
    }

    const { component: DashboardComponent, name } = roleConfig;

    return (
      <React.Suspense 
        fallback={<LoadingSpinner message={`Cargando dashboard ${name}...`} />}
      >
        <DashboardComponent {...commonProps} />
      </React.Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Indicador de datos en vivo */}
      <LiveDataIndicator 
        lastUpdate={lastUpdate}
        isRefreshing={isRefreshing}
        sharePointData={dashboardData}
        onRefresh={handleRefresh}
      />

      <div className="space-y-6 p-6">
        {/* Header Global Simplificado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Bienvenido, {user?.name}
              </h1>
            </div>
            <div className="text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-blue-100 text-sm">
                  {currentDate.date}
                </p>
                <p className="text-xs text-blue-200 mt-1">
                  {currentDate.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard específico por rol */}
        {renderDashboardByRole()}
      </div>

      {/* Footer con información de sincronización */}
     
    </div>
  );
}
