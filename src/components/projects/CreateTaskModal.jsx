// src/components/projects/CreateTaskModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { usersAPI, subdepartmentsAPI } from '../../utils/apiClient.js';

const CreateTaskModal = ({ onClose, onSubmit, projectName }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        type: 'departmental',
        priority: 'medium',
        due_date: '',
        assigned_to: '',
        subdepartment_id: ''
    });

    const [subdepartments, setSubdepartments] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingSubdepts, setLoadingSubdepts] = useState(false);
    const [error, setError] = useState(null);

    // Cargar subdepartamentos cuando el tipo es "subdepartmental"
    useEffect(() => {
        const loadSubdepartments = async () => {
            if (formData.type !== 'subdepartmental') {
                setSubdepartments([]);
                return;
            }

            setLoadingSubdepts(true);
            try {
                let response;
                if (user?.department_id) {
                    // Si el usuario tiene departamento, filtrar por ese departamento
                    response = await subdepartmentsAPI.getSubdepartmentsByDepartment(user.department_id);
                } else {
                    // Si es admin global, obtener todos
                    response = await subdepartmentsAPI.getSubdepartments();
                }
                
                setSubdepartments(response.data || []);
            } catch (err) {
                console.error('Error cargando subdepartamentos:', err);
                setSubdepartments([]);
                setError('Error al cargar subdepartamentos');
            } finally {
                setLoadingSubdepts(false);
            }
        };

        loadSubdepartments();
    }, [formData.type, user?.department_id]);

    // Cargar usuarios basado en el tipo de tarea
    useEffect(() => {
        const loadUsers = async () => {
            setLoadingUsers(true);
            setAvailableUsers([]);
            
            try {
                let response;
                
                switch (formData.type) {
                    case 'personal':
                        // Solo el usuario actual
                        setAvailableUsers([{
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }]);
                        setFormData(prev => ({ ...prev, assigned_to: user.id.toString() }));
                        break;
                        
                    case 'departmental':
                        // Usuarios del mismo departamento
                        if (user?.department_id) {
                            response = await usersAPI.getUsersByDepartment(user.department_id);
                            setAvailableUsers(response.data.data || []);
                        } else if (user?.role_id === 1) {
                            // Admin global ve todos los usuarios
                            response = await usersAPI.getUsers();
                            setAvailableUsers(response.data.data || []);
                        }
                        break;
                        
                    case 'subdepartmental':
                        // Usuarios del subdepartamento seleccionado
                        if (formData.subdepartment_id) {
                            response = await usersAPI.getUsersBySubdepartment(formData.subdepartment_id);
                            setAvailableUsers(response.data.data || []);
                        }
                        break;
                        
                    default:
                        setAvailableUsers([]);
                }
            } catch (err) {
                console.error('Error cargando usuarios:', err);
                setError('Error al cargar usuarios disponibles');
            } finally {
                setLoadingUsers(false);
            }
        };

        loadUsers();
    }, [formData.type, formData.subdepartment_id, user]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Limpiar usuario asignado si cambia el subdepartamento
        if (field === 'subdepartment_id') {
            setFormData(prev => ({ ...prev, assigned_to: '' }));
        }
        
        // Limpiar error al escribir
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!formData.title.trim()) {
            setError('El título es obligatorio');
            return;
        }
        
        if (!formData.assigned_to) {
            setError('Debe asignar la tarea a un usuario');
            return;
        }
        
        if (formData.type === 'subdepartmental' && !formData.subdepartment_id) {
            setError('Debe seleccionar un subdepartamento');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const dataToSend = {
                title: formData.title.trim(),
                type: formData.type,
                priority: formData.priority,
                due_date: formData.due_date || null,
                assigned_to: parseInt(formData.assigned_to)
            };

            const result = await onSubmit(dataToSend);
            if (result.success) {
                onClose();
            } else {
                setError(result.error || 'Error al crear la tarea');
            }
        } catch (e) {
            setError('Error inesperado al crear la tarea');
        } finally {
            setLoading(false);
        }
    };

    const getUserDisplayName = (user) => {
        return `${user.name} (${user.email})`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Crear Nueva Tarea
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                {/* Información del proyecto */}
                <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
                    <div className="text-sm text-blue-800">
                        <strong>Proyecto:</strong> {projectName}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        
                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de la tarea *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ej: Revisar documentación, Implementar funcionalidad..."
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        {/* Tipo de tarea */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de tarea
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                <option value="personal">Personal</option>
                                <option value="departmental">Departamental</option>
                                <option value="subdepartmental">Subdepartamental</option>
                            </select>
                        </div>

                        {/* Subdepartamento (solo si es tipo subdepartamental) */}
                        {formData.type === 'subdepartmental' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subdepartamento *
                                </label>
                                <select
                                    value={formData.subdepartment_id}
                                    onChange={(e) => handleInputChange('subdepartment_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    disabled={loading || loadingSubdepts}
                                    required
                                >
                                    <option value="">
                                        {loadingSubdepts ? 'Cargando subdepartamentos...' : 'Seleccione un subdepartamento'}
                                    </option>
                                    {subdepartments.map((subdept) => (
                                        <option key={subdept.id} value={subdept.id}>
                                            {subdept.name}
                                        </option>
                                    ))}
                                </select>
                                {subdepartments.length === 0 && !loadingSubdepts && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        No hay subdepartamentos disponibles
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Asignar a usuario */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Asignar a *
                            </label>
                            <select
                                value={formData.assigned_to}
                                onChange={(e) => handleInputChange('assigned_to', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                disabled={loading || loadingUsers}
                                required
                            >
                                <option value="">
                                    {loadingUsers ? 'Cargando usuarios...' : 'Seleccione un usuario'}
                                </option>
                                {availableUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {getUserDisplayName(user)}
                                    </option>
                                ))}
                            </select>
                            {formData.type === 'subdepartmental' && !formData.subdepartment_id && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Seleccione primero un subdepartamento
                                </p>
                            )}
                            {availableUsers.length === 0 && !loadingUsers && formData.type !== 'subdepartmental' && (
                                <p className="text-sm text-gray-500 mt-1">
                                    No hay usuarios disponibles para este tipo de tarea
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Prioridad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prioridad
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => handleInputChange('priority', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                    <option value="urgent">Urgente</option>
                                </select>
                            </div>

                            {/* Fecha límite */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha límite
                                </label>
                                <input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        {/* Información sobre tipos de tarea */}
                        <div className="bg-gray-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tipos de tarea:</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li><strong>Personal:</strong> Se asigna automáticamente a ti</li>
                                <li><strong>Departamental:</strong> Puedes asignar a cualquier usuario de tu departamento</li>
                                <li><strong>Subdepartamental:</strong> Selecciona subdepartamento y después el usuario</li>
                            </ul>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <div className="flex items-center">
                                    <div className="text-red-400 text-lg mr-2">!</div>
                                    <div className="text-red-800 text-sm">{error}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.title.trim() || !formData.assigned_to || loadingUsers}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear Tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
