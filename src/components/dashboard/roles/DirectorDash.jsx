import React from 'react';
import { Link } from 'react-router-dom';

export default function DirectorDash({ user, data, onRefresh }) {
  return (
    <div className="space-y-6">
      {/* Header del Director */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <span className="mr-3">🏢</span>
          Dirección de {user?.department?.name || 'Departamento'}
        </h2>
        <p className="text-gray-600">
          Director: <span className="font-semibold text-purple-600">{user?.name}</span> • 
          <span className="text-sm ml-2">{user?.role?.name || 'N/A'}</span>
        </p>
      </div>

      {/* Métricas del Departamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Mi Equipo</p>
              <p className="text-2xl font-bold text-gray-900">{data?.department_team_count || 0}</p>
              <p className="text-xs text-green-600">Empleados activos</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Proyectos</p>
              <p className="text-2xl font-bold text-gray-900">{data?.department_projects || 8}</p>
              <p className="text-xs text-blue-600">{data?.active_projects || 5} activos</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Tareas Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{data?.department_pending_tasks || 12}</p>
              <p className="text-xs text-yellow-600">Requieren atención</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <span className="text-2xl">📁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Documentos</p>
              <p className="text-2xl font-bold text-gray-900">{data?.my_department_files?.shared_documents || 45}</p>
              <p className="text-xs text-purple-600">SharePoint</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Gestión Departamental */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span> Gestión Departamental
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/department-employees"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">👥</span>
              <div>
                <p className="font-medium text-blue-800">Mi Equipo</p>
                <p className="text-xs text-blue-600">{data?.department_team_count || 0} empleados</p>
              </div>
            </Link>

            <Link
              to="/department-projects"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3">📋</span>
              <div>
                <p className="font-medium text-green-800">Proyectos</p>
                <p className="text-xs text-green-600">{data?.active_projects || 5} activos</p>
              </div>
            </Link>

            <Link
              to="/department-reports"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3">📊</span>
              <div>
                <p className="font-medium text-purple-800">Reportes</p>
                <p className="text-xs text-purple-600">Análisis mensual</p>
              </div>
            </Link>

            <button
              onClick={onRefresh}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3">🔄</span>
              <div>
                <p className="font-medium text-gray-800">Actualizar</p>
                <p className="text-xs text-gray-600">Datos del depto</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📈</span> Resumen de Roles
          </h3>
          <div className="space-y-3">
            {[
              
              { role: 'Directores', count: data.director_count || 'N/A', color: 'purple', icon: '' },
              { role: 'Jefes', count: data.jefe_count || 'N/A', color: 'blue', icon: '' },
              { role: 'Empleados', count: data.empleado_count || 'N/A', color: 'green', icon: '' },
              { role: 'Auditores', count: data.auditor_count || 'N/A', color: 'yellow', icon: '' },
              { role: 'Prestadores', count: data.prestador_count || 'N/A', color: 'gray', icon: '' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="font-medium text-gray-700">{item.role}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${item.color}-100 text-${item.color}-800`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subdepartamentos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🏛️</span> Subdepartamentos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.department_subdepartments || [
            { name: 'Contabilidad', employees: 4, projects: 2, status: 'activo' },
            { name: 'Cartera', employees: 3, projects: 3, status: 'activo' },
            { name: 'Facturación', employees: 2, projects: 1, status: 'activo' }
          ]).map((subdept, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{subdept.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subdept.status === 'activo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subdept.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">👥 Empleados:</span> {subdept.employees}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">📋 Proyectos:</span> {subdept.projects}
                </p>
              </div>
              <div className="mt-3">
                <Link 
                  to={`/subdepartments/${subdept.name.toLowerCase()}`}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver detalles →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actividad Reciente del Departamento */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">⏰</span> Actividad Reciente del Departamento
        </h3>
        <div className="space-y-3">
          {(data.department_activities || [
            { icon: '✅', action: 'Tarea completada por equipo', user: 'Equipo Contabilidad', time: 'Hace 1 hora' },
            { icon: '📋', action: 'Nuevo proyecto asignado', user: 'Director', time: 'Hace 2 horas' },
            { icon: '👤', action: 'Empleado agregado al equipo', user: 'RRHH', time: 'Hace 4 horas' },
            { icon: '📊', action: 'Reporte mensual generado', user: 'Sistema', time: 'Hace 6 horas' }
          ]).map((activity, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-lg mr-3">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
