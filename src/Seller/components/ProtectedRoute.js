import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.js';
import Loading from '../../Loading.js'

function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useContext(UserContext); // Assuming UserContext provides loading state
  const location = useLocation();

  // Optional: Handle loading state from UserContext
  if (isLoading) {
       return <Loading />;
  }

  // Check if user exists and has the required role
  if (!user || (requiredRole && user.role !== requiredRole)) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user exists and has the correct role, render the child component
  return children;
}

export default ProtectedRoute;