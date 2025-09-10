import { useState, useEffect, useRef } from 'react';

export default function useDashboardData(refreshInterval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef(null);

  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (!data) {
        setLoading(true);
      }
      
      setError(null);

      // Obtener token de autenticación (ajusta según tu implementación)
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdate(new Date());
        
        // 📊 Log para debugging - muestra datos SharePoint
        console.log('📊 Dashboard Data Updated:', {
          timestamp: new Date().toLocaleTimeString(),
          sharepoint_docs: result.data.sharepoint_docs,
          new_docs_week: result.data.new_docs_week,
          sharepoint_site: result.data.sharepoint_site_name,
          total_users: result.data.total_users,
          last_sync: result.data.sharepoint_last_sync
        });
      } else {
        throw new Error(result.message || 'Error en la respuesta del servidor');
      }
      
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err.message);
      
      // Si es el primer fetch y falla, mostrar datos de fallback
      if (!data) {
        setData({
          sharepoint_docs: 0,
          new_docs_week: 0,
          sharepoint_site_name: 'SharePoint (sin conexión)',
          sharepoint_last_sync: null,
          total_users: 0,
          total_departments: 0
        });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // 🚀 Fetch inicial al montar el componente
  useEffect(() => {
    console.log('🔄 Iniciando useDashboardData con interval:', refreshInterval + 'ms');
    fetchData();
  }, []);

  // ⏰ Polling automático cada X segundos
  useEffect(() => {
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        console.log('🔄 Auto-refresh dashboard data...');
        fetchData();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          console.log('⏹️ Dashboard polling stopped');
        }
      };
    }
  }, [refreshInterval]);

  // 🔄 Función para refresh manual
  const refresh = () => {
    console.log('🔄 Manual refresh triggered');
    fetchData(true);
  };

  // 🛑 Función para parar el polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // ▶️ Función para reanudar el polling
  const startPolling = () => {
    if (!intervalRef.current && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refreshInterval);
    }
  };

  return {
    data,
    loading,
    error,
    lastUpdate,
    isRefreshing,
    refresh,
    stopPolling,
    startPolling
  };
}
