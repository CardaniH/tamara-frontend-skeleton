import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient.js';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState({});
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/users', {
        params: {
          page: currentPage,
          search: search,
          role_filter: roleFilter,
          per_page: 10
        }
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);
        setRoles(response.data.roles || {});
        setUserPermissions(response.data.current_user_permissions || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/users/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getRoleName = (roleId) => {
    return roles[roleId] || 'Desconocido';
  };

  const getRoleBadge = (roleId) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    const roleColors = {
      1: "bg-red-100 text-red-800", // Admin Global
      2: "bg-purple-100 text-purple-800", // Director
      3: "bg-blue-100 text-blue-800", // Jefe
      4: "bg-green-100 text-green-800", // Empleado
      5: "bg-yellow-100 text-yellow-800", // Auditor
      6: "bg-gray-100 text-gray-800", // Prestador
    };
    
    return `${baseClasses} ${roleColors[roleId] || 'bg-gray-100 text-gray-800'}`;
  };

  const getRoleIcon = (roleId) => {
    const icons = {
      1: "👑", // Admin Global
      2: "🏢", // Director
      3: "👨‍💼", // Jefe
      4: "👷", // Empleado
      5: "🔍", // Auditor
      6: "📋", // Prestador
    };
    return icons[roleId] || "👤";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        {userPermissions.includes('manage_users') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo Usuario
          </button>
        )}
      </div>

      {/* Estadísticas Específicas por Rol */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Admin Global</p>
              <p className="text-xl font-bold text-red-600">{stats.admin_global || 0}</p>
            </div>
            <span className="text-2xl">👑</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Directores</p>
              <p className="text-xl font-bold text-purple-600">{stats.directores || 0}</p>
            </div>
            <span className="text-2xl">🏢</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Jefes</p>
              <p className="text-xl font-bold text-blue-600">{stats.jefes || 0}</p>
            </div>
            <span className="text-2xl">👨‍💼</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Empleados</p>
              <p className="text-xl font-bold text-green-600">{stats.empleados || 0}</p>
            </div>
            <span className="text-2xl">👷</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Auditores</p>
              <p className="text-xl font-bold text-yellow-600">{stats.auditores || 0}</p>
            </div>
            <span className="text-2xl">🔍</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Prestadores</p>
              <p className="text-xl font-bold text-gray-600">{stats.prestadores || 0}</p>
            </div>
            <span className="text-2xl">📋</span>
          </div>
        </div>
      </div>

      {/* Filtros Mejorados */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Rol</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los roles</option>
              {Object.entries(roles).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch('');
                setRoleFilter('');
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {getRoleIcon(user.role_id)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getRoleBadge(user.role_id)}>
                      {getRoleName(user.role_id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.department?.name || 'Sin asignar'}
                    </div>
                    {user.subdepartment && (
                      <div className="text-xs text-gray-500">
                        {user.subdepartment.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewUser(user.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Ver
                    </button>
                    {userPermissions.includes('manage_users') && (
                      <>
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Desactivar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.last_page > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {pagination.from} a {pagination.to} de {pagination.total} usuarios
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
                  disabled={currentPage === pagination.last_page}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
