import React from 'react';
import { Link } from 'react-router-dom';

export default function PrestadorDash({ user, data, onRefresh }) {
  const protocols = data?.prestador_protocols ?? 0;
  const documents = data?.prestador_documents ?? 0;
  const pendingSignatures = data?.prestador_pending_signatures ?? 0;
  const activities = data?.prestador_activities || [];

  return (
    <div className="space-y-6">
      {/* Header del Prestador */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <span className="mr-3"></span>
          Gestión de Protocolos
        </h2>
        <p className="text-gray-600">
          Prestador: <span className="font-semibold text-green-600">{user?.name}</span> • 
          <span className="text-sm ml-2">{user?.role?.name || 'Prestador'}</span>
          {user?.department?.name && (
            <span className="text-sm ml-2">• Departamento: {user.department.name}</span>
          )}
        </p>
      </div>

      {/* Métricas de Protocolos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          icon="" 
          label="Protocolos Activos" 
          value={protocols} 
          note="Basados en equipo" 
          color="blue" 
        />
        <MetricCard 
          icon="" 
          label="Documentos" 
          value={documents} 
          note="Relacionados" 
          color="green" 
        />
        <MetricCard 
          icon="" 
          label="Pendientes Firma" 
          value={pendingSignatures} 
          note="Estimadas" 
          color="yellow" 
        />
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Acciones de Protocolo
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/protocols"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-blue-800">Mis Protocolos</p>
                <p className="text-xs text-blue-600">{protocols} activos</p>
              </div>
            </Link>

            <Link
              to="/documents"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-green-800">Documentos</p>
                <p className="text-xs text-green-600">{documents} archivos</p>
              </div>
            </Link>

            <Link
              to="/signatures"
              className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-yellow-800">Firmas</p>
                <p className="text-xs text-yellow-600">{pendingSignatures} pendientes</p>
              </div>
            </Link>

            <button
              onClick={onRefresh}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3"></span>
              <div>
                <p className="font-medium text-gray-800">Actualizar</p>
                <p className="text-xs text-gray-600">Datos</p>
              </div>
            </button>
          </div>
        </div>

        {/* Estado de Protocolos - Solo datos reales */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2"></span> Estado de Protocolos
          </h3>
          <div className="space-y-3">
            <StatusRow 
              label="Protocolos activos" 
              value={protocols} 
              color="blue" 
            />
            <StatusRow 
              label="Documentos relacionados" 
              value={documents} 
              color="green" 
            />
            <StatusRow 
              label="Pendientes de firma" 
              value={pendingSignatures} 
              color="yellow" 
            />
            {user?.department?.name && (
              <StatusRow 
                label="Departamento asignado" 
                value={user.department.name} 
                color="purple" 
              />
            )}
          </div>
        </div>
      </div>

      {/* Información de Protocolos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Información de Protocolos
        </h3>
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-2xl font-bold">?</span>
          </div>
          <p className="text-sm font-medium">Sistema de protocolos en desarrollo</p>
          <p className="text-xs text-gray-400 mt-1">Los protocolos detallados aparecerán cuando el sistema esté completamente implementado</p>
          {protocols > 0 && (
            <p className="text-xs text-blue-600 mt-2">
              Actualmente tienes {protocols} protocolos estimados basados en tu departamento
            </p>
          )}
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Mi Actividad Reciente
        </h3>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
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
              <p className="text-xs text-gray-400 mt-1">Tu actividad aparecerá cuando interactúes con el sistema</p>
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

function StatusRow({ label, value, color = 'blue' }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium text-gray-700">{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
        {value ?? 0}
      </span>
    </div>
  );
}
