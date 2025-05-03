import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';
import { Loading } from "../contexts/loading";

const CheckRoute = ({ children, role, permission }) => {
    const { currentUser, loading, hasRole, permissions } = useAuth();
    if (Array.isArray(permissions) && permissions.length === 0 && hasRole(role)) {
        return <Navigate to="/" />;
    }
    
    if (loading) {
        return <Loading isLoading={loading} />;
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default CheckRoute;