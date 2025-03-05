// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticatedFn } = useAuth();

  if (!isAuthenticatedFn()) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;
