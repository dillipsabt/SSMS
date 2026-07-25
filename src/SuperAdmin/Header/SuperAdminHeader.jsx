import { Bell, Mail, Menu, Search, UserCircle2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logoutSuperAdmin } from "../../features/SuperAdmin/Authentication/superAdminAuthSlice";
import logo from "../../assets/logo-color 1.png";

export default function SuperAdminHeader({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutSuperAdmin());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sa-header">
      <div className="sa-brand">
        <button className="sa-mobile-menu" onClick={onMenuClick} aria-label="Toggle navigation"><Menu size={22} /></button>
        <img src={logo} alt="Walkout SSMS" />
      </div>
      <div className="sa-header-actions">
        <label className="sa-search"><input placeholder="Search" aria-label="Search" /><Search size={24} /></label>
        <Mail aria-label="Messages" />
        <button className="sa-notification" aria-label="Notifications"><Bell /><span>3</span></button>
        <UserCircle2 size={32} aria-label="User account" />
        <button type="button" onClick={logout} aria-label="Log out" title="Log out"><LogOut size={22} /></button>
      </div>
    </header>
  );
}
