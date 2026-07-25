import { useState } from "react";
import SuperAdminHeader from "../Header/SuperAdminHeader";
import SuperAdminSidebar from "../Sidebar/SuperAdminSidebar";
import "../superAdmin.css";

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="sa-app">
      <SuperAdminHeader onMenuClick={() => setSidebarOpen(true)} />
      {sidebarOpen && <button className="sa-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <SuperAdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="sa-content">{children}</main>
    </div>
  );
}
