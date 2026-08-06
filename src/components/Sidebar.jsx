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
  MapPinned,
  Contact
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
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
      },
      {
        icon: <Users size={20} />,
        label: "Students",
        children: [
          { to: "/add-student", label: "Add Student Admission" },
          { to: "/students_list", label: "Student List" },
          { to: "/student-id-cards", label: "Student ID Card" },
        ],
      },
      {
        icon: <UserCog size={20} />,
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
        icon: <UserCog size={20} />,
        label: "Staff",
        children: [
          { to: "/add-staff", label: "Add New Staff" },
          { to: "/staff_list", label: "Staff List" },
        ],
      },
      {
        to: "/leave-list",
        icon: <CalendarX size={20} />,
        label: "Leave Management",
      },
      {
        icon: <ClipboardList size={20} />,
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
        icon: <ClipboardList size={20} />,
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
        icon: <BarChart3 size={20} />,
      },
      // {
      //   icon: <Bus size={20} />,
      //   label: "Student Transportation",
      //   children: [
      //     { to: "/student-transportation", label: "Student Transportation" },
      //     {
      //       to: "/student-transportation-list",
      //       label: "Student Transportation List",
      //     },
      //   ],
      // },
      // {
      //   icon: <Clock size={18} />,
      //   label: "Teacher/Staff Attendance",
      //   children: [
      //     { to: "/admin-attendance", label: "Attendance List" },
      //     { to: "/biometric-attendance", label: "Biometric Device" },
      //   ],
      // },
      {
        icon: <Wallet size={20} />,
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
        icon: <ClipboardList size={20} />,
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
        icon: <BookOpen size={20} />,
        label: "Exam & Results",
        children: [
          { to: "/add-exam", label: "Add Exam Schedule" },
          { to: "/exam-schedule-list", label: "Exam Schedule List" },
          // { to: "/results-list", label: "Teacher Wise Results List" },
          { to: "/student-wise-results-list", label: "Student Wise Results List" },
          {
            to: "/Student-wise-Overall-Results",
            label: "Student wise Overall Results",
          },
        ],
      },
      {
        icon: <Bell size={20} />,
        label: "Notifications & Alerts",
        children: [
          { to: "/add-notifications", label: "Add Notifications" },
          { to: "/notifications-list", label: "Notification Lists" },
        ],
      },
      {
        icon: <Megaphone size={20} />,
        label: "Announcements",
        children: [
          { to: "/add-announcements", label: "Add Announcements" },
          { to: "/announcements-list", label: "Announcement Lists" },
        ],
      },
      {
        to: "/bulk-upload",
        icon: <Upload size={20} />,
        label: "Bulk Upload",
      },
      {
        icon: <MessageSquare size={20} />,
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
        icon: <BarChart3 size={20} />,
        label: "Analytics Dashboard",
        children: [
          {
            to: "/Fees-Management-Dashboard",
            label: "Fees Management Dashboard",
          },
        ],
      },
      {
        icon: <ChartNoAxesCombined size={20} />,
        label: "Predictive Analysis",
        children: [
          { to: "/predictive-analysis-dashboard", label: "Dashboard" },
          { to: "/answer-sheets", label: "Answer Sheets" },
          { to: "/student-analytics", label: "Student Analytics" },
        ],
      },

      {
        icon: <GraduationCap size={20} />,
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
        icon: <BookOpen size={20} />,
        label: "Textbooks",
      },
      {
        icon: <Ticket size={20} />,
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
        icon: <BookOpen size={20} />,
      },
      {
        label: "Subjects",
        to: "/subjects",
        icon: <BookOpen size={20} />,
      },
      {
        label: "Departments",
        to: "/departments",
        icon: <Users size={20} />,
      },
      {
        label: "Branches",
        to: "/branches",
        icon: <MapPinned size={20} />,
      },
      {
        label: "Academic Year",
        to: "/academic-year",
        icon: <CalendarX size={20} />,
      },
      {
        label: "Examination Type",
        to: "/examination-type",
        icon: <ClipboardList size={20} />,
      },
      {
        label: "Financial Overview",
        to: "/financial-overview",
        icon: <ChartColumn size={20} />,
      },
      {
        icon: <FileText size={20} />,
        label: "Payslips",
        children: [
          { to: "/add-payslips", label: "Add Payslips" },
          { to: "/payslip-list", label: "Payslip List" },
        ],
      },
      // {
      //   icon: <UserCog size={20} />,
      //   label: "School Details",
      //   children: [
      //     { to: "/add-school-details", label: "Add School Details" },
      //     { to: "/school-details-view", label: "School Details View" },
      //   ],
      // },
      {
        label: "School Details",
        to: "/school-details-view",
        icon: <UserCog size={20} />,
      },
      // {
      //   icon: <FileText size={20} />,
      //   label: "Transportation",
      //   children: [
      //     { to: "/transportation", label: "Transportation" },
      //     { to: "/new-routes", label: "New Routes" },
      //   ],
      // },
      {
        to: "/new-expenses",
        label: "New Expenses",
        icon: <Wallet size={20} />,
      },
      {
        to: "/upcoming-events",
        label: "Upcoming Events",
        icon: <CheckSquare size={20} />,
      },
      {
        to: "/notice-board",
        label: "Notice Board",
        icon: <FileText size={20} />,
      },
      {
        to: "/class-timing-schedule",
        label: "Class Timing Schedule",
        icon: <Clock size={20} />,
      },
    ];
  }

  // ✅ TEACHER PORTAL SIDEBAR
  else if (role === "teacher-portal") {
    navItems = [
      {
        to: "/teacher-dashboard",
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
      },
      {
        icon: <Users size={20} />,
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
        icon: <GraduationCap size={20} />,
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
        icon: <ClipboardList size={20} />,
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
        icon: <BookOpen size={20} />,
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
        icon: <FileText size={20} />,
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
        icon: <BookOpen size={20} />,
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
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
      },
      {
        icon: <Users size={20} />,
        label: "Student",
        children: [
          { to: "/student-attendance", label: "Attendance" },
        ],
      },
      {
        to: "/student-id-card",
        icon: <Contact size={20} />,
        label: "Student ID Card",
      },
      {
        icon: <ClipboardList size={20} />,
        label: "Homework & Assignments",
        children: [{ to: "/student-homework", label: "Assignments" }],
      },
      {
        to: "/student-hall-ticket",
        icon: <Ticket size={20} />,
        label: "Hall Ticket List",
      },
      {
        icon: <BookOpen size={20} />,
        label: "Exams",
        children: [
          { to: "/student-exam-timetable", label: "Exam Timetable" },
          { to: "/student-exam-reports", label: "Student Exam Reports" },
        ],
      },
      {
        icon: <NotebookPen size={20} />,
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
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
      },
      {
        icon: <Clock size={20} />,
        label: "Attendance",
        children: [
          { to: "/parent-attendance", label: "Attendance" },
          { to: "/parent-leave", label: "Leave" },
        ],
      },
      {
        to: "/parent-fees",
        icon: <Wallet size={20} />,
        label: "Fees",
      },
      {
        icon: <ClipboardList size={20} />,
        label: "Assignment / Homework",
        children: [{ to: "/parent-assignment-homework", label: "Assignments" }],
      },
      {
        icon: <BookOpen size={20} />,
        label: "Exam & Result",
        children: [
          { to: "/parent-exam-timetable", label: "Exam Timetable" },
          { to: "/parent-exam-reports", label: "Student Exam Reports" },
        ],
      },
      {
        to: "/parent-feedback",
        icon: <MessageSquare size={20} />,
        label: "Feedback",
      },
      {
        to: "/parent-student-profile",
        icon: <GraduationCap size={20} />,
        label: "Student Profile",
      },
      {
        to: "/parent-transportation",
        icon: <Bus size={20} />,
        label: "Transportation Details",
      },
    ];
  }

  // ✅ STAFF PORTAL SIDEBAR
  else if (role === "staff-portal") {
    const isAdministration = localStorage.getItem("isAdministration") === "true";

    navItems = [
      {
        to: "/staff-dashboard",
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
      },

    ];

    if (isAdministration) {
      navItems.push(
        { to: "/students_list", icon: <Users size={20} />, label: "Student Details" },
        { to: "/staff_list", icon: <UserCog size={20} />, label: "Staff Details" },
        { to: "/teacher_list", icon: <GraduationCap size={20} />, label: "Teacher Details" },
        {
          icon: <Bus size={20} />,
          label: "Student Transportation",
          children: [
            { to: "/student-transportation", label: "Student Transportation" },
            { to: "/student-transportation-list", label: "Student Transportation List" },
          ],
        },
        {
          icon: <Bus size={20} />,
          label: "Transportation",
          children: [
            { to: "/transportation", label: "Transportation" },
            { to: "/new-routes", label: "New Routes" },
          ],
        },
        {
          icon: <Wallet size={20} />,
          label: "Fees Management",
          children: [
            { to: "/fees-config", label: "Class Wise Fees Configure" },
            { to: "/student-wise-fees-config", label: "Student Wise Fees Configure" },
            { to: "/fees", label: "Fees" },
            { to: "/fees-list", label: "Fees List" },
            { to: "/admin-fees-status", label: "Fees Status" },
            { to: "/fees-refund", label: "Fees Refund" },
            { to: "/fee-refund-list", label: "Fee Refund List" },
            { to: "/principal-fee-refund-list", label: "Principal Fee Refund List" },
          ],
        },
        {
          icon: <BookOpen size={20} />,
          label: "Exam & Results",
          children: [
            { to: "/add-exam", label: "Add Exam Schedule" },
            { to: "/exam-schedule-list", label: "Exam Schedule List" },
            { to: "/results-list", label: "Results List" },
            { to: "/Student-wise-Overall-Results", label: "Student wise Overall Results" },
          ],
        },
        {
          icon: <Bell size={20} />,
          label: "Notifications & Alerts",
          children: [
            { to: "/add-notifications", label: "Add Notifications" },
            { to: "/notifications-list", label: "Notification Lists" },
          ],
        },
        {
          icon: <Megaphone size={20} />,
          label: "Announcements",
          children: [
            { to: "/add-announcements", label: "Add Announcements" },
            { to: "/announcements-list", label: "Announcement Lists" },
          ],
        },
        {
          icon: <Ticket size={20} />,
          label: "Hall Ticket",
          children: [
            { to: "/generate-hall-ticket", label: "Generate Hall Ticket" },
            { to: "/hall-ticket-list", label: "Hall Ticket List" },
          ],
        },
        {
          icon: <FileText size={20} />,
          label: "Payslips",
          children: [
            { to: "/add-payslips", label: "Add Payslips" },
            { to: "/payslip-list", label: "Payslip List" },
          ],
        },
      );
    }
  }

  return (
    <>
      {/* Overlay (Mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
    fixed left-0 top-16 z-40 h-[calc(100vh-64px)]
    w-[min(78vw,18rem)] max-w-[18rem] overflow-y-auto overscroll-contain bg-white shadow-xl
    transition-transform duration-300 ease-out
    ${isOpen ? "translate-x-0 sm:w-67" : "-translate-x-full sm:translate-x-0 sm:w-20"}
  `}
      >
        {isOpen && <div className="sticky top-0 z-10 border-b bg-white px-4 py-3 font-semibold">Menu</div>}

        <ul className={`${isOpen ? "p-3" : "p-2"} space-y-1.5`}>
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
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">{item.icon}</div>

                    {isOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left text-sm leading-5 truncate">
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
                              if (window.innerWidth < 640) {
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
                    if (window.innerWidth < 640) {
                      setIsOpen(false);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded transition justify-center sm:justify-start ${isActive
                      ? "bg-brand-100 text-brand-600 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                    }`
                  }
                  title={!isOpen ? item.label : ""}
                >
                  {item.icon && (
                    <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      {item.icon}
                    </span>
                  )}

                  {isOpen && (
                    <span className="ml-3 flex-1 text-left text-sm leading-5 truncate">
                      {item.label}
                    </span>
                  )}
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
