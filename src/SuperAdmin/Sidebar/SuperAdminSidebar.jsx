import { Building2, ChevronDown, KeyRound, LayoutDashboard, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export default function SuperAdminSidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const schoolOpen = pathname.startsWith("/school-details");
  const credentialsActive = pathname.startsWith("/login-credentials");
  return (
    <aside className={`sa-sidebar ${open ? "is-open" : ""}`}>
      <div className="sa-sidebar-mobile"><span>Navigation</span><button onClick={onClose} aria-label="Close navigation"><X size={20} /></button></div>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => `sa-nav-link ${isActive ? "active" : ""}`} onClick={onClose}><LayoutDashboard size={22} /><span>Dashboard</span></NavLink>
        <div className={`sa-nav-group ${schoolOpen ? "active" : ""}`}>
          <div className="sa-nav-link"><Building2 size={22} /><span>School Details</span><ChevronDown size={18} className="sa-nav-chevron" /></div>
          <div className="sa-nav-children">
            <NavLink to="/school-details" end onClick={onClose}>School Details</NavLink>
            <NavLink to="/school-details/lists" onClick={onClose}>School Details Lists</NavLink>
          </div>
        </div>
        <NavLink to="/login-credentials" className={`sa-nav-link ${credentialsActive ? "active" : ""}`} onClick={onClose}><KeyRound size={22} /><span>Login Credentials</span></NavLink>
      </nav>
    </aside>
  );
}
