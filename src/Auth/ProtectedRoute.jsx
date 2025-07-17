import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  console.log("ProtectedRoute state:", state);

  if (!state.isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
