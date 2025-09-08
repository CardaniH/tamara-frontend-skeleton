import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminGlobalDash({ user, data, onRefresh }) {
  return (
    <div className="space-y-6">
      {/* Métricas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{data.total_users || 0}</p>
              <p className="text-xs text-green-600">+{data.new_users_week || 0} esta semana</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Departamentos</p>
              <p className="text-2xl font-bold text-gray-900">{data.total_departments || 0}</p>
              <p className="text-xs text-blue-600">{data.total_subdepartments || 0} subdepartamentos</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">SharePoint Docs</p>
              <p className="text-2xl font-bold text-gray-900">{data.sharepoint_docs || 0}</p>
              <p className="text-xs text-purple-600">+{data.new_docs_week || 0} esta semana</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Actividad Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{data.activity_today || 0}%</p>
              <p className="text-xs text-yellow-600">Usuarios activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Acciones Administrativas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/users"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-blue-800">Gestionar Usuarios</p>
                <p className="text-xs text-blue-600">{data.total_users || 0} usuarios</p>
              </div>
            </Link>

            <Link
              to="/departments"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-green-800">Departamentos</p>
                <p className="text-xs text-green-600">{data.total_departments || 0} deptos</p>
              </div>
            </Link>

            <Link
              to="/sharepoint"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-purple-800">SharePoint</p>
                <p className="text-xs text-purple-600">Gestionar docs</p>
              </div>
            </Link>

            <button
              onClick={onRefresh}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-gray-800">Actualizar</p>
                <p className="text-xs text-gray-600">Datos del sistema</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Resumen de Roles
          </h3>
          <div className="space-y-3">
            {[
              { role: 'Admin Global', count: data.admin_count || 0, color: 'red', icon: '' },
              { role: 'Directores', count: data.director_count || 0, color: 'purple', icon: '' },
              { role: 'Jefes', count: data.jefe_count || 0, color: 'blue', icon: '' },
              { role: 'Empleados', count: data.empleado_count || 0, color: 'green', icon: '' },
              { role: 'Auditores', count: data.auditor_count || 0, color: 'yellow', icon: '' },
              { role: 'Prestadores', count: data.prestador_count || 0, color: 'gray', icon: '' }
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

      {/* Actividad Reciente */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Actividad Reciente del Sistema
        </h3>
        <div className="space-y-3">
          {data.recent_activities && data.recent_activities.length > 0 ? (
            data.recent_activities.map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-lg mr-3">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-2xl font-bold">?</span>
              </div>
              <p className="text-sm font-medium">No hay actividad reciente registrada</p>
              <p className="text-xs text-gray-400 mt-1">La actividad aparecerá cuando los usuarios interactúen con el sistema</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
