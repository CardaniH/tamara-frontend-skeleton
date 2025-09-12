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

   const handlePageChange = (page) => {
  if (page < 1 || loading) return;
  searchMode && searchQuery
    ? searchDocuments(searchQuery, page)
    : loadDocuments(page);
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
        const iconClass = "w-6 h-6";
        const icons = {
            pdf: (
                <svg className={`${iconClass} text-red-500`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            ),
            doc: (
                <svg className={`${iconClass} text-blue-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            ),
            docx: (
                <svg className={`${iconClass} text-blue-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            ),
            xls: (
                <svg className={`${iconClass} text-emerald-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            ),
            xlsx: (
                <svg className={`${iconClass} text-emerald-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            ),
            ppt: (
                <svg className={`${iconClass} text-orange-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            ),
            pptx: (
                <svg className={`${iconClass} text-orange-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            ),
            txt: (
                <svg className={`${iconClass} text-slate-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            ),
            jpg: (
                <svg className={`${iconClass} text-purple-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            ),
            jpeg: (
                <svg className={`${iconClass} text-purple-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            ),
            png: (
                <svg className={`${iconClass} text-purple-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            ),
            gif: (
                <svg className={`${iconClass} text-purple-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            ),
            // VIDEOS
            mp4: (
                <svg className={`${iconClass} text-rose-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
            ),
            mov: (
                <svg className={`${iconClass} text-rose-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
            ),
            avi: (
                <svg className={`${iconClass} text-rose-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
            ),
            mkv: (
                <svg className={`${iconClass} text-rose-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
            ),
            // ARCHIVOS COMPRIMIDOS
            zip: (
                <svg className={`${iconClass} text-amber-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
                    <path d="M8 6h1v1H8V6zM9 8H8v1h1V8zM8 10h1v1H8v-1zM9 12H8v1h1v-1z" />
                </svg>
            ),
            rar: (
                <svg className={`${iconClass} text-amber-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
                    <path d="M8 6h1v1H8V6zM9 8H8v1h1V8zM8 10h1v1H8v-1zM9 12H8v1h1v-1z" />
                </svg>
            ),
            '7z': (
                <svg className={`${iconClass} text-amber-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
                    <path d="M8 6h1v1H8V6zM9 8H8v1h1V8zM8 10h1v1H8v-1zM9 12H8v1h1v-1z" />
                </svg>
            ),
        };
        return icons[extension?.toLowerCase()] || (
            <svg className={`${iconClass} text-slate-500`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
        );
    };

    if (loading && documents.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-slate-600">Cargando documentos de SharePoint...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    SharePoint Documents
                                </h1>
                                <p className="text-slate-600 mt-2">
                                    Gestiona y busca documentos de SharePoint • Usuario: <span className="font-medium text-blue-600">{user?.name}</span>
                                </p>
                            </div>
                        </div>
                        {stats && (
                            <div className="text-right">
                                <p className="text-3xl font-bold text-blue-600">{stats.total_documents?.toLocaleString()}</p>
                                <p className="text-sm text-slate-500">Documentos disponibles</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estadísticas */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-white/20 rounded-lg">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-blue-100 text-sm font-medium">Total Documentos</p>
                                    <p className="text-2xl font-bold">
                                        {stats.total_documents?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-white/20 rounded-lg">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-emerald-100 text-sm font-medium">Recientes</p>
                                    <p className="text-2xl font-bold">
                                        {stats.recent_documents?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-white/20 rounded-lg">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-purple-100 text-sm font-medium">Tipos de Archivo</p>
                                    <p className="text-2xl font-bold">
                                        {Object.keys(stats.by_extension || {}).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-sm p-6 text-white">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-white/20 rounded-lg">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-amber-100 text-sm font-medium">Archivos Grandes</p>
                                    <p className="text-2xl font-bold">
                                        {stats.by_size_range?.xlarge || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Búsqueda y Filtros */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar documentos por nombre, carpeta o autor..."
                                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span>Buscar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-3 border rounded-lg transition-colors flex items-center space-x-2 ${
                                    showFilters 
                                        ? 'bg-slate-100 border-slate-400 text-slate-700' 
                                        : 'border-slate-300 hover:bg-slate-50 text-slate-600'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                </svg>
                                <span>Filtros</span>
                            </button>
                        </div>
                    </form>

                    {/* Panel de filtros */}
                    {showFilters && (
                        <div className="border-t border-slate-200 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de archivo</label>
                                    <select
                                        value={filters.type || ''}
                                        onChange={(e) => applyFilters({ type: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Todos los tipos</option>
                                        <option value="pdf">PDF</option>
                                        <option value="docx">Word</option>
                                        <option value="xlsx">Excel</option>
                                        <option value="pptx">PowerPoint</option>
                                        <option value="txt">Texto</option>
                                        <option value="mp4">Video MP4</option>
                                        <option value="mov">Video MOV</option>
                                        <option value="avi">Video AVI</option>
                                        <option value="mkv">Video MKV</option>
                                        <option value="zip">Archivo ZIP</option>
                                        <option value="rar">Archivo RAR</option>
                                        <option value="7z">Archivo 7Z</option>
                                        <option value="jpg">Imagen JPG</option>
                                        <option value="png">Imagen PNG</option>
                                        <option value="gif">Imagen GIF</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Desde fecha</label>
                                    <input
                                        type="date"
                                        value={filters.date_from || ''}
                                        onChange={(e) => applyFilters({ date_from: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hasta fecha</label>
                                    <input
                                        type="date"
                                        value={filters.date_to || ''}
                                        onChange={(e) => applyFilters({ date_to: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Carpeta</label>
                                    <input
                                        type="text"
                                        value={filters.folder || ''}
                                        onChange={(e) => applyFilters({ folder: e.target.value })}
                                        placeholder="Nombre de carpeta..."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="w-full px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        <span>Limpiar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Indicadores de búsqueda/filtros activos */}
                    {(searchMode || Object.keys(filters).some(key => filters[key])) && (
                        <div className="flex items-center gap-2 mt-4 text-sm">
                            {searchMode && (
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                    <span>Búsqueda: "{searchQuery}"</span>
                                </span>
                            )}
                            {Object.entries(filters).map(([key, value]) => value && (
                                <span key={key} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
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
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-red-800 font-medium">Error al cargar documentos</h3>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de documentos */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading && documents.length > 0 && (
                        <div className="bg-blue-50 border-b border-blue-200 p-3">
                            <div className="flex items-center text-blue-800">
                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Actualizando documentos...
                            </div>
                        </div>
                    )}

                    {documents.length === 0 && !loading ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron documentos</h3>
                            <p className="text-slate-500">
                                {searchMode 
                                    ? 'Intenta con términos de búsqueda diferentes o limpia los filtros'
                                    : 'No hay documentos disponibles en este momento'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Documento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Tamaño
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Modificado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Autor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {documents.map((doc, index) => (
                                        <tr key={doc.id || index} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 mr-3">
                                                        {getFileIcon(doc.extension)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {doc.name || 'Archivo sin nombre'}
                                                        </div>
                                                        {doc.folderPath && (
                                                            <div className="text-sm text-slate-500 flex items-center">
                                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                                </svg>
                                                                {doc.folderPath}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-900">
                                                    {formatFileSize(doc.size)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-900">
                                                    {formatDate(doc.modified)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-500">
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
                                                            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md border border-blue-200 hover:bg-blue-50 transition-colors flex items-center space-x-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>Ver</span>
                                                        </a>
                                                    )}
                                                    {doc.downloadUrl && (
                                                        <a
                                                            href={doc.downloadUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-emerald-600 hover:text-emerald-900 px-3 py-1 rounded-md border border-emerald-200 hover:bg-emerald-50 transition-colors flex items-center space-x-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>Descargar</span>
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
{/* Paginación - VERSIÓN MÁS ROBUSTA */}
{((pagination && pagination.last_page > 1) || (documents.length > 0 && searchMode)) && (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200">
        <div className="flex-1 flex justify-between sm:hidden">
            <button
                onClick={() => handlePageChange(Math.max(1, (pagination?.current_page || 1) - 1))}
                disabled={(pagination?.current_page || 1) === 1 || loading}
                className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Anterior
            </button>
            <button
                onClick={() => handlePageChange((pagination?.current_page || 1) + 1)}
                disabled={(pagination?.current_page || 1) === (pagination?.last_page || 1) || loading}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Siguiente
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p className="text-sm text-slate-700">
                    Mostrando <span className="font-medium">{pagination?.from || 1}</span> a{' '}
                    <span className="font-medium">{pagination?.to || documents.length}</span> de{' '}
                    <span className="font-medium">{pagination?.total || documents.length}</span> resultados
                    {searchMode && <span className="text-blue-600 ml-2">(Búsqueda activa)</span>}
                </p>
            </div>
            <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {/* Botón anterior */}
                    <button
                        onClick={() => handlePageChange(Math.max(1, (pagination?.current_page || 1) - 1))}
                        disabled={(pagination?.current_page || 1) === 1 || loading}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    {/* Números de página */}
                    {pagination && pagination.last_page > 1 && Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
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
                                onClick={() => handlePageChange(page)}
                                disabled={loading}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    page === pagination.current_page
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                                } disabled:opacity-50`}
                            >
                                {page}
                            </button>
                        );
                    })}
                    
                    {/* Botón siguiente */}
                    <button
                        onClick={() => handlePageChange((pagination?.current_page || 1) + 1)}
                        disabled={(pagination?.current_page || 1) === (pagination?.last_page || 1) || loading}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
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
