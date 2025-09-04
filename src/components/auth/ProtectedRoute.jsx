import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children }) {
    const auth = useAuth();
    return auth.isLoggedIn ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
