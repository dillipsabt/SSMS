import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Menu, UserCircle, Search, Mail } from "lucide-react";
// import logo from "../assets/logo-color 1.png";
import logo from "../assets/logo_greenfield_school.png";
import {
  fetchStudentNotifications,
  fetchTeacherNotifications,
} from "../features/Notifications/notificationsSlice";
import { logout } from "../features/auth/authSlice";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  // const tenantName = localStorage.getItem("tenantName");
  const tenantLogo = localStorage.getItem("tenantLogo");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const { unreadCount } = useSelector((state) => state.userNotifications);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (role === "student-portal") {
      dispatch(fetchStudentNotifications());
    } else if (role === "teacher-portal") {
      dispatch(fetchTeacherNotifications());
    }
  }, [dispatch, role]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (role === "student-portal") {
        dispatch(fetchStudentNotifications());
      } else if (role === "teacher-portal") {
        dispatch(fetchTeacherNotifications());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, role]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNotificationClick = () => {
    setNotificationOpen(false);
    if (role === "student-portal") {
      navigate("/student-notifications");
    } else if (role === "teacher-portal") {
      navigate("/teacher-notifications");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow z-50 flex items-center justify-between px-4">
      {/* LEFT */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 bg-gray-100 rounded-md"
        >
          <Menu size={20} />
        </button>

        <img
          src={tenantLogo || logo}
          alt="logo"
          className="w-32 sm:w-40 object-contain"
        />
        <span className="hidden sm:block text-lg font-semibold">{"Green Field Convent School"}</span>
      </div>

      {/* SEARCH (hidden on mobile) */}
      <div className="hidden md:block w-[400px] lg:w-[500px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-5">
        <Mail className="text-gray-600 cursor-pointer" />

        {/* Notification - Visible for Student, Teacher, Parent (NOT Admin) */}
        {role !== "admin" && (
          <div className="relative" ref={notificationRef}>
            <Bell
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={handleNotificationClick}
            />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        )}

        {/* User */}
        <div className="relative" ref={dropdownRef}>
          <UserCircle
            size={26}
            className="cursor-pointer text-gray-600"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  navigate("/settings");
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
