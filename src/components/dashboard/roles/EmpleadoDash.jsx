import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function EmpleadoDash({ user, data, onRefresh, lastUpdate }) {
  // Debug temporal - ver qué datos llegan
  console.log('EmpleadoDash recibió data:', data);

  if (!data) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-pulse text-gray-400">Cargando datos del empleado...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mi Perfil Organizacional */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          Mi Perfil Organizacional
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Mis Documentos</p>
              <p className="text-2xl font-bold text-purple-600">{data.sharepoint_docs || 0}</p>
              <p className="text-xs text-gray-600">En SharePoint</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acceso Rápido Departamental */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          Mi Departamento
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to={`/departments/${user?.department_id || user?.department?.id}`}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-blue-800">Documentos del Depto</span>
            <span className="text-xs text-blue-600">
              {data.my_department_files?.recent_files || 0} recientes
            </span>
          </Link>

          <Link
            to="/team"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3h2a3 3 0 013 3v2a3 3 0 01-3 3H7z" />
            </svg>
            <span className="text-sm font-medium text-green-800">Mi Equipo</span>
            <span className="text-xs text-green-600">
              {data.department_team_count || 0} personas
            </span>
          </Link>

          <Link
            to="/department-calendar"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-purple-800">Calendario Depto</span>
            <span className="text-xs text-purple-600">Eventos compartidos</span>
          </Link>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          Mis Herramientas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/tasks" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm font-medium text-blue-800">Mis Tareas</span>
            <span className="text-xs text-blue-600">{data.pending_tasks || 0} pendientes</span>
          </Link>

          <Link to="/calendar" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-green-800">Mi Calendario</span>
            <span className="text-xs text-green-600">{data.events_today || 0} eventos</span>
          </Link>

          <Link to="/documents" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-purple-800">SharePoint</span>
            <span className="text-xs text-purple-600">{data.sharepoint_docs || 0} documentos</span>
          </Link>

          <button 
            onClick={onRefresh} 
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium text-gray-800">Actualizar</span>
            <span className="text-xs text-gray-600">Datos en vivo</span>
          </button>
        </div>
      </div>

      {/* 🆕 NUEVA SECCIÓN: Navegador de Carpetas Jerárquico */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Explorador SharePoint</h3>
          <div className="text-sm text-gray-500">
            {data?.total_documents_count || 0} archivos totales • Explorado {data?.max_depth_scanned || 0} niveles
          </div>
        </div>
        
        {/* Árbol de Carpetas */}
        {data?.folder_tree && data.folder_tree.length > 0 ? (
          <div className="space-y-2">
            {data.folder_tree.map((folder, index) => (
              <FolderTreeItem key={folder.id || index} folder={folder} level={0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm font-medium">Explorando estructura de carpetas...</p>
          </div>
        )}
        
        {/* Documentos Recientes con Ruta Completa */}
        {data?.recent_documents && data.recent_documents.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              Documentos Recientes ({data.total_recent_count || 0})
            </h4>
            <div className="space-y-2">
              {data.recent_documents.map((doc, index) => (
                <div key={doc.id || index} className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <FileIcon extension={doc.extension} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {doc.folderPath} • {new Date(doc.modified).toLocaleDateString('es-ES')} • {doc.modifiedBy}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors"
                    >
                      Abrir
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🆕 Componente auxiliar para mostrar árbol de carpetas
const FolderTreeItem = ({ folder, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`ml-${level * 4}`}>
      <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
        {folder.children && folder.children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
        </svg>
        <span className="text-sm font-medium text-gray-800">{folder.name}</span>
        <span className="ml-2 text-xs text-gray-500">({folder.childCount})</span>
        <a
          href={folder.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-blue-600 hover:text-blue-800"
        >
          Abrir
        </a>
      </div>
      
      {isExpanded && folder.children && folder.children.length > 0 && (
        <div className="ml-4">
          {folder.children.map((childFolder, index) => (
            <FolderTreeItem key={childFolder.id || index} folder={childFolder} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// 🆕 Componente auxiliar para mostrar iconos de archivos
const FileIcon = ({ extension }) => {
  const iconClass = "w-5 h-5";
  
  switch (extension?.toLowerCase()) {
    case 'pdf':
      return <svg className={`${iconClass} text-red-600`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>;
    case 'docx':
    case 'doc':
      return <svg className={`${iconClass} text-blue-600`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>;
    case 'xlsx':
    case 'xls':
      return <svg className={`${iconClass} text-green-600`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>;
    default:
      return <svg className={`${iconClass} text-gray-600`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>;
  }
};
