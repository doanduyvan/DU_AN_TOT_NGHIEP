import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

const CheckRoute = ({ children, role, permission }) => {
    const { currentUser, loading, hasRole, permissions } = useAuth();
    if (Array.isArray(permissions) && permissions.length === 0 && hasRole(role)) {
        return <Navigate to="/" />;
    }
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div id="wifi-loader">
                    <svg viewBox="0 0 86 86" className="circle-outer">
                        <circle r={40} cy={43} cx={43} className="back" />
                        <circle r={40} cy={43} cx={43} className="front" />
                        <circle r={40} cy={43} cx={43} className="new" />
                    </svg>
                    <svg viewBox="0 0 60 60" className="circle-middle">
                        <circle r={27} cy={30} cx={30} className="back" />
                        <circle r={27} cy={30} cx={30} className="front" />
                    </svg>
                    <div data-text="Loading..." className="text" />
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default CheckRoute;