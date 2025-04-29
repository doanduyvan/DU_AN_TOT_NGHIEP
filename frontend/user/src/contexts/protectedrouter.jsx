import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, isAuthenticated, permissions } = useAuth();
    console.log(permissions);
    if (isAuthenticated) {
        if (permissions && permissions.length > 0) {
            return <Navigate to="/admin" />;
        } else {
            return <Navigate to="/" />;
        }
    }
    return children;
};

export default ProtectedRoute;
