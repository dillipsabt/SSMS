import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  UserCog,
  BookOpen,
  CalendarX,
  ClipboardList,
  Wallet,
  Bell,
  Megaphone,
  MessageSquare,
  BarChart3,
  ChartNoAxesCombined,
  ChartColumn,
  GraduationCap,
  Clock,
  CheckSquare,
  FileText,
  Bus,
  NotebookPen,
  Upload,
  Ticket,
  School,
  MapPinned
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openDropdown, setOpenDropdown] = useState("");
  const role = localStorage.getItem("role");

  let navItems = [];

  // ✅ ADMIN SIDEBAR
  if (role === "admin") {
    navItems = [
      {
        to: "/dashboard",
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
      },
      {
        icon: <Users size={18} />,
        label: "Students",
        children: [
          { to: "/add-student", label: "Add Student Admission" },
          { to: "/students_list", label: "Student List" },
        ],
      },
      {
        icon: <UserCog size={18} />,
        label: "Teacher",
        children: [
          { to: "/add-teacher", label: "Add New Teacher" },
          { to: "/teacher_list", label: "Teachers List" },
          { to: "/teacher-timetable", label: "Teachers Timetable" },
          { to: "/raise-request-list", label: "Raise Request List" },
          { to: "/reimbursement", label: "Reimbursement" },
          { to: "/Admin-Tickets", label: "Tickets" },
        ],
      },
      {
        icon: <UserCog size={18} />,
        label: "Staff",
        children: [
          { to: "/add-staff", label: "Add New Staff" },
          { to: "/staff_list", label: "Staff List" },
        ],
      },
      {
        to: "/leave-list",
        icon: <CalendarX size={18} />,
        label: "Leave Management",
      },
      {
        icon: <ClipboardList size={18} />,
        label: "Transfer Certificate",
        children: [
          {
            to: "/issue-transfer-certificate",
            label: "Issue Transfer Certificate",
          },
          {
            to: "/transfer-certificate-list",
            label: "Transfer Certificate List",
          },
        ],
      },
      {
        icon: <ClipboardList size={18} />,
        label: "Bonafide Certificate",
        children: [
          {
            to: "/issue-bonafide-certificate",
            label: "Issue Bonafide Certificate",
          },
          {
            to: "/bonafide-certificate-list",
            label: "Bonafide Certificate List",
          },
        ],
      },
      {
        to: "/student-performance",
        label: "Student Performance",
        icon: <BarChart3 size={16} />,
      },
      {
        icon: <Bus size={18} />,
        label: "Student Transportation",
        children: [
          { to: "/student-transportation", label: "Student Transportation" },
          {
            to: "/student-transportation-list",
            label: "Student Transportation List",
          },
        ],
      },
      // {
      //   icon: <Clock size={18} />,
      //   label: "Teacher/Staff Attendance",
      //   children: [
      //     { to: "/admin-attendance", label: "Attendance List" },
      //     { to: "/biometric-attendance", label: "Biometric Device" },
      //   ],
      // },
      {
        icon: <Wallet size={18} />,
        label: "Fees Management",
        children: [
          { to: "/fees-config", label: "Class Wise Fees Configure" },
          {
            to: "/student-wise-fees-config",
            label: "Student Wise Fees Configure",
          },
          { to: "/fees", label: "Fees" },
          { to: "/fees-list", label: "Fees List" },
          { to: "/admin-fees-status", label: "Fees Status" },
          { to: "/fees-refund", label: "Fees Refund" },
          { to: "/fee-refund-list", label: "Fee Refund List" },
          { to: "/principal-fee-refund-list", label: "Principal Fee Refund List" },
        ],
      },
      {
        icon: <ClipboardList size={18} />,
        label: "Assignment / Homework",
        children: [
          { to: "/Assignment-List", label: "Teacher Assignment List" },
          {
            to: "/student-assignment-submission",
            label: "Student Assignment Submission",
          },
        ],
      },
      {
        icon: <BookOpen size={18} />,
        label: "Exam & Results",
        children: [
          { to: "/add-exam", label: "Add Exam Schedule" },
          { to: "/exam-schedule-list", label: "Exam Schedule List" },
          { to: "/results-list", label: "Results List" },
          {
            to: "/Student-wise-Overall-Results",
            label: "Student wise Overall Results",
          },
        ],
      },
      {
        icon: <Bell size={18} />,
        label: "Notifications & Alerts",
        children: [
          { to: "/add-notifications", label: "Add Notifications" },
          { to: "/notifications-list", label: "Notification Lists" },
        ],
      },
      {
        icon: <Megaphone size={18} />,
        label: "Announcements",
        children: [
          { to: "/add-announcements", label: "Add Announcements" },
          { to: "/announcements-list", label: "Announcement Lists" },
        ],
      },
      {
        to: "/bulk-upload",
        icon: <Upload size={18} />,
        label: "Bulk Upload",
      },
      {
        icon: <MessageSquare size={18} />,
        label: "Feedback",
        children: [
          { to: "/Add-Feedback", label: "Add Feedback" },
          { to: "/Feedback-Lists", label: "Feedback Lists" },
          {
            to: "/Student-Feedback-Submission",
            label: "Student Feedback Submission",
          },
        ],
      },
      {
        icon: <BarChart3 size={18} />,
        label: "Analytics Dashboard",
        children: [
          {
            to: "/Fees-Management-Dashboard",
            label: "Fees Management Dashboard",
          },
        ],
      },
      {
        icon: <ChartNoAxesCombined size={18} />,
        label: "Predictive Analysis",
        children: [
          { to: "/predictive-analysis-dashboard", label: "Dashboard" },
          { to: "/answer-sheets", label: "Answer Sheets" },
          { to: "/student-analytics", label: "Student Analytics" },
        ],
      },

      {
        icon: <GraduationCap  size={18} />,
        label: "LMS",
        children: [
          { to: "/add-vertual-class", label: "Add Virtual Class" },
          { to: "/virtualclasslist", label: "Virtual Class List" },
          {
            to: "/public-virtual-classes",
            label: "Publish Virtual Class List",
          },
          {
            to: "/virtual-class-joined-list",
            label: "Virtual Class Joined List",
          },
        ],
      },

      {
        to: "/textbooks",
        icon: <BookOpen size={18} />,
        label: "Textbooks",
      },
      {
        icon: <Ticket size={18} />,
        label: "Hall Ticket",
        children: [
          {
            to: "/generate-hall-ticket",
            label: "Generate Hall Ticket",
          },
          {
            to: "/hall-ticket-list",
            label: "Hall Ticket List",
          },
        ],
      },

      {
        label: "Masters",
        isSectionHeader: true,
      },
      {
        label: "Classes",
        to: "/classes",
        icon: <BookOpen size={18} />,
      },
      {
        label: "Departments",
        to: "/departments",
        icon: <Users size={18} />,
      },
      {
        label: "Branches",
        to: "/branches",
        icon: <MapPinned size={18} />,
      },
      {
        label: "Academic Year",
        to: "/academic-year",
        icon: <CalendarX size={18} />,
      },
      {
        label: "Examination Type",
        to: "/examination-type",
        icon: <ClipboardList size={18} />,
      },
      {
        label: "Financial Overview",
        to: "/financial-overview",
        icon: <ChartColumn size={16} />,
      },
      {
        icon: <FileText size={16} />,
        label: "Payslips",
        children: [
          { to: "/add-payslips", label: "Add Payslips" },
          { to: "/payslip-list", label: "Payslip List" },
        ],
      },
      {
        icon: <UserCog size={18} />,
        label: "School Details",
        children: [
          { to: "/add-school-details", label: "Add School Details" },
          { to: "/school-details-view", label: "School Details View" },
        ],
      },
      {
        icon: <FileText size={16} />,
        label: "Transportation",
        children: [
          { to: "/transportation", label: "Transportation" },
          { to: "/new-routes", label: "New Routes" },
        ],
      },
      {
        to: "/new-expenses",
        label: "New Expenses",
        icon: <Wallet size={16} />,
      },
      {
        to: "/upcoming-events",
        label: "Upcoming Events",
        icon: <CheckSquare size={16} />,
      },
      {
        to: "/notice-board",
        label: "Notice Board",
        icon: <FileText size={16} />,
      },
      {
        to: "/class-timing-schedule",
        label: "Class Timing Schedule",
        icon: <Clock size={16} />,  
      },
    ];
  }

  // ✅ TEACHER PORTAL SIDEBAR
  else if (role === "teacher-portal") {
    navItems = [
      {
        to: "/teacher-dashboard",
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
      },
      {
        icon: <Users size={18} />,
        label: "Student",
        children: [
          {
            to: "/teacher-student-attendance",
            label: "Attendance",
          },
          {
            to: "/teacher-student-attendance-list",
            label: "Attendance List",
          },
        ],
      },
      {
        icon: <GraduationCap size={18} />,
        label: "Teacher",
        children: [
          {
            to: "/teacher-time-table",
            label: "Teacher Timetable",
          },
          {
            to: "/teacher-raise-request-list",
            label: "Raise Request List",
          },
          {
            to: "/teacher-personal-details",
            label: "Teacher Details",
          },
          {
            to: "/teacher-attendance",
            label: "Attendance",
          },
          {
            to: "/teacher-raise-ticket",
            label: "Raise a Ticket",
          },
          {
            to: "/teacher-payslip",
            label: "Payslip",
          },
          {
            to: "/teacher-leave",
            label: "Leave",
          },
          {
            to: "/teacher-reimbursement",
            label: "Reimbursement",
          },
        ],
      },
      {
        icon: <ClipboardList size={18} />,
        label: "Assignment / Homework",
        children: [
          {
            to: "/teacher-assignment-homework",
            label: "Assignment",
          },
          {
            to: "/teacher-assignment-submission",
            label: "Submission",
          },
        ],
      },
      {
        icon: <BookOpen size={18} />,
        label: "Exam & Result",
        children: [
          {
            to: "/teacher-results-list",
            label: "Results List",
          },
          {
            to: "/teacher-add-exam-results",
            label: "Add Exam Results",
          },
        ],
      },
      {
        icon: <FileText size={18} />,
        label: "Student Performance",
        children: [
          {
            to: "/daily-student-performance",
            label: "Daily Student Performance",
          },
          {
            to: "/student-performance-list",
            label: "Student Performance List",
          },
        ],
      },

      {
        icon: <BookOpen size={18} />,
        label: "LMS",
        children: [
          { to: "/teacher-add-vertual-class", label: "Add Virtual Class" },
          { to: "/teachervirtualclasslist", label: "Virtual Class List" },
          {
            to: "/teacher-public-virtual-classes",
            label: "Publish Virtual Class List",
          },
          {
            to: "/teacher-virtual-class-joined-list",
            label: "Virtual Class Joined List",
          },
        ],
      },
    ];
  }

  // ✅ STUDENT PORTAL SIDEBAR
  else if (role === "student-portal") {
    navItems = [
      {
        to: "/student-dashboard",
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
      },
      {
        icon: <Users size={18} />,
        label: "Student",
        children: [
          { to: "/student-details", label: "Student Details" },
          { to: "/student-attendance", label: "Attendance" },
        ],
      },
      {
        icon: <ClipboardList size={18} />,
        label: "Homework & Assignments",
        children: [{ to: "/student-homework", label: "Assignments" }],
      },
      {
        to: "/student-hall-ticket",
        icon: <Ticket size={18} />,
        label: "Hall Ticket List",
      },
      {
        icon: <BookOpen size={18} />,
        label: "Exams",
        children: [
          { to: "/student-exam-timetable", label: "Exam Timetable" },
          { to: "/student-exam-reports", label: "Student Exam Reports" },
        ],
      },
      {
        icon: <NotebookPen size={18} />,
        label: "LMS",
        children: [
          {
            to: "/meeting-schedule",
            label: "Meeting Schedule",
          },
          {
            to: "/video-library",
            label: "Video Library",
          },
        ],
      },
    ];
  }

  // ✅ PARENT PORTAL SIDEBAR
  else if (role === "parent-portal") {
    navItems = [
      {
        to: "/parent-dashboard",
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
      },
      {
        icon: <Clock size={18} />,
        label: "Attendance",
        children: [
          { to: "/parent-attendance", label: "Attendance" },
          { to: "/parent-leave", label: "Leave" },
        ],
      },
      {
        to: "/parent-fees",
        icon: <Wallet size={18} />,
        label: "Fees",
      },
      {
        icon: <ClipboardList size={18} />,
        label: "Assignment / Homework",
        children: [{ to: "/parent-assignment-homework", label: "Assignments" }],
      },
      {
        icon: <BookOpen size={18} />,
        label: "Exam & Result",
        children: [
          { to: "/parent-exam-timetable", label: "Exam Timetable" },
          { to: "/parent-exam-reports", label: "Student Exam Reports" },
        ],
      },
      {
        to: "/parent-feedback",
        icon: <MessageSquare size={18} />,
        label: "Feedback",
      },
      {
        to: "/parent-student-profile",
        icon: <GraduationCap size={18} />,
        label: "Student Profile",
      },
      {
        to: "/parent-transportation",
        icon: <Bus size={18} />,
        label: "Transportation Details",
      },
    ];
  }

  // ✅ STAFF PORTAL SIDEBAR
  else if (role === "staff-portal") {
    navItems = [
      {
        to: "/staff-dashboard",
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
      },
    ];
  }

  return (
    <>
      {/* Overlay (Mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
    fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-md z-40
    overflow-y-auto transition-all duration-300

    ${isOpen ? "w-67" : "w-20"}

    translate-x-0 lg:translate-x-0
  `}
      >
        {isOpen && <div className="p-4 border-b font-semibold">Menu</div>}

        <ul className={`${isOpen ? "p-3" : "p-2"} space-y-2`}>
          {navItems.map((item) => {
            if (item.isSectionHeader) {
              return isOpen ? (
                <li key={item.label} className="pt-2">
                  <div className="px-2 py-1 text-sm font-extrabold text-gray-800 uppercase tracking-wide">
                    {item.label}
                  </div>
                </li>
              ) : null;
            }

            if (item.children) {
              return (
                <li key={item.label}>
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.label ? "" : item.label,
                      )
                    }
                    className="flex items-center w-full p-2 rounded hover:bg-gray-100"
                    title={item.label}
                  >
                    <div className="min-w-[20px] flex justify-center">{item.icon}</div>

                    {isOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left whitespace-nowrap text-[14px] overflow-hidden text-ellipsis">
                          {item.label}
                        </span>

                        <ChevronDown
                          size={16}
                          className={`transition ${openDropdown === item.label ? "rotate-180" : ""
                            }`}
                        />
                      </>
                    )}
                  </button>

                  {isOpen && openDropdown === item.label && (
                    <ul className="mt-2 space-y-1 ml-6">
                      {item.children.map((sub) => (
                        <li key={sub.to}>
                          <NavLink
                            to={sub.to}
                            onClick={() => {
                              // Only close sidebar on mobile (lg:hidden)
                              if (window.innerWidth < 1024) {
                                setIsOpen(false);
                              }
                            }}
                            className={({ isActive }) =>
                              `flex items-center p-2 text-sm rounded transition ${isActive
                                ? "bg-brand-100 text-brand-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                              }`
                            }
                          >
                            {sub.icon && (
                              <span className="mr-3 flex-shrink-0">
                                {sub.icon}
                              </span>
                            )}
                            <span>{sub.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  onClick={() => {
                    // Only close sidebar on mobile (lg:hidden)
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded transition justify-center lg:justify-start ${isActive
                      ? "bg-brand-100 text-brand-600 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                    }`
                  }
                  title={!isOpen ? item.label : ""}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
