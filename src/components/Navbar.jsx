import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Menu, UserCircle, Search, Mail } from "lucide-react";
import logo from "../assets/logo-color 1.png";
import {
  fetchStudentNotifications,
  fetchTeacherNotifications,
} from "../features/Notifications/notificationsSlice";
import { logout } from "../features/auth/authSlice";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const portalLabel = {
    admin: "Admin Portal",
    "teacher-portal": "Teacher Portal",
    "student-portal": "Student Portal",
    "parent-portal": "Parent Portal",
    "staff-portal": "Staff Portal",
  }[role] || "Portal";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const { unreadCount } = useSelector((state) => state.userNotifications);
  const { schoolName, logoUrl } = useSelector((state) => state.schoolBranding);

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
    <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200/80 bg-gradient-to-r from-white via-white to-brand-50/30 px-3 shadow-sm backdrop-blur-md sm:px-5">
      {/* LEFT */}
      <div className="flex min-w-0 shrink items-center gap-2 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-gray-600 transition hover:border-brand-100 hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        >
          <Menu size={20} />
        </button>

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-24 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white px-2 shadow-sm ring-1 ring-white sm:h-[3.25rem] sm:w-36">
            <img
              src={logoUrl || logo}
              alt={schoolName || "Walkout SSMS"}
              className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-[1.03]"
            />
          </div>
          <span className="hidden h-9 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent lg:block" />
          <div className="hidden min-w-0 border-l-2 border-brand-600/70 pl-3 lg:block">
            <p className="truncate text-sm font-bold tracking-tight text-gray-900 lg:text-base">
              {schoolName || "Walkout SSMS"}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              {portalLabel}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH (hidden on mobile) */}
      <div className="hidden w-[min(36vw,500px)] md:block lg:w-[500px]">
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
      <div className="flex shrink-0 items-center gap-2 sm:gap-5">
        <Mail size={20} className="shrink-0 cursor-pointer text-gray-600 sm:size-6" />

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
