// src/components/projects/TaskCard.jsx - Versión actualizada
import React, { useState } from 'react';
import useUsers from '../dashboard/hooks/useUsers.js';

const TaskCard = ({ task, onUpdate, onDelete, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: task.title,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date || '',
        assigned_to: task.assigned_to || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Hook para obtener usuarios
    const { getUserName, users } = useUsers();

    // Verificar permisos
    const canEdit = currentUser?.role_id === 1 || 
                   currentUser?.id === task.created_by || 
                   currentUser?.id === task.assigned_to;

    const statusConfig = {
        not_started: { label: 'No iniciado', color: 'bg-gray-100 text-gray-800', icon: '○' },
        in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-800', icon: '◐' },
        completed: { label: 'Completado', color: 'bg-green-100 text-green-800', icon: '●' },
        cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: '×' }
    };

    const priorityConfig = {
        low: { label: 'Baja', color: 'bg-green-50 text-green-700', icon: '↓' },
        medium: { label: 'Media', color: 'bg-yellow-50 text-yellow-700', icon: '→' },
        high: { label: 'Alta', color: 'bg-orange-50 text-orange-700', icon: '↑' },
        urgent: { label: 'Urgente', color: 'bg-red-50 text-red-700', icon: '●' }
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            setError('El título es obligatorio');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await onUpdate(task.id, formData);
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
        if (window.confirm(`¿Está seguro de eliminar la tarea "${task.title}"?\n\nEsta acción no se puede deshacer.`)) {
            setLoading(true);
            const result = await onDelete(task.id);
            if (!result.success) {
                setError(result.error || 'Error al eliminar');
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    // Función para obtener el nombre del usuario asignado
    const getAssignedUserName = () => {
        if (!task.assigned_to) return null;
        
        // Opción 1: Si el backend devuelve datos del usuario
        if (task.assignedUser) {
            return task.assignedUser.name;
        }
        
        // Opción 2: Usar hook de usuarios
        return getUserName(task.assigned_to);
    };

    const getCreatorName = () => {
        if (task.creator) {
            return task.creator.name;
        }
        return getUserName(task.created_by);
    };

    if (isEditing) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título de la tarea *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                <option value="not_started">No iniciado</option>
                                <option value="in_progress">En progreso</option>
                                <option value="completed">Completado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prioridad
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Asignar a
                            </label>
                            <select
                                value={formData.assigned_to}
                                onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                <option value="">Sin asignar</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha límite
                        </label>
                        <input
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    title: task.title,
                                    status: task.status,
                                    priority: task.priority,
                                    due_date: task.due_date || '',
                                    assigned_to: task.assigned_to || ''
                                });
                                setError(null);
                            }}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || !formData.title.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                            {task.title}
                        </h3>
                        
                        {/* Estado */}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[task.status]?.color || statusConfig.not_started.color}`}>
                            {statusConfig[task.status]?.icon} {statusConfig[task.status]?.label || 'No iniciado'}
                        </span>
                        
                        {/* Prioridad */}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig[task.priority]?.color || priorityConfig.medium.color}`}>
                            {priorityConfig[task.priority]?.icon} {priorityConfig[task.priority]?.label || 'Media'}
                        </span>
                    </div>

                    {/* Metadatos */}
                    <div className="text-sm text-gray-500 space-y-1">
                        {task.due_date && (
                            <div className="flex items-center space-x-1">
                                <span>Vence:</span>
                                <span className={new Date(task.due_date) < new Date() && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                                    {formatDate(task.due_date)}
                                </span>
                            </div>
                        )}
                        <div>Creado: {formatDate(task.created_at)} por {getCreatorName()}</div>
                        {task.assigned_to && (
                            <div className="font-medium text-blue-600">
                                Asignado a: {getAssignedUserName()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Acciones */}
                {canEdit && (
                    <div className="flex space-x-2 ml-4">
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={loading}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-md transition-colors disabled:opacity-50"
                        >
                            Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 hover:bg-red-200 rounded-md transition-colors disabled:opacity-50"
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-3 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                    {error}
                </div>
            )}
        </div>
    );
};

export default TaskCard;
// src/components/projects/ProjectDetails.jsx - Versión actualizada