// src/components/dashboard/hooks/useProjects.js
import { useState, useEffect, useCallback } from 'react';
import { projectsAPI } from '../../../utils/apiClient.js';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar proyectos
    const loadProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await projectsAPI.getProjects();
            setProjects(response.data);
            console.log('✅ Proyectos cargados:', response.data.length);
        } catch (err) {
            console.error('❌ Error cargando proyectos:', err);
            setError(err.response?.data?.message || 'Error al cargar proyectos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Crear proyecto
    const createProject = useCallback(async (projectData) => {
        try {
            const response = await projectsAPI.createProject(projectData);
            setProjects(prev => [...prev, response.data]);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al crear proyecto';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Actualizar proyecto
    const updateProject = useCallback(async (projectId, projectData) => {
        try {
            const response = await projectsAPI.updateProject(projectId, projectData);
            setProjects(prev => prev.map(p => p.id === projectId ? response.data : p));
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al actualizar proyecto';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Eliminar proyecto
    const deleteProject = useCallback(async (projectId) => {
        try {
            await projectsAPI.deleteProject(projectId);
            setProjects(prev => prev.filter(p => p.id !== projectId));
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al eliminar proyecto';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    return {
        projects,
        loading,
        error,
        loadProjects,
        createProject,
        updateProject,
        deleteProject,
    };
};

export default useProjects;
