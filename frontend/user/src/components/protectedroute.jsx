import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

const ProtectedRoute = ({ children, role, permission}) => {
    const { currentUser, loading, hasPermission, hasRole } = useAuth();
    if (hasRole(role) && !hasPermission(permission)) {
        return <Navigate to="/" />;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;