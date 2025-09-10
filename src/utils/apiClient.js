// src/utils/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true,
    withXSRFToken: true,
});

// Interceptor para añadir token de autenticación
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ===== SHAREPOINT DOCUMENTS API - URLs CORREGIDAS =====
export const sharepointAPI = {
    // ✅ CORRECTO: Usar las rutas que ya tienes en Laravel
    getDocuments: (params = {}) => {
        return apiClient.get('/api/sharepoint/documents', { params });
    },
    searchDocuments: (query, params = {}) => {
        return apiClient.get('/api/sharepoint/documents/search', { 
            params: { q: query, ...params } 
        });
    },
    getDocument: (id) => {
        return apiClient.get(`/api/sharepoint/documents/${id}`);
    },
    getStats: () => {
        return apiClient.get('/api/sharepoint/documents/stats');
    },
};

export default apiClient;
