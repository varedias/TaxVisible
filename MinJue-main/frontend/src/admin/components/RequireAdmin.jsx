import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RequireAdmin = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();
    const location = useLocation();

    // 等待加载完成
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">加载中...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return <div className="p-8 text-center text-red-500">Access Denied: Admins Only</div>;
    }

    return children;
};

export default RequireAdmin;
