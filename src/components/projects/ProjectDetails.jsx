// src/components/projects/ProjectDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { projectsAPI } from '../../utils/apiClient.js';
import useTasks from '../dashboard/hooks/useTasks.js';
import TaskCard from './TaskCard.jsx';
import CreateTaskModal from './CreateTaskModal.jsx';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateTask, setShowCreateTask] = useState(false);
    
    const { 
        tasks, 
        loading: tasksLoading, 
        error: tasksError, 
        loadTasks, 
        createTask, 
        updateTask, 
        deleteTask 
    } = useTasks(projectId);

    // Cargar proyecto
    useEffect(() => {
        const loadProject = async () => {
            try {
                const response = await projectsAPI.getProject(projectId);
                setProject(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar el proyecto');
            } finally {
                setLoading(false);
            }
        };
        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    // Cargar tareas cuando se monta el componente
    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const canCreateTasks = user?.role_id === 1 || user?.id === project?.created_by;

    const handleCreateTask = async (taskData) => {
        const result = await createTask(taskData);
        if (result.success) {
            setShowCreateTask(false);
        }
        return result;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando proyecto...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-red-800 font-medium">Error</h3>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                        <Link 
                            to="/projects" 
                            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                        >
                            ← Volver a proyectos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Breadcrumb */}
                <nav className="text-sm">
                    <Link to="/projects" className="text-blue-600 hover:text-blue-800">
                        Inicio
                    </Link>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="text-gray-900">{project?.name}</span>
                </nav>

                {/* Header del Proyecto */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                {project?.name}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {project?.description || 'Sin descripción'}
                            </p>
                            <div className="text-sm text-gray-500">
                                Creado el {new Date(project?.created_at).toLocaleDateString('es-ES')}
                            </div>
                        </div>
                        
                        {canCreateTasks && (
                            <button
                                onClick={() => setShowCreateTask(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nueva tarea
                            </button>
                        )}
                    </div>
                </div>

                {/* Tareas */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Tareas ({tasks.length})
                        </h2>
                        {tasksLoading && (
                            <div className="text-sm text-gray-500">Cargando tareas...</div>
                        )}
                    </div>

                    {tasksError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800">{tasksError}</p>
                        </div>
                    )}

                    {tasks.length === 0 && !tasksLoading ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
                            <p className="text-gray-500 mb-4">
                                Comienza agregando tareas para organizar el trabajo del proyecto.
                            </p>
                            {canCreateTasks && (
                                <button
                                    onClick={() => setShowCreateTask(true)}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Crear Primera Tarea
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdate={updateTask}
                                    onDelete={deleteTask}
                                    currentUser={user}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal de Crear Tarea */}
                {showCreateTask && (
                    <CreateTaskModal
                        onClose={() => setShowCreateTask(false)}
                        onSubmit={handleCreateTask}
                        projectName={project?.name}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
