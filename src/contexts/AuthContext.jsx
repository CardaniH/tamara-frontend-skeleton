import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            apiClient.get('/api/user')
                .then(response => setUser(response.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    delete apiClient.defaults.headers.common['Authorization'];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        await apiClient.get('/sanctum/csrf-cookie');
        const response = await apiClient.post('/api/login', { email, password });
        const newToken = response.data.access_token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(response.data.user);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const logout = async () => {
        if (user) {
            await apiClient.post('/api/logout');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            delete apiClient.defaults.headers.common['Authorization'];
        }
    };

    const authValue = { user, login, logout, isLoggedIn: !!user };

    return (
        <AuthContext.Provider value={authValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
