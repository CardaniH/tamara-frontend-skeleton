import React, { useState } from 'react';

export default function AuditorDash({ user, data, onRefresh }) {
  const [showUsersNoDepto, setShowUsersNoDepto] = useState(false);
  const [showUsersNoSub, setShowUsersNoSub] = useState(false);

  const usersNoDepto = data?.users_without_department || [];
  const usersNoSub = data?.users_without_subdepartment || [];
  const emptyDeptCount = data?.empty_departments_count ?? 0;
  const emptySubCount = data?.empty_subdepartments_count ?? 0;
  const emptyDeptList = data?.empty_departments_list || [];
  const emptySubList = data?.empty_subdepartments_list || [];
  const policy = data?.policy_flags || {};
  const activityToday = data?.activity_today ?? 0;
  const recent = data?.recent_activities || [];

  return (
    <div className="space-y-6">
      {/* Header Auditor */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <span className="mr-3"></span>
          Auditoría y Control Interno
        </h2>
        <p className="text-gray-600">
          Auditor: <span className="font-semibold text-blue-600">{user?.name}</span> • 
          <span className="text-sm ml-2">{user?.role?.name || 'Auditor'}</span>
        </p>
      </div>

      {/* Métricas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon="" label="Actividad Hoy" value={`${activityToday}%`} note="Usuarios activos" color="yellow" />
        <MetricCard 
          icon="" 
          label="Usuarios sin Depto" 
          value={usersNoDepto.length} 
          note="Ver lista" 
          color="red"
          onClick={() => setShowUsersNoDepto(true)}
        />
        <MetricCard 
          icon="" 
          label="Deptos sin usuarios" 
          value={emptyDeptCount} 
          note="Detalle abajo" 
          color="purple" 
        />
        <MetricCard 
          icon="" 
          label="Subdeptos sin usuarios" 
          value={emptySubCount} 
          note="Detalle abajo" 
          color="blue" 
        />
      </div>

      {/* Señales de Política */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Señales de Política
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <RowPill label="Jefes sin subdepartamento" value={policy?.jefes_sin_subdepartamento ?? 0} color="red" />
          <RowPill label="Directores sin departamento" value={policy?.directores_sin_departamento ?? 0} color="orange" />
          <RowPill label="Usuarios sin departamento" value={policy?.usuarios_sin_departamento ?? 0} color="purple" />
          <RowPill label="Usuarios sin subdepartamento" value={policy?.usuarios_sin_subdepartamento ?? 0} color="blue" />
        </div>
      </div>

      {/* Listas de vacíos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard 
          title="Departamentos sin usuarios" 
          icon="" 
          items={emptyDeptList.map(d => ({ primary: d.name}))}
          emptyText="Todos los departamentos tienen usuarios"
        />
        <ListCard 
          title="Subdepartamentos sin usuarios" 
          icon="" 
          items={emptySubList.map(s => ({ primary: s.name, secondary: `Departamento: ${s.department_name}` }))}
          emptyText="Todos los subdepartamentos tienen usuarios"
        />
      </div>

      {/* Actividad Reciente del Sistema */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2"></span> Actividad Reciente del Sistema
        </h3>
        <div className="space-y-3">
          {recent.length > 0 ? (
            recent.map((a, i) => (
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
              <p className="text-xs text-gray-400 mt-1">La actividad aparecerá cuando los usuarios interactúen con el sistema</p>
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
        <div className="text-gray-700">
          <p className="font-medium">Acciones Rápidas</p>
          <p className="text-sm text-gray-500">Revisa listas, exporta o sincroniza auditorías.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800"
          >
            Actualizar
          </button>
          <button 
            onClick={() => setShowUsersNoSub(true)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800"
          >
            Usuarios sin Subdepto
          </button>
          <button 
            onClick={() => setShowUsersNoDepto(true)}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-800"
          >
            Usuarios sin Depto
          </button>
        </div>
      </div>

      {/* Modal: Usuarios sin departamento */}
      <Modal open={showUsersNoDepto} onClose={() => setShowUsersNoDepto(false)} title="Usuarios sin Departamento">
        <UsersTable rows={usersNoDepto} columns={['name','email','role']} />
      </Modal>

      {/* Modal: Usuarios sin subdepartamento */}
      <Modal open={showUsersNoSub} onClose={() => setShowUsersNoSub(false)} title="Usuarios sin Subdepartamento">
        <UsersTable rows={usersNoSub} columns={['name','email','role','department']} />
      </Modal>
    </div>
  );
}

function MetricCard({ icon, label, value, note, color = 'blue', onClick }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="bg-white text-left w-full p-6 rounded-lg shadow hover:shadow-md transition-shadow"
    >
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
    </button>
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

function ListCard({ title, icon, items = [], emptyText }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">{icon}</span> {title}
      </h3>
      <div className="space-y-2 max-h-64 overflow-auto">
        {items.length > 0 ? items.map((it, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-800">{it.primary}</p>
            {it.secondary && <p className="text-xs text-gray-600">{it.secondary}</p>}
          </div>
        )) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm font-medium">{emptyText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl px-2">×</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function UsersTable({ rows = [], columns = [] }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-medium text-gray-700 capitalize">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b">
              {columns.map((c) => (
                <td key={c} className="px-3 py-2 text-gray-800">{r[c] ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-sm text-gray-500 mt-3 text-center">No hay registros para mostrar.</p>
      )}
    </div>
  );
}
