import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout.jsx';
import LoginPage from './components/auth/LoginPage';
import Dash from './components/dashboard/Dash';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DepartmentManager from './components/admin/DepartmentManager';
import SubdepartmentManager from './components/admin/SubdepartmentManager';
import SharePointDocuments from './components/sharepoint/SharePointDocuments.jsx';
import ProjectsManager from './components/projects/ProjectsManager.jsx';
import ProjectDetails from './components/projects/ProjectDetails';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* todo lo que requiere sesión y el sidebar */}
     <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route index element={<Navigate to="/dashboard" />} />
  <Route path="/dashboard" element={<Dash />} />
  <Route path="/departments" element={<DepartmentManager />} />
  <Route path="/subdepartments" element={<SubdepartmentManager />} />
  <Route path="/projects" element={<ProjectsManager/>} />
  <Route path="/calendar" element={<div>Calendario - Próximamente</div>} />
  <Route path="/documents" element={<SharePointDocuments/>} />
  <Route path="/users" element={<div>Usuarios - Próximamente</div>} /></Route>
  <Route path="/projects/:projectId" element={<ProjectDetails />} />



          {/* login público */}
          <Route path="/login" element={<LoginPage />} />

          {/* cualquier ruta desconocida → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}