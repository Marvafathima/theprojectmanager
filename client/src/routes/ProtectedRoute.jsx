import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children }) => {


    const { isAuthenticated, loading, error } = useSelector(state => state.auth);
    return isAuthenticated ? <Navigate to="/signup" replace /> : children;
}
