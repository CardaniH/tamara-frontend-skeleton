import React from 'react';
import { Link } from 'react-router-dom';

export default function EmpleadoDash({ user, data, onRefresh }) {
  return (
    <div className="space-y-6">
      {/* Mi Perfil Organizacional */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Mi Perfil Organizacional
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Cargo/Rol</p>
            <p className="text-lg font-bold text-blue-800">
              {user?.role?.name || user?.position || 'No definido'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Departamento</p>
            <p className="text-lg font-bold text-green-800">
              {user?.department?.name || 'No asignado'}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Subdepartamento</p>
            <p className="text-lg font-bold text-purple-800">
              {user?.subdepartment?.name || 'No asignado'}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas Personales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Mis Tareas</p>
              <p className="text-2xl font-bold text-blue-600">{data.my_tasks || 0}</p>
              <p className="text-xs text-gray-600">{data.pending_tasks || 0} pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Eventos Hoy</p>
              <p className="text-2xl font-bold text-green-600">{data.events_today || 0}</p>
              <p className="text-xs text-gray-600">En calendario</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <span className="text-2xl"></span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Mis Documentos</p>
              <p className="text-2xl font-bold text-purple-600">{data.my_documents || 0}</p>
              <p className="text-xs text-gray-600">Acceso reciente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acceso Rápido Departamental */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Mi Departamento
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to={`/departments/${user?.department_id || user?.department?.id}`}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-3xl mb-2"></span>
            <span className="text-sm font-medium text-blue-800">Documentos del Depto</span>
            <span className="text-xs text-blue-600">
              {data.my_department_files?.recent_files || 0} recientes
            </span>
          </Link>

          <Link
            to="/team"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-3xl mb-2"></span>
            <span className="text-sm font-medium text-green-800">Mi Equipo</span>
            <span className="text-xs text-green-600">
              {data.department_team_count || 0} personas
            </span>
          </Link>

          <Link
            to="/department-calendar"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="text-3xl mb-2"></span>
            <span className="text-sm font-medium text-purple-800">Calendario Depto</span>
            <span className="text-xs text-purple-600">Eventos compartidos</span>
          </Link>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Mis Herramientas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/tasks" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-3xl mb-2"></span>
            <span className="text-sm font-medium text-blue-800">Mis Tareas</span>
            <span className="text-xs text-blue-600">{data.pending_tasks || 0} pendientes</span>
          </Link>

          <Link to="/calendar" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-3xl mb-2"></span>
            <span className="text-sm font-medium text-green-800">Mi Calendario</span>
            <span className="text-xs text-green-600">{data.events_today || 0} eventos</span>
          </Link>

          <Link to="/documents" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-3xl mb-2"></span>
            <span className="text-sm font-medium text-purple-800">Documentos</span>
            <span className="text-xs text-purple-600">SharePoint</span>
          </Link>

          <button onClick={onRefresh} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-3xl mb-2"></span>
            <span className="text-sm font-medium text-gray-800">Actualizar</span>
            <span className="text-xs text-gray-600">Datos</span>
          </button>
        </div>
      </div>

      {/* Documentos Recientes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Documentos Recientes
        </h3>
        <div className="space-y-3">
          {data.recent_documents && data.recent_documents.length > 0 ? (
            data.recent_documents.map((doc, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-2xl mr-3">
                  {doc.type === 'pdf' ? '📕' : doc.type === 'docx' ? '📘' : '📗'}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-600">Modificado {doc.modified}</p>
                </div>
                <span className="text-blue-600 hover:text-blue-800 text-sm">Abrir</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-2xl font-bold">?</span>
              </div>
              <p className="text-sm font-medium">No hay documentos recientes</p>
              <p className="text-xs text-gray-400 mt-1">Los documentos aparecerán cuando accedas a archivos en SharePoint</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
