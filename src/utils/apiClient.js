// src/utils/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
  withXSRFToken: true,
});

// token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sharepointAPI = {
  // Lista
  getDocuments: (params = {}) =>
    apiClient.get('/api/sharepoint/documents', { params }),

  // Búsqueda  ✅  ← añade /documents
  searchDocuments: (params = {}) =>
    apiClient.get('/api/sharepoint/documents/search', { params }),

  // Stats
  getStats: () =>
    apiClient.get('/api/sharepoint/documents/stats'),

  // Detalle
  getDocument: (id) =>
    apiClient.get(`/api/sharepoint/documents/${id}`),
};
// src/utils/apiClient.js - Agregar estas APIs
// ===== PROJECTS API =====
export const projectsAPI = {
    // Listar proyectos (admin ve todos, usuarios ven los suyos)
    getProjects: () => {
        return apiClient.get('/api/projects');
    },

    // Crear proyecto
    createProject: (projectData) => {
        return apiClient.post('/api/projects', projectData);
    },

    // Obtener proyecto específico
    getProject: (projectId) => {
        return apiClient.get(`/api/projects/${projectId}`);
    },

    // Actualizar proyecto
    updateProject: (projectId, projectData) => {
        return apiClient.put(`/api/projects/${projectId}`, projectData);
    },

    // Eliminar proyecto
    deleteProject: (projectId) => {
        return apiClient.delete(`/api/projects/${projectId}`);
    },
};

// ===== TASKS API =====
export const tasksAPI = {
    // Listar tareas de un proyecto
    getProjectTasks: (projectId) => {
        return apiClient.get(`/api/projects/${projectId}/tasks`);
    },

    // Crear tarea en proyecto
    createTask: (projectId, taskData) => {
        return apiClient.post(`/api/projects/${projectId}/tasks`, taskData);
    },

    // Actualizar tarea
    updateTask: (taskId, taskData) => {
        return apiClient.put(`/api/tasks/${taskId}`, taskData);
    },

    // Eliminar tarea
    deleteTask: (taskId) => {
        return apiClient.delete(`/api/tasks/${taskId}`);
    },
};
export const usersAPI = {
    // Obtener usuarios (con filtros opcionales)
    getUsers: (params = {}) => {
        return apiClient.get('/api/users', { params });
    },

    // Obtener usuarios por departamento
    getUsersByDepartment: (departmentId) => {
        return apiClient.get('/api/users', { 
            params: { department_id: departmentId } 
        });
    },

    // Obtener usuarios por subdepartamento
    getUsersBySubdepartment: (subdepartmentId) => {
        return apiClient.get('/api/users', { 
            params: { subdepartment_id: subdepartmentId } 
        });
    },
};

// ===== SUBDEPARTMENTS API =====
export const subdepartmentsAPI = {
    // Obtener todos los subdepartamentos
    getSubdepartments: () => {
        return apiClient.get('/api/subdepartments');
    },

    // Obtener subdepartamentos por departamento
    getSubdepartmentsByDepartment: (departmentId) => {
        return apiClient.get('/api/subdepartments', { 
            params: { department_id: departmentId } 
        });
    },
};

export default apiClient;
