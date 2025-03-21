import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, isAuthenticated} = useAuth();

        if (isAuthenticated === null) {
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;
