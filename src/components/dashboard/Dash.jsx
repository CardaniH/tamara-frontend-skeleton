import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Dash() {
  const { user } = useAuth();
  const isAdmin = user?.role_id === 1;

  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          ¡Bienvenido{isAdmin ? ' Admin' : ''}, {user?.name}!
        </h1>
        <p className="mt-2">
          {isAdmin 
            ? 'Panel de administración - Gestiona tu organización' 
            : 'Tu espacio personal - Revisa tus tareas y actividades'}
        </p>
      </div>

      {/* Tarjetas de información */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isAdmin ? (
          // Vista para administradores
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">👥</span> Gestión de Usuarios
              </h3>
              <p className="text-gray-600 mt-2">Administra roles y permisos</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">🏢</span> Departamentos
              </h3>
              <p className="text-gray-600 mt-2">Estructura organizacional</p>
              <p className="text-2xl font-bold text-green-600 mt-2">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">✅</span> Tareas Totales
              </h3>
              <p className="text-gray-600 mt-2">Todas las tareas del sistema</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">0</p>
            </div>
          </>
        ) : (
          // Vista para empleados
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">✅</span> Mis Tareas
              </h3>
              <p className="text-gray-600 mt-2">Tareas pendientes</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">📅</span> Mi Calendario
              </h3>
              <p className="text-gray-600 mt-2">Eventos próximos</p>
              <p className="text-2xl font-bold text-green-600 mt-2">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">📁</span> Documentos
              </h3>
              <p className="text-gray-600 mt-2">Archivos recientes</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">0</p>
            </div>
          </>
        )}
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isAdmin ? (
            <>
              <button className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <span className="block text-2xl mb-1">👥</span>
                <span className="text-sm">Usuarios</span>
              </button>
              <button className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <span className="block text-2xl mb-1">🏢</span>
                <span className="text-sm">Departamentos</span>
              </button>
              <button className="p-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                <span className="block text-2xl mb-1">✅</span>
                <span className="text-sm">Tareas</span>
              </button>
              <button className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                <span className="block text-2xl mb-1">📊</span>
                <span className="text-sm">Reportes</span>
              </button>
            </>
          ) : (
            <>
              <button className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <span className="block text-2xl mb-1">✅</span>
                <span className="text-sm">Mis Tareas</span>
              </button>
              <button className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <span className="block text-2xl mb-1">📅</span>
                <span className="text-sm">Calendario</span>
              </button>
              <button className="p-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                <span className="block text-2xl mb-1">📁</span>
                <span className="text-sm">Documentos</span>
              </button>
              <button className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                <span className="block text-2xl mb-1">📊</span>
                <span className="text-sm">Mi Perfil</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
