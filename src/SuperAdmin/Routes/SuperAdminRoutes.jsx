import { Navigate, Route, Routes } from "react-router-dom";
import SuperAdminLogin from "../Login/SuperAdminLogin";
import SuperAdminDashboard from "../Dashboard/SuperAdminDashboard";
import SuperAdminLayout from "../Layout/SuperAdminLayout";
import SuperAdminProtectedRoute from "./SuperAdminProtectedRoute";
import SchoolDetails from "../Schools/SchoolDetails";
import SchoolDetailsList from "../Schools/SchoolDetailsList";
import LoginCredentials from "../Credentials/LoginCredentials";

function protectedPage(page) {
    return <SuperAdminProtectedRoute>
        <SuperAdminLayout>{page}</SuperAdminLayout>
    </SuperAdminProtectedRoute>;
}
export default function SuperAdminRoutes() {
    return <Routes>
        <Route path="/login" element={<SuperAdminLogin />} />
        <Route path="/dashboard" element={protectedPage(<SuperAdminDashboard />)} />
        <Route path="/school-details" element={protectedPage(<SchoolDetails />)} />
        <Route path="/school-details/lists" element={protectedPage(<SchoolDetailsList />)} />
        <Route path="/login-credentials" element={protectedPage(<LoginCredentials />)} />
        <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>;
}
