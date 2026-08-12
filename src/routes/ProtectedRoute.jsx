import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { token, role, isAdministration } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;
  const hasRequiredRole =
    roles.includes(role) ||
    (roles.includes("staff-administration") &&
      role === "staff-portal" &&
      isAdministration);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (roles.length && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
