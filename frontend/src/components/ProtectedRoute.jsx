import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Retrieve the auth object from sessionStorage
  const authData = sessionStorage.getItem("auth");
  const auth = authData ? JSON.parse(authData) : null;

  if (!auth || !auth.token) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;