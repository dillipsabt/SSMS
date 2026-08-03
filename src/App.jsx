import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "./routes/ProtectedRoute";
import { checkTokenExpiry } from "./utils/fileUtils";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";
import TeacherLayout from "./layout/TeacherLayout";
import StudentLayout from "./layout/StudentLayout";
import ParentLayout from "./layout/ParentLayout";
import StaffLayout from "./layout/StaffLayout";
import SuperAdminRoutes from "./SuperAdmin/Routes/SuperAdminRoutes";
import { isSuperAdminTenant } from "./api/tenant";
import { useDispatch } from "react-redux";
import { fetchSchoolInfo } from "./features/Admin/SchoolBranding/schoolBrandingSlice";

// ADMIN
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const StudentAdmission = lazy(() => import("./pages/Admin/StudentAdmission"));
const StudentList = lazy(() => import("./pages/Admin/StudentList"));
const StudentView = lazy(() => import("./pages/Admin/StudentView"));
const AddTeacher = lazy(() => import("./pages/Admin/AddTeacher"));
const TeachersList = lazy(() => import("./pages/Admin/TeachersList"));
const TeacherDetails = lazy(() => import("./pages/Admin/TeacherDetails"));
const TeachersTimetable = lazy(() => import("./pages/Admin/TeachersTimetable"));
const AddStaff = lazy(() => import("./pages/Admin/AddStaff"));
const StaffList = lazy(() => import("./pages/Admin/StaffList"));
const StaffDetails = lazy(() => import("./pages/Admin/StaffDetails"));
const RaiseRequestList = lazy(() => import("./pages/Admin/RaiseRequestList"));
const Leave = lazy(() => import("./pages/Admin/AdminLeaveList"));
const FeesConfigure = lazy(() => import("./pages/Admin/FeesConfig"));
const Fees = lazy(() => import("./pages/Admin/Fees"));
const FeesList = lazy(() => import("./pages/Admin/FeesList"));
const AdminAddSchedule = lazy(() => import("./pages/Admin/AdminAddSchedule"));
const Reimbursement = lazy(() => import("./pages/Admin/AdminReimbursement"));
const AdminTickets = lazy(() => import("./pages/Admin/AdminTickets"));
const ResultsList = lazy(() => import("./pages/Admin/ResultsList"));
const StudentWiseResultsList = lazy(() => import("./pages/Admin/StudentWiseResultsList"));
const AddExamSchedule = lazy(() => import("./pages/Admin/AddExamSchedule"));
const ExamScheduleList = lazy(() => import("./pages/Admin/ExamScheduleList"));
const StudentOverallResults = lazy(
  () => import("./pages/Admin/StudentOverallResults"),
);
const AssignmentHomework = lazy(
  () => import("./pages/Admin/AssignmentHomework"),
);
const StudentAssignmentSubmission = lazy(
  () => import("./pages/Admin/StudentAssignmentSubmission"),
);
const AddFeedback = lazy(() => import("./pages/Admin/AddFeedback"));
const FeedbackLists = lazy(() => import("./pages/Admin/FeedbackLists"));
const StudentFeedbackSubmission = lazy(
  () => import("./pages/Admin/StudentFeedbackSubmission"),
);
const FeesManagementDashboard = lazy(
  () => import("./pages/Admin/FeesManagementDashboard"),
);
const AnnouncementsList = lazy(() => import("./pages/Admin/AnnouncementsList"));
const AddAnnouncements = lazy(() => import("./pages/Admin/AddAnnouncements"));
const NotificationsList = lazy(() => import("./pages/Admin/NotificationsList"));
const AddNotifications = lazy(() => import("./pages/Admin/AddNotifications"));
const StudentWiseFeesConfig = lazy(
  () => import("./pages/Admin/StudentWiseFeesConfig"),
);
const PredictiveAnalysisDashboard = lazy(
  () => import("./pages/Admin/PredictiveAnalysisDashboard"),
);
const AnswerSheets = lazy(() => import("./pages/Admin/AnswerSheets"));
const BonafideCertificateList = lazy(
  () => import("./pages/Admin/BonafideCertificateList"),
);
const IssueBonafideCertificate = lazy(
  () => import("./pages/Admin/IssueBonafideCertificate"),
);
const TransferCertificateList = lazy(
  () => import("./pages/Admin/TransferCertificateList"),
);
const IssueTransferCertificate = lazy(
  () => import("./pages/Admin/IssueTransferCertificate"),
);
const AdminAttendanceList = lazy(
  () => import("./pages/Admin/AdminAttendanceList"),
);
const BiometricAttendance = lazy(
  () => import("./pages/Admin/BiometricAttendance"),
);
const AdminNoticeBoard = lazy(() => import("./pages/Admin/NoticeBoard"));
const AdminUpcomingEvents = lazy(() => import("./pages/Admin/UpcomingEvents"));
const StudentPerformance = lazy(
  () => import("./pages/Admin/StudentPerformance"),
);
const StudentTransportation = lazy(
  () => import("./pages/Admin/StudentTransportation"),
);
const StudentTransportationList = lazy(
  () => import("./pages/Admin/StudentTransportationList"),
);
const Transportation = lazy(() => import("./pages/Admin/Transportation"));
const NewRoutes = lazy(() => import("./pages/Admin/NewRoutes"));
const AddSchoolDetails = lazy(() => import("./pages/Admin/AddSchoolDetails"));
const SchoolDetailsView = lazy(() => import("./pages/Admin/SchoolDetailsView"));
const NewExpenses = lazy(() => import("./pages/Admin/NewExpenses"));
const FinancialOverview = lazy(() => import("./pages/Admin/FinancialOverview"));
const AddPayslips = lazy(() => import("./pages/Admin/AddPayslips"));
const PayslipList = lazy(() => import("./pages/Admin/PayslipList"));
const PayslipDownload = lazy(() => import("./pages/Admin/PayslipDownload"));
const StudentAnalytics = lazy(() => import("./pages/Admin/StudentAnalytics"));
const AdminFeesStatus = lazy(() => import("./pages/Admin/AdminFeesStatus"));
const FeesRefund = lazy(() => import("./pages/Admin/FeesRefund"));
const FeeRefundList = lazy(() => import("./pages/Admin/FeeRefundList"));
const PrincipalFeeRefundList = lazy(() => import("./pages/Admin/PrincipalFeeRefundList"));
const BulkUpload = lazy(() => import("./pages/Admin/BulkUpload"));
const Class = lazy(() => import("./pages/Admin/Class"));
const Subject = lazy(() => import("./pages/Admin/Subject"));
const Department = lazy(() => import("./pages/Admin/Department"));
const Branches = lazy(() => import("./pages/Admin/Branches"));
const AcademicYear = lazy(() => import("./pages/Admin/AcademicYear"));
const ExaminationType = lazy(() => import("./pages/Admin/ExaminationType"));
const GenerateHallTicket = lazy(
  () => import("./pages/Admin/GenerateHallTicket"),
);
const HallTicketList = lazy(() => import("./pages/Admin/HallTicketList"));
const HallTicket = lazy(() => import("./pages/Admin/HallTicket"));
const ClassTimingSchedule = lazy(() => import("./pages/Admin/ClassTimingSchedule"));
const Textbooks = lazy(() => import("./pages/Admin/Textbooks"));

