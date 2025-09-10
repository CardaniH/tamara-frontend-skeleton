// src/components/sharepoint/SharePointDocuments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useSharePointDocuments from '../dashboard/hooks/useSharePointDocuments.js';

const SharePointDocuments = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    const {
        documents,
        pagination,
        loading,
        error,
        filters,
        stats,
        searchMode,
        loadDocuments,
        searchDocuments,
        loadStats,
        applyFilters,
        clearFilters,
    } = useSharePointDocuments();

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const handleSearch = (e) => {
        e.preventDefault();
        searchDocuments(searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        loadDocuments(1, true);
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (extension) => {
        const icons = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            xls: '📊',
            xlsx: '📊',
            ppt: '📈',
            pptx: '📈',
            txt: '📄',
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
            gif: '🖼️',
            zip: '🗜️',
            rar: '🗜️',
        };
        return icons[extension?.toLowerCase()] || '📎';
    };

    if (loading && documents.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando documentos de SharePoint...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                📁 SharePoint Documents
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Gestiona y busca documentos de SharePoint • Usuario: <span className="font-medium">{user?.name}</span>
                            </p>
                        </div>
                        {stats && (
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">{stats.total_documents?.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Documentos disponibles</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estadísticas */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl">📊</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-blue-100">Total Documentos</p>
                                    <p className="text-2xl font-bold">
                                        {stats.total_documents?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl">🆕</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-green-100">Recientes</p>
                                    <p className="text-2xl font-bold">
                                        {stats.recent_documents?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl">📁</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-purple-100">Tipos de Archivo</p>
                                    <p className="text-2xl font-bold">
                                        {Object.keys(stats.by_extension || {}).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl">💾</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-orange-100">Archivos Grandes</p>
                                    <p className="text-2xl font-bold">
                                        {stats.by_size_range?.xlarge || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Búsqueda y Filtros */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar documentos por nombre, carpeta o autor..."
                                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? '🔄' : '🔍'} Buscar
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-3 border rounded-lg transition-colors ${showFilters ? 'bg-gray-100 border-gray-400' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                🎛️ Filtros
                            </button>
                        </div>
                    </form>

                    {/* Panel de filtros */}
                    {showFilters && (
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de archivo</label>
                                    <select
                                        value={filters.type || ''}
                                        onChange={(e) => applyFilters({ type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Todos los tipos</option>
                                        <option value="pdf">PDF</option>
                                        <option value="docx">Word</option>
                                        <option value="xlsx">Excel</option>
                                        <option value="pptx">PowerPoint</option>
                                        <option value="txt">Texto</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Desde fecha</label>
                                    <input
                                        type="date"
                                        value={filters.date_from || ''}
                                        onChange={(e) => applyFilters({ date_from: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasta fecha</label>
                                    <input
                                        type="date"
                                        value={filters.date_to || ''}
                                        onChange={(e) => applyFilters({ date_to: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Carpeta</label>
                                    <input
                                        type="text"
                                        value={filters.folder || ''}
                                        onChange={(e) => applyFilters({ folder: e.target.value })}
                                        placeholder="Nombre de carpeta..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        🧹 Limpiar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Indicadores de búsqueda/filtros activos */}
                    {(searchMode || Object.keys(filters).some(key => filters[key])) && (
                        <div className="flex items-center gap-2 mt-4 text-sm">
                            {searchMode && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    🔍 Búsqueda: "{searchQuery}"
                                </span>
                            )}
                            {Object.entries(filters).map(([key, value]) => value && (
                                <span key={key} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                    {key}: {value}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="text-red-400 text-xl mr-3">⚠️</div>
                            <div>
                                <h3 className="text-red-800 font-medium">Error al cargar documentos</h3>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de documentos */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading && documents.length > 0 && (
                        <div className="bg-blue-50 border-b border-blue-200 p-3">
                            <div className="flex items-center text-blue-800">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Actualizando documentos...
                            </div>
                        </div>
                    )}

                    {documents.length === 0 && !loading ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron documentos</h3>
                            <p className="text-gray-500">
                                {searchMode 
                                    ? 'Intenta con términos de búsqueda diferentes o limpia los filtros'
                                    : 'No hay documentos disponibles en este momento'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Documento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tamaño
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Modificado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Autor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {documents.map((doc, index) => (
                                        <tr key={doc.id || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 text-2xl mr-3">
                                                        {getFileIcon(doc.extension)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {doc.name || 'Archivo sin nombre'}
                                                        </div>
                                                        {doc.folderPath && (
                                                            <div className="text-sm text-gray-500">
                                                                📁 {doc.folderPath}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {formatFileSize(doc.size)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(doc.modified)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-500">
                                                    {doc.modifiedBy || 'Autor desconocido'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {doc.webUrl && (
                                                        <a
                                                            href={doc.webUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                                                        >
                                                            👁️ Ver
                                                        </a>
                                                    )}
                                                    {doc.downloadUrl && (
                                                        <a
                                                            href={doc.downloadUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded border border-green-200 hover:bg-green-50"
                                                        >
                                                            💾 Descargar
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación */}
                    {pagination.last_page > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => loadDocuments(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1 || loading}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Anterior
                                </button>
                                <button
                                    onClick={() => loadDocuments(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page || loading}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente →
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{pagination.from || 1}</span> a{' '}
                                        <span className="font-medium">{pagination.to || documents.length}</span> de{' '}
                                        <span className="font-medium">{pagination.total || documents.length}</span> resultados
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {/* Botón anterior */}
                                        <button
                                            onClick={() => loadDocuments(pagination.current_page - 1)}
                                            disabled={pagination.current_page === 1 || loading}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            ←
                                        </button>
                                        
                                        {/* Números de página */}
                                        {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                                            let page;
                                            if (pagination.last_page <= 5) {
                                                page = i + 1;
                                            } else if (pagination.current_page <= 3) {
                                                page = i + 1;
                                            } else if (pagination.current_page >= pagination.last_page - 2) {
                                                page = pagination.last_page - 4 + i;
                                            } else {
                                                page = pagination.current_page - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => loadDocuments(page)}
                                                    disabled={loading}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        page === pagination.current_page
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } disabled:opacity-50`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                        
                                        {/* Botón siguiente */}
                                        <button
                                            onClick={() => loadDocuments(pagination.current_page + 1)}
                                            disabled={pagination.current_page === pagination.last_page || loading}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            →
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharePointDocuments;
