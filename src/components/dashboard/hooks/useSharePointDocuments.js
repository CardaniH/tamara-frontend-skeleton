// src/components/dashboard/hooks/useSharePointDocuments.js
import { useState, useEffect, useCallback } from "react";
import { sharepointAPI } from "../../../utils/apiClient.js";

export const useSharePointDocuments = (initialFilters = {}) => {
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [stats, setStats] = useState(null);
  const [searchMode, setSearchMode] = useState(false);

  // Cargar documentos
  const loadDocuments = useCallback(
    async (page = 1, resetSearch = false) => {
      setLoading(true);
      setError(null);

      if (resetSearch) {
        setSearchMode(false);
      }

      try {
        const params = {
          page,
          per_page: 15,
          ...filters,
        };

        console.log("🔍 Cargando documentos SharePoint con params:", params);
        const response = await sharepointAPI.getDocuments(params);

        if (response.data.success) {
          setDocuments(response.data.data);
          setPagination(response.data.pagination);
          console.log(
            "✅ Documentos SharePoint cargados:",
            response.data.data.length
          );
        } else {
          setError(response.data.message);
          setDocuments([]);
        }
      } catch (err) {
        console.error("❌ Error al cargar documentos SharePoint:", err);
        setError(err.response?.data?.message || "Error al cargar documentos");
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Buscar documentos
  // Buscar documentos CON PAGINACIÓN
  const searchDocuments = useCallback(
  async (texto, page = 1) => {
    if (!texto || texto.length < 2) {
      loadDocuments(1, true);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchMode(true);

    try {
      // Parámetros planos: q, page, per_page
      const params = { q: texto, page, per_page: 15 };
      const res = await sharepointAPI.searchDocuments(params);

      if (res.data.success) {
        setDocuments(res.data.data);
        setPagination(res.data.pagination);
      } else {
        setError(res.data.message);
        setDocuments([]);
        setPagination({});
      }
    } catch (err) {
      setError('Error en la búsqueda');
      setDocuments([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  },
  [loadDocuments]
);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      console.log("📊 Cargando estadísticas SharePoint...");
      const response = await sharepointAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
        console.log("✅ Estadísticas SharePoint cargadas:", response.data.data);
      }
    } catch (err) {
      console.error("❌ Error cargando estadísticas SharePoint:", err);
    }
  }, []);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters) => {
    console.log("🎛️ Aplicando filtros SharePoint:", newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setSearchMode(false);
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    console.log("🧹 Limpiando filtros SharePoint");
    setFilters({});
    setSearchMode(false);
  }, []);

  // Efecto para cargar documentos cuando cambian los filtros
  useEffect(() => {
    if (!searchMode) {
      loadDocuments(1);
    }
  }, [loadDocuments, searchMode]);

  return {
    documents,
    pagination,
    loading,
    error,
    filters,
    stats,
    searchMode,
    loadDocuments,
    searchDocuments,
    loadStats,
    applyFilters,
    clearFilters,
  };
};

export default useSharePointDocuments;