// COMMON
const CommonNoticeBoard = lazy(() => import("./pages/common/NoticeBoard"));
const CommonUpcomingEvents = lazy(
  () => import("./pages/common/UpcomingEvents"),
);
const VirtualClassList = lazy(() => import("./pages/Admin/VirtualClassList"));
const RecordedClasses = lazy(() => import("./pages/Admin/RecordedClasses"));
const AddVirtualClass = lazy(() => import("./pages/Admin/AddVirtualClass"));
const PublicVirtualClasses = lazy(
  () => import("./pages/Admin/PublicVirtualClasses"),
);

const VirtualClassJoinedList = lazy(
  () => import("./pages/Admin/VirtualClassJoinedList"),
);

// TEACHER
const TeacherDashboard = lazy(() => import("./pages/Teacher/TeacherDashboard"));
const TeacherPersonalDetails = lazy(
  () => import("./pages/Teacher/TeacherPersonalDetails"),
);
const TeacherAttendance = lazy(
  () => import("./pages/Teacher/TeacherAttendance"),
);
const TeacherPayslip = lazy(() => import("./pages/Teacher/TeacherPayslip"));
const TeacherLeave = lazy(() => import("./pages/Teacher/TeacherLeave"));
const TeacherTimetable = lazy(() => import("./pages/Teacher/TeacherTimetable"));
const TeacherRaiseRequestList = lazy(
  () => import("./pages/Teacher/TeacherRaiseRequestList"),
);
const TeacherRaiseTicket = lazy(
  () => import("./pages/Teacher/TeacherRaiseTicket"),
);
const TeacherReimbursement = lazy(
  () => import("./pages/Teacher/TeacherReimbursement"),
);
const TeacherStudentAttendance = lazy(
  () => import("./pages/Teacher/TeacherStudentAttendance"),
);
const TeacherAssignmentHomework = lazy(
  () => import("./pages/Teacher/TeacherAssignmentHomework"),
);
const TeacherAssignmentSubmission = lazy(
  () => import("./pages/Teacher/TeacherAssignmentSubmission"),
);
const TeacherStudentAttendanceList = lazy(
  () => import("./pages/Teacher/TeacherStudentAttendanceList"),
);
const TeacherResultsList = lazy(
  () => import("./pages/Teacher/TeacherResultsList"),
);
const TeacherAddExamResults = lazy(
  () => import("./pages/Teacher/TeacherAddExamResults"),
);
const TeacherDailyStudentPerformance = lazy(
  () => import("./pages/Teacher/TeacherDailyStudentPerformance"),
);
const TeacherDailyStudentPerformanceList = lazy(
  () => import("./pages/Teacher/TeacherDailyStudentPerformanceList"),
);

