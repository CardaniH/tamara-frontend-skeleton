import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import apiClient from '../../utils/apiClient.js';

// Importes para dashboards específicos
const AdminGlobalDash = React.lazy(() => import('./roles/AdminGlobalDash.jsx'));
const DirectorDash = React.lazy(() => import('./roles/DirectorDash.jsx'));
const JefeDash = React.lazy(() => import('./roles/JefeDash.jsx'));
const EmpleadoDash = React.lazy(() => import('./roles/EmpleadoDash.jsx'));
const AuditorDash = React.lazy(() => import('./roles/AuditorDash.jsx'));
const PrestadorDash = React.lazy(() => import('./roles/PrestadorDash.jsx'));

export default function Dash() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  // ← ELIMINAR COMPLETAMENTE EL ARRAY roleNames - YA NO LO NECESITAS

  // ← AÑADIR DEBUG TEMPORAL


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/api/dashboard/stats');
      
      // ← DEBUG ADICIONAL
  
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar dashboard específico por rol
  const renderDashboardByRole = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const commonProps = {
      user,
      data: dashboardData,
      onRefresh: fetchDashboardData
    };

    switch (user?.role_id) {
      case 1:
        return (
          <React.Suspense fallback={<div>Cargando dashboard Admin...</div>}>
            <AdminGlobalDash {...commonProps} />
          </React.Suspense>
        );
      case 2:
        return (
          <React.Suspense fallback={<div>Cargando dashboard Director...</div>}>
            <DirectorDash {...commonProps} />
          </React.Suspense>
        );
      case 3:
        return (
          <React.Suspense fallback={<div>Cargando dashboard Jefe...</div>}>
            <JefeDash {...commonProps} />
          </React.Suspense>
        );
      case 4:
        return (
          <React.Suspense fallback={<div>Cargando dashboard Empleado...</div>}>
            <EmpleadoDash {...commonProps} />
          </React.Suspense>
        );
      case 5:
        return (
          <React.Suspense fallback={<div>Cargando dashboard Auditor...</div>}>
            <AuditorDash {...commonProps} />
          </React.Suspense>
        );
      case 6:
        return (
          <React.Suspense fallback={<div>Cargando dashboard Prestador...</div>}>
            <PrestadorDash {...commonProps} />
          </React.Suspense>
        );
      default:
        return <div>Rol no reconocido. Contacta al administrador.</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Global Mejorado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              ¡Bienvenido, {user?.name}!
            </h1>
           
            
          </div>
          <div className="text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-blue-200 mt-1">
                {new Date().toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard específico por rol */}
      {renderDashboardByRole()}
    </div>
  );
}
