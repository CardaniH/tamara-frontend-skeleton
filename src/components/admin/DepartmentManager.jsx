import React, { useState, useEffect } from 'react';
import apiClient from '/src/utils/apiClient.js';  // Ruta absoluta

const DepartmentManager =() => {
     console.log('✅ Montando DepartmentManager');
     console.log('🔧 apiClient al importar:', apiClient);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [editingDepartment, setEditingDepartment] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/departments');
            
            // 🔥 CORRECCIÓN CRÍTICA: maneja la estructura de datos correcta
            const departmentsData = response.data.departments || response.data;
            setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
            setError('');
            
            console.log('Departments loaded:', departmentsData); // Para debugging
        } catch (err) {
            setError('No se pudieron cargar los departamentos. Es posible que no tengas permisos.');
            console.error('Error loading departments:', err);
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newDepartmentName.trim()) return;

        try {
            await apiClient.post('/api/departments', { name: newDepartmentName });
            setNewDepartmentName('');
            fetchDepartments();
        } catch (err) {
            setError('Error al crear el departamento. ¿Quizás ya existe?');
        }
    };

    const handleUpdate = async (id, newName) => {
        try {
            await apiClient.put(`/api/departments/${id}`, { name: newName });
            setEditingDepartment(null);
            fetchDepartments();
        } catch (err) {
            setError('Error al actualizar el departamento.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
            try {
                await apiClient.delete(`/api/departments/${id}`);
                fetchDepartments();
            } catch (err) {
                setError('Error al eliminar el departamento.');
            }
        }
    };

    if (loading) return <p className="text-center mt-8 text-gray-500">Cargando gestión de departamentos...</p>;

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Gestión de Departamentos</h3>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}

            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2 mb-6">
                <input
                    type="text"
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    placeholder="Nombre del nuevo departamento"
                    className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Crear</button>
            </form>

            <div className="space-y-3">
                {departments.map(dept => (
                    <div key={dept.id} className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50">
                        {editingDepartment && editingDepartment.id === dept.id ? (
                            <input
                                type="text"
                                value={editingDepartment.name}
                                onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                                onBlur={() => handleUpdate(dept.id, editingDepartment.name)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(dept.id, editingDepartment.name)}
                                className="flex-grow px-2 py-1 border rounded-md"
                                autoFocus
                            />
                        ) : (
                            <p className="font-medium text-gray-700">{dept.name}</p>
                        )}

                        <div className="flex gap-2">
                            <button onClick={() => setEditingDepartment({ id: dept.id, name: dept.name })} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600">Editar</button>
                            <button onClick={() => handleDelete(dept.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">Eliminar</button>
                        </div>
                    </div>
                ))}
                {departments.length === 0 && !loading && <p className="text-center text-gray-500 py-4">No hay departamentos creados.</p>}
            </div>
        </div>
    );
};

export default DepartmentManager;
