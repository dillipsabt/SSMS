// import { Navigate } from "react-router-dom";

export default function SuperAdminProtectedRoute({ children }) {
  return sessionStorage.getItem("superAdminAuthenticated") === "true" && sessionStorage.getItem("superAdminToken") ? children : <Navigate to="/login" replace />;
}
