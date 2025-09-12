// src/components/projects/ProjectCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onUpdate, onDelete, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Verificar permisos: admin global o creador del proyecto
    const canEdit = currentUser?.role_id === 1 || currentUser?.id === project.created_by;

    const handleSave = async () => {
        if (!name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const result = await onUpdate(project.id, { name, description });
            if (result.success) {
                setIsEditing(false);
            } else {
                setError(result.error || 'Error al guardar');
            }
        } catch (e) {
            setError('Error al guardar los cambios');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de eliminar el proyecto "${project.name}"?\n\nEsta acción no se puede deshacer.`)) {
            setLoading(true);
            const result = await onDelete(project.id);
            if (!result.success) {
                setError(result.error || 'Error al eliminar');
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Vista de edición
    if (isEditing) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del proyecto *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nombre del proyecto"
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Descripción del proyecto (opcional)"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setName(project.name);
                                setDescription(project.description || '');
                                setError(null);
                            }}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || !name.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Vista normal
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
                {/* Header del proyecto */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {project.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                            {project.description || 'Sin descripción'}
                        </p>
                    </div>
                    
                    {/* Badge de creador */}
                    {project.created_by === currentUser?.id && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Tuyo
                        </span>
                    )}
                </div>

                {/* Metadatos */}
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-2 8V9m-6 8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Creado: {formatDate(project.created_at)}
                    </div>
                    {project.updated_at && project.updated_at !== project.created_at && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Actualizado: {formatDate(project.updated_at)}
                        </div>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                        to={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver detalles
                    </Link>
                    
                    {canEdit ? (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                disabled={loading}
                                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded transition-colors disabled:opacity-50 flex items-center"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-3 py-1 text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded transition-colors disabled:opacity-50 flex items-center"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </button>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400 italic">
                            Solo lectura
                        </span>
                    )}
                </div>

                {error && (
                    <div className="mt-3 text-red-600 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
