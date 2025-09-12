// src/components/dashboard/hooks/useTasks.js
import { useState, useCallback } from 'react';
import { tasksAPI } from '../../../utils/apiClient.js';

export const useTasks = (projectId) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar tareas del proyecto
    const loadTasks = useCallback(async () => {
        if (!projectId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await tasksAPI.getProjectTasks(projectId);
            setTasks(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar tareas');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    // Crear tarea
    const createTask = useCallback(async (taskData) => {
        try {
            const response = await tasksAPI.createTask(projectId, taskData);
            setTasks(prev => [...prev, response.data]);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al crear tarea';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, [projectId]);

    // Actualizar tarea
    const updateTask = useCallback(async (taskId, taskData) => {
        try {
            const response = await tasksAPI.updateTask(taskId, taskData);
            setTasks(prev => prev.map(t => t.id === taskId ? response.data : t));
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al actualizar tarea';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Eliminar tarea
    const deleteTask = useCallback(async (taskId) => {
        try {
            await tasksAPI.deleteTask(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al eliminar tarea';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    return {
        tasks,
        loading,
        error,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
    };
};

export default useTasks;
