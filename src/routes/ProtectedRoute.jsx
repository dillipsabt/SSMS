import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (roles.length && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
