import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient.js';

const SubdepartmentManager = () => {
    const [subdepartments, setSubdepartments] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para el formulario
    const [newSubdepartment, setNewSubdepartment] = useState({
        name: '',
        department_id: ''
    });
    const [editingSubdepartment, setEditingSubdepartment] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subdepartmentsRes, departmentsRes] = await Promise.all([
                apiClient.get('/api/subdepartments'),
                apiClient.get('/api/departments')
            ]);
            setSubdepartments(subdepartmentsRes.data);
            setDepartments(departmentsRes.data);
            setError('');
        } catch (err) {
            setError('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newSubdepartment.name.trim() || !newSubdepartment.department_id) return;

        try {
            await apiClient.post('/api/subdepartments', newSubdepartment);
            setNewSubdepartment({ name: '', department_id: '' });
            fetchData();
        } catch (err) {
            setError('Error al crear el subdepartamento.');
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await apiClient.put(`/api/subdepartments/${id}`, updatedData);
            setEditingSubdepartment(null);
            fetchData();
        } catch (err) {
            setError('Error al actualizar el subdepartamento.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este subdepartamento?')) {
            try {
                await apiClient.delete(`/api/subdepartments/${id}`);
                fetchData();
            } catch (err) {
                setError('Error al eliminar el subdepartamento.');
            }
        }
    };

    if (loading) return <p className="text-center mt-8 text-gray-500">Cargando subdepartamentos...</p>;

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Gestión de Subdepartamentos</h3>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}

            {/* Formulario para crear subdepartamento */}
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    value={newSubdepartment.name}
                    onChange={(e) => setNewSubdepartment(prev => ({...prev, name: e.target.value}))}
                    placeholder="Nombre del subdepartamento"
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <select
                    value={newSubdepartment.department_id}
                    onChange={(e) => setNewSubdepartment(prev => ({...prev, department_id: e.target.value}))}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">Seleccionar departamento</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Crear Subdepartamento
                </button>
            </form>

            {/* Lista de subdepartamentos */}
            <div className="space-y-3">
                {subdepartments.map(subdept => (
                    <div key={subdept.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                        {editingSubdepartment?.id === subdept.id ? (
                            <div className="flex-grow grid grid-cols-2 gap-4 mr-4">
                                <input
                                    type="text"
                                    value={editingSubdepartment.name}
                                    onChange={(e) => setEditingSubdepartment({...editingSubdepartment, name: e.target.value})}
                                    className="px-2 py-1 border rounded-md"
                                />
                                <select
                                    value={editingSubdepartment.department_id}
                                    onChange={(e) => setEditingSubdepartment({...editingSubdepartment, department_id: e.target.value})}
                                    className="px-2 py-1 border rounded-md"
                                >
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <p className="font-medium text-gray-700">{subdept.name}</p>
                                <p className="text-sm text-gray-500">Departamento: {subdept.department?.name}</p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            {editingSubdepartment?.id === subdept.id ? (
                                <button 
                                    onClick={() => handleUpdate(subdept.id, editingSubdepartment)} 
                                    className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                                >
                                    Guardar
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setEditingSubdepartment({
                                        id: subdept.id, 
                                        name: subdept.name, 
                                        department_id: subdept.department_id
                                    })} 
                                    className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600"
                                >
                                    Editar
                                </button>
                            )}
                            <button 
                                onClick={() => handleDelete(subdept.id)} 
                                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
                {subdepartments.length === 0 && !loading && (
                    <p className="text-center text-gray-500 py-4">No hay subdepartamentos creados.</p>
                )}
            </div>
        </div>
    );
};

export default SubdepartmentManager;