const TeacherVirtualClassList = lazy(
  () => import("./pages/Teacher/TeacherVirtualClassList"),
);
const TeacherRecordedClasses = lazy(
  () => import("./pages/Teacher/TeacherRecordedClasses"),
);
const TeacherAddVirtualClass = lazy(
  () => import("./pages/Teacher/TeacherAddVirtualClass"),
);
const TeacherPublicVirtualClasses = lazy(
  () => import("./pages/Teacher/TeacherPublicVirtualClasses"),
);

const TeacherVirtualClassJoinedList = lazy(
  () => import("./pages/Teacher/TeacherVirtualClassJoinedList"),
);

// STUDENT
const StudentDetails = lazy(() => import("./pages/Student/StudentDetails"));
const Attendance = lazy(() => import("./pages/Student/Attendance"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const StudentHomework = lazy(() => import("./pages/Student/StudentHomework"));
const StudentExamTimetable = lazy(
  () => import("./pages/Student/StudentExamTimetable"),
);
const StudentExamReports = lazy(
  () => import("./pages/Student/StudentExamReports"),
);
const StudentHallTicket = lazy(
  () => import("./pages/Student/StudentHallTicket"),
);

const VideoLibrary = lazy(() => import("./pages/Student/VideoLibrary"));
const MeetingSchedule = lazy(() => import("./pages/Student/MeetingSchedule"));

// PARENT
const ParentsDashboard = lazy(() => import("./pages/Parent/ParentsDashboard"));
const ParentsFeedback = lazy(() => import("./pages/Parent/ParentsFeedback"));
const ParentsStudentProfile = lazy(
  () => import("./pages/Parent/ParentsStudentProfile"),
);
const ParentsExamReports = lazy(
  () => import("./pages/Parent/ParentsExamReports"),
);
const ParentsExamTimetable = lazy(
  () => import("./pages/Parent/ParentsExamTimetable"),
);
const ParentsAssignmentHomework = lazy(
  () => import("./pages/Parent/ParentsAssignmentHomework"),
);
const ParentsFees = lazy(() => import("./pages/Parent/ParentsFees"));
const ParentsAttendance = lazy(
  () => import("./pages/Parent/ParentsAttendance"),
);
const ParentsLeave = lazy(() => import("./pages/Parent/ParentsLeave"));
const ParentTransportation = lazy(
  () => import("./pages/Parent/ParentTransportation"),
);
const StudentExamReportCard = lazy(
  () => import("./pages/Parent/StudentExamReportCard"),
);

// STAFF
const StaffDashboard = lazy(() => import("./pages/Staff/StaffDashboard"));


// General Pages
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Notifications = lazy(() => import("./pages/common/Notifications"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSuperAdminTenant()) {
      dispatch(fetchSchoolInfo());
    }
  }, [dispatch]);

  // ✅ Auto token expiry check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || window.location.pathname === "/") return;

    checkTokenExpiry();

    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors />

      <BrowserRouter>
       {
          isSuperAdminTenant()
            ? (
                <SuperAdminRoutes />
              )
            : (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-screen">
                    Loading...
                  </div>
                }
              >
          <Routes>
            <Route path="/" element={<Login />} />

            {/* ADMIN */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reimbursement"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Reimbursement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students_list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-student"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <MainLayout>
                    <StudentAdmission />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-student/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <MainLayout>
                    <StudentAdmission />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-view"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentView />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-teacher"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <MainLayout>
                    <AddTeacher />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-teacher/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <MainLayout>
                    <AddTeacher />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher_list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <TeachersList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-details/:id"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <TeacherDetails />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-timetable"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <TeachersTimetable />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-staff"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <MainLayout>
                    <AddStaff />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-staff/:id"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <MainLayout>
                    <AddStaff />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff_list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StaffList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff-details/:id"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StaffDetails />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/raise-request-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <RaiseRequestList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/Admin-Tickets"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AdminTickets />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/leave-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Leave />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fees-config"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <FeesConfigure />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-wise-fees-config"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentWiseFeesConfig />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fees"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Fees />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fees-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <FeesList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-fees-status"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AdminFeesStatus />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-schedule"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AdminAddSchedule />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-schedule/:id"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AdminAddSchedule />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-exam"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddExamSchedule />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-exam/:id"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddExamSchedule />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/exam-schedule-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <ExamScheduleList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/results-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <ResultsList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/Student-wise-Overall-Results"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentOverallResults />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-wise-results-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentWiseResultsList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/predictive-analysis-dashboard"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <PredictiveAnalysisDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/answer-sheets"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AnswerSheets />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-analytics"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentAnalytics />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Assignment-List"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AssignmentHomework />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-assignment-submission"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentAssignmentSubmission />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/Add-Feedback"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddFeedback />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/Add-Feedback/:id"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddFeedback />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/Feedback-Lists"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <FeedbackLists />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/Student-Feedback-Submission"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentFeedbackSubmission />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/Fees-Management-Dashboard"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <FeesManagementDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/announcements-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AnnouncementsList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-announcements"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddAnnouncements />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <NotificationsList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-notifications"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddNotifications />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bonafide-certificate-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <BonafideCertificateList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bonafide-certificate-list/:id"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <BonafideCertificateList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/issue-bonafide-certificate"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <IssueBonafideCertificate />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/issue-bonafide-certificate/:id"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <IssueBonafideCertificate />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/transfer-certificate-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <TransferCertificateList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/issue-transfer-certificate"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <IssueTransferCertificate />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/issue-transfer-certificate/:id"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <IssueTransferCertificate />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-attendance"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AdminAttendanceList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/biometric-attendance"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <BiometricAttendance />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notice-board"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AdminNoticeBoard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/upcoming-events"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AdminUpcomingEvents />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-performance"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentPerformance />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-transportation"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentTransportation />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-transportation-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <StudentTransportationList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/transportation"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Transportation />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/new-routes"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <NewRoutes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-school-details"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddSchoolDetails />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/school-details-view"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <SchoolDetailsView />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/new-expenses"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <NewExpenses />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/financial-overview"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <FinancialOverview />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-payslips"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddPayslips />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payslip-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <PayslipList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payslip-download"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <PayslipDownload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bulk-upload"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <BulkUpload />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/textbooks"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Textbooks />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/classes"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Class />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/subjects"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Subject />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/departments"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Department />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/branches"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <Branches />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/academic-year"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AcademicYear />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/examination-type"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <ExaminationType />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/virtualClasslist"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <VirtualClassList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recorded-classes"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <RecordedClasses />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-vertual-class"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <AddVirtualClass />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/public-virtual-classes"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <PublicVirtualClasses />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/virtual-class-joined-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <VirtualClassJoinedList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fees-refund"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <FeesRefund />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fee-refund-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <FeeRefundList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/principal-fee-refund-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <PrincipalFeeRefundList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/generate-hall-ticket"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <GenerateHallTicket />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
 
            <Route
              path="/hall-ticket-list"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <HallTicketList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hall-ticket"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <HallTicket />
                </ProtectedRoute>
              }
            />

             <Route
              path="/class-timing-schedule"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <ClassTimingSchedule />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* TEACHER */}
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherDashboard />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-personal-details"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherPersonalDetails />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-attendance"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherAttendance />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-payslip"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherPayslip />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-leave"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherLeave />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-time-table"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherTimetable />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-raise-request-list"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherRaiseRequestList />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-raise-ticket"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherRaiseTicket />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-reimbursement"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherReimbursement />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-assignment-homework"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherAssignmentHomework />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-assignment-submission"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherAssignmentSubmission />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-student-attendance"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherStudentAttendance />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-student-attendance-list"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherStudentAttendanceList />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-results-list"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherResultsList />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-add-exam-results"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherAddExamResults />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/daily-student-performance"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherDailyStudentPerformance />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-performance-list"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <TeacherDailyStudentPerformanceList />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teachervirtualClasslist"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <MainLayout>
                    <TeacherVirtualClassList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-recorded-classes"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <MainLayout>
                    <RecordedClasses />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-add-vertual-class"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <MainLayout>
                    <TeacherAddVirtualClass />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-public-virtual-classes"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <MainLayout>
                    <TeacherPublicVirtualClasses />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-virtual-class-joined-list"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <MainLayout>
                    <TeacherVirtualClassJoinedList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* STUDENT */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-details"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <StudentDetails />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-attendance"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <Attendance />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-homework"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <StudentHomework />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-exam-timetable"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <StudentExamTimetable />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-hall-ticket"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <StudentHallTicket />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-exam-reports"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <StudentExamReports />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/video-library"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <VideoLibrary />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/video-library/:subject"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <VideoLibrary />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/meeting-schedule"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <MeetingSchedule />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            {/* PARENT PORTAL ROUTES */}
            <Route
              path="/parent-dashboard"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsDashboard />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-assignment-homework"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsAssignmentHomework />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-feedback"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsFeedback />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-student-profile"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsStudentProfile />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-exam-reports"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsExamReports />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-exam-timetable"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsExamTimetable />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-fees"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsFees />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-attendance"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsAttendance />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-leave"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentsLeave />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/parent-transportation"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <ParentTransportation />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            {/* STAFF */}
            <Route
              path="/staff-dashboard"
              element={
                <ProtectedRoute roles={["staff-portal"]}>
                  <StaffLayout>
                    <StaffDashboard />
                  </StaffLayout>
                </ProtectedRoute>
              }
            />

            {/* COMMON PAGES - NOTICE BOARD & UPCOMING EVENTS */}
            {/* Notice Board - Admin */}
            <Route
              path="/admin/notice-board-view"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <CommonNoticeBoard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Upcoming Events - Admin */}
            <Route
              path="/admin/upcoming-events-view"
              element={
                <ProtectedRoute roles={["admin", "staff-administration"]}>
                  <MainLayout>
                    <CommonUpcomingEvents />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Notice Board - Teacher */}
            <Route
              path="/teacher/notice-board-view"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <CommonNoticeBoard />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            {/* Upcoming Events - Teacher */}
            <Route
              path="/teacher/upcoming-events-view"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <CommonUpcomingEvents />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            {/* Notice Board - Student */}
            <Route
              path="/student/notice-board-view"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <CommonNoticeBoard />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            {/* Upcoming Events - Student */}
            <Route
              path="/student/upcoming-events-view"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <CommonUpcomingEvents />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            {/* Notice Board - Parent */}
            <Route
              path="/parent/notice-board-view"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <CommonNoticeBoard />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            {/* Upcoming Events - Parent */}
            <Route
              path="/parent/upcoming-events-view"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <CommonUpcomingEvents />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student-exam-report-card"
              element={
                <ProtectedRoute roles={["parent-portal"]}>
                  <ParentLayout>
                    <StudentExamReportCard />
                  </ParentLayout>
                </ProtectedRoute>
              }
            />

            {/* GENERAL PAGES */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* NOTIFICATIONS */}
            <Route
              path="/student-notifications"
              element={
                <ProtectedRoute roles={["student-portal"]}>
                  <StudentLayout>
                    <Notifications />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-notifications"
              element={
                <ProtectedRoute roles={["teacher-portal"]}>
                  <TeacherLayout>
                    <Notifications />
                  </TeacherLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
            )}
      </BrowserRouter>
    </>
  );
}

export default App;
