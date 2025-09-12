// src/components/projects/ProjectsManager.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useProjects from '../dashboard/hooks/useProjects.js';
import ProjectCard from './ProjectCard.jsx';
import CreateProjectModal from './CreateProjectModal.jsx';

const ProjectsManager = () => {
    const { user } = useAuth();
    const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCreateProject = async (projectData) => {
        const result = await createProject(projectData);
        if (result.success) {
            setShowCreateModal(false);
        }
        return result;
    };

    if (loading && projects.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando proyectos...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 5v6m-3-3h.01M9 16h.01" />
                                </svg>
                                Gestión de Proyectos
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {user?.role_id === 1 
                                    ? 'Vista completa de todos los proyectos de la organización'
                                    : 'Tus proyectos creados'
                                } • Usuario: <span className="font-medium">{user?.name}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
                                <p className="text-sm text-gray-500">Proyectos</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nuevo Proyecto
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <h3 className="text-red-800 font-medium">Error</h3>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Proyectos */}
                {projects.length === 0 && !loading ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 5v6m-3-3h.01M9 16h.01" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
                        <p className="text-gray-500 mb-4">
                            Comienza creando tu primer proyecto para organizar las tareas de tu equipo.
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Crear Primer Proyecto
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onUpdate={updateProject}
                                onDelete={deleteProject}
                                currentUser={user}
                            />
                        ))}
                    </div>
                )}

                {/* Modal de Crear Proyecto */}
                {showCreateModal && (
                    <CreateProjectModal
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreateProject}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectsManager;
