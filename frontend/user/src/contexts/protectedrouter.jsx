import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authcontext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, isAuthenticated} = useAuth();
    if (isAuthenticated) {
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;
