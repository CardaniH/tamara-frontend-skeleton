import React from 'react';
import { Link } from 'react-router-dom';

export default function JefeDash({ user, data, onRefresh }) {
  const subdeptName = user?.subdepartment?.name || 'Subdepartamento';
  const teamCount = data?.subdepartment_team_count ?? 0;
  const projects = data?.subdepartment_projects ?? 0;
  const pending = data?.subdepartment_pending_tasks ?? 0;
  const files = data?.subdepartment_files || { recent_files: 0, shared_documents: 0, subdepartment_folders: 0 };
  const activities = data?.subdepartment_activities || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <span className="mr-3"></span>
          Jefatura de {subdeptName}
        </h2>
        <p className="text-gray-600">
          Jefe: <span className="font-semibold text-blue-600">{user?.name}</span> • 
          <span className="text-sm ml-2">{user?.role?.name || 'Jefe de Subdepartamento'}</span>
        </p>
      </div>

      {/* Métricas del Subdepartamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon="" label="Mi Equipo" value={teamCount} note="Personas" color="blue" />
        <MetricCard icon="" label="Proyectos" value={projects} note="Activos" color="green" />
        <MetricCard icon="" label="Tareas Pendientes" value={0} note="Próximamente" color="yellow" />
        <MetricCard icon="" label="Documentos" value={0} note="SharePoint próximamente" color="purple" />
      </div>

      {/* Gestión del Subdepartamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Gestión del Subdepartamento
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/team" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-blue-800">Mi Equipo</p>
                <p className="text-xs text-blue-600">{teamCount} personas</p>
              </div>
            </Link>

            <Link to="/projects" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-green-800">Proyectos</p>
                <p className="text-xs text-green-600">{projects} activos</p>
              </div>
            </Link>

            <Link to="/tasks" className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-yellow-800">Tareas</p>
                <p className="text-xs text-yellow-600">Próximamente</p>
              </div>
            </Link>

            <button onClick={onRefresh} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-gray-800">Actualizar</p>
                <p className="text-xs text-gray-600">Datos del subdepto</p>
              </div>
            </button>
          </div>
        </div>

        {/* Rendimiento - Solo datos reales */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Información del Equipo
          </h3>
          <div className="space-y-3">
            <RowPill label="Total de personas" value={teamCount} color="blue" />
            <RowPill label="Proyectos asignados" value={projects} color="green" />
            <RowPill label="Estado del subdepartamento" value={teamCount > 0 ? "Activo" : "Sin equipo"} color={teamCount > 0 ? "green" : "gray"} />
          </div>
        </div>
      </div>

      {/* Documentos del Subdepartamento */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Documentos del Subdepartamento
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <InfoBadge label="Recientes" value={0} color="blue" />
          <InfoBadge label="Compartidos" value={0} color="purple" />
          <InfoBadge label="Carpetas" value={0} color="gray" />
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Los documentos aparecerán cuando se integre SharePoint
        </p>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Actividad Reciente
        </h3>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((a, i) => (
              <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-lg mr-3">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{a.action}</p>
                  <p className="text-xs text-gray-600">{a.user} • {a.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-2xl font-bold">?</span>
              </div>
              <p className="text-sm font-medium">No hay actividad reciente registrada</p>
              <p className="text-xs text-gray-400 mt-1">La actividad aparecerá cuando el equipo interactúe con el sistema</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, note, color = 'blue' }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
          <p className={`text-xs text-${color}-600`}>{note}</p>
        </div>
      </div>
    </div>
  );
}

function RowPill({ label, value, color = 'blue' }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium text-gray-700">{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
        {value ?? 0}
      </span>
    </div>
  );
}

function InfoBadge({ label, value, color = 'blue' }) {
  return (
    <div className={`p-4 bg-${color}-50 rounded-lg text-${color}-800 text-center`}>
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}
