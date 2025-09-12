// src/components/dashboard/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../utils/apiClient.js';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiClient.get('/api/users');
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                setUsers(response.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar usuarios');
            console.error('Error cargando usuarios:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserById = useCallback((userId) => {
        if (!userId) return null;
        return users.find(user => user.id === userId) || null;
    }, [users]);

    const getUserName = useCallback((userId) => {
        const user = getUserById(userId);
        return user ? user.name : 'Usuario desconocido';
    }, [getUserById]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return {
        users,
        loading,
        error,
        getUserById,
        getUserName,
        loadUsers
    };
};

export default useUsers;
