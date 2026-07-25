import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import financialOverviewReducer from "../features/Admin/FinancialOverview/financialOverviewSlice";
import superAdminLocationReducer from "../features/SuperAdmin/Location/superAdminLocationSlice";
import studentReducer from "../features/admin/student/studentSlice";
import reimbursementReducer from "../features/Admin/Reimbursements/reimbursementSlice";
import teacherReducer from "../features/admin/teacher/teacherSlice";
import timetableReducer from "../features/Admin/teacherTimetable/teacherTimetableSlice";
import ticketReducer from "../features/Admin/Tickets/ticketSlice";
import homeworkReducer from "../features/Admin/Assignment-Homework/HomeworkSlice";
import leaveReducer from "../features/Admin/Leave/leaveSlice";
import raiserequestReducer from "../features/admin/Raiserequest/RaiserequestSlice";
import teacherLeaveSlice from "../features/teacher/leaves/teacherLeaveSlice";
import teacherHomeworkReducer from "../features/teacher/homework/teacherHomeworkSlice";
import teacherTimetableReducer from "../features/teacher/timetable/teacherTimetableSlice";
import teacherDetailsReducer from "../features/teacher/TeacherDetails/teacherDetailsSlice";
import teacherReimbursementReducer from "../features/teacher/Reimbursements/reimbursementSlice";
import raiseTicketReducer from "../features/teacher/RaiseaTicket/raiseaticketSlice";
import studentHomeworkReducer from "../features/student/homework/studentHomeworkSlice";
import studentDetailsReducer from "../features/student/studentDetails/studentDetailsSlice";
import examScheduleReducer from "../features/Admin/ExamSchedule/examScheduleSlice";
// import studentDetailsReducer from "../features/student/studentDetails/studentDetailsSlice";
import attendanceReducer from "../features/teacher/Attendance/attendanceSlice";
import studentAttendenceReducer from "../features/teacher/StudentAttendence/studentAttendenceSlice";
import examResultReducer from "../features/Admin/ExamResult/examResultSlice";
import teacherExamResultsReducer from "../features/teacher/ExamResults/examResultsSlice";
import feesConfigReducer from "../features/Admin/FeesConfig/feesConfigSlice";
import studentPerformanceReducer from "../features/Admin/StudentPerformance/studentPerformanceSlice";
import StudentWiseOverallResultsReducer from "../features/Admin/StudentWiseOverallResults/StudentWiseOverallResultsSlice";
import studentWiseFeesReducer from "../features/Admin/StudentWiseFees/studentWiseFeesSlice";
import feesTransactionReducer from "../features/Admin/FeesTransaction/feesTransactionSlice";
import feedbackReducer from "../features/Admin/Feedback/feedbackSlice";
import staffReducer from "../features/Admin/Staff/staffSlice";
import notificationReducer from "../features/Admin/Notifications/notificationSlice";
import announcementsReducer from "../features/Admin/Announcements/announcementsSlice";
import studentAttendenceReportReducer from "../features/student/studentAttendenceReport/studenceAttendenceReportSlice";
import studentExamReducer from "../features/student/studentExams/studentExamSlice";
import dashboardReducer from "../features/Admin/Dashboard/dashboardSlice";
import teacherRaiseRequestsReducer from "../features/teacher/RaiseRequests/teacherRaiseRequestsSlice";
import feesDashboardReducer from "../features/Admin/FeesDashboard/feesDashboardSlice";
import TeacherRaiseRequestReducer from "../features/teacher/RaiseRequests/teacherRaiseRequestsSlice";
import userNotificationsReducer from "../features/Notifications/notificationsSlice";
import parentFeesReducer from "../features/parent/Fees/parentFeesSlice";
import teacherDashboardReducer from "../features/teacher/Dashboard/teacherDashboardSlice";
import parentDashboardReducer from "../features/parent/Dashboard/parentDashboardSlice";
import predictiveAnalysisReducer from "../features/Admin/PredictiveAnalysis/predictiveAnalysisSlice";
import answerSheetsReducer from "../features/Admin/AnswerSheets/answerSheetsSlice";
import upcomingEventsReducer from "../features/Admin/UpcomingEvents/upcomingEventsSlice";
import studentDashboardReducer from "../features/student/dashboard/studentDashboardSlice";
import parentFeedbackReducer from "../features/parent/Feedback/parentfeedbackSlice";
import parentLeaveReducer from "../features/parent/leave/leaveSlice";
import noticeBoardReducer from "../features/Admin/NoticeBoard/noticeBoardSlice";
import performanceReducer from "../features/teacher/studentPerformance/performanceSlice";
import teacherPerformanceReducer from "../features/teacher/studentPerformance/performanceSlice";
import staffDashboardReducer from "../features/staff/Dashboard/staffDashboardSlice";
import parentExamtimetableReducer from "../features/parent/ExamTimetable/parentExamtimetableSlice";
import parentExamReportsReducer from "../features/parent/ExamReports/parentExamReportsSlice";
import expensesReducer from "../features/Admin/Expenses/expensesSlice";
import schoolDetailsReducer from "../features/Admin/SchoolDetails/schoolDetailsSlice";
import bonafideCertificateReducer from "../features/Admin/BonafideCertificate/bonafideCertificateSlice";
// import transferCertificateReducer from "../features/Admin/TransferCertificate/transferCertificateSlice";
import transferCertificateReducer from "../features/Admin/TransferCertificate/transferCertificateSlice";
import portalUpcomingEventReducer from "../features/common/portal/portalUpcomingEventSlice";
import portalNoticeBoardReducer from "../features/common/portal/portalNoticeBoardSlice";
import parentHomeworkReducer from "../features/parent/Homework/parentHomeWorkSlice";
import feesStatusReducer from "../features/Admin/FeesStatus/feesStatusSlice";
import bulkUploadReducer from "../features/Admin/BulkUpload/bulkUploadSlice";
import classReducer from "../features/Admin/Class/classSlice";
import departmentReducer from "../features/Admin/Department/departmentSlice";
import branchReducer from "../features/Admin/Branch/branchSlice";
import locationReducer from "../features/Admin/Location/locationSlice";
import textbooksReducer from "../features/Admin/Textbooks/textbookSlice";
import hallTicketReducer from "../features/Admin/HallTicket/hallTicketSlice";
import studentHallTicketReducer from "../features/student/studentHallTicket/studentHallTicketSlice";
import superAdminAuthReducer from "../features/SuperAdmin/Authentication/superAdminAuthSlice";
import superAdminSchoolsReducer from "../features/SuperAdmin/Schools/superAdminSchoolSlice";
import teacherAttendanceReducer from "../features/teacher/Attendance/teacherAttendanceSlice";
import academicYearReducer from "../features/Admin/AcademicYear/academicYearSlice";
import examinationTypeReducer from "../features/Admin/ExaminationType/examinationTypeSlice";
export const store = configureStore({
  reducer: {
     auth: authReducer,
    student: studentReducer,
    dashboard: dashboardReducer,
    predictiveAnalysis: predictiveAnalysisReducer,
    answerSheets: answerSheetsReducer,
    upcomingEvents: upcomingEventsReducer,
    teacherRaiseRequests: teacherRaiseRequestsReducer,
    reimbursement: reimbursementReducer,
    teacher: teacherReducer,
    timetable: timetableReducer,
    tickets: ticketReducer,
    homework: homeworkReducer,
    leave: leaveReducer,
    raiserequest: raiserequestReducer,
    teacherLeaves: teacherLeaveSlice, // Add teacherLeaves reducer here
    teacherHomework: teacherHomeworkReducer, // Add teacherHomework reducer here
    teacherTimetable: teacherTimetableReducer, // Add teacherTimetable reducer here
    teacherDetails: teacherDetailsReducer,
    teacherReimbursement: teacherReimbursementReducer,
    raiseTicket: raiseTicketReducer,
    studentHomework: studentHomeworkReducer, // Add studentHomework reducer here
    studentDetails: studentDetailsReducer,
    examSchedule: examScheduleReducer,
    // studentDetails: studentDetailsReducer,
    attendance: attendanceReducer,
    studentAttendence: studentAttendenceReducer,
    examResult: examResultReducer,
    teacherExamResults: teacherExamResultsReducer,
    feesConfig: feesConfigReducer,
    studentPerformance: studentPerformanceReducer,
    StudentWiseOverallResults: StudentWiseOverallResultsReducer,
    studentWiseFees: studentWiseFeesReducer,
    feesTransaction: feesTransactionReducer,
    feedback: feedbackReducer,
    staff: staffReducer,
    notification: notificationReducer,
    announcements: announcementsReducer,
    studentAttendenceReport: studentAttendenceReportReducer,
    studentExam: studentExamReducer,
    feesDashboard: feesDashboardReducer,
    teacherRaiseRequest: TeacherRaiseRequestReducer,
    userNotifications: userNotificationsReducer,
    parentFees: parentFeesReducer,
    teacherDashboard: teacherDashboardReducer,
    parentDashboard: parentDashboardReducer,
    studentDashboard: studentDashboardReducer,
    parentFeedback: parentFeedbackReducer,
    parentLeave: parentLeaveReducer,
    noticeBoard: noticeBoardReducer,
    adminStudentPerformance: performanceReducer,
    teacherPerformance: teacherPerformanceReducer,
    staffDashboard: staffDashboardReducer,
    parentExamtimetable: parentExamtimetableReducer,
    parentExamReports: parentExamReportsReducer,
    expenses: expensesReducer,
    schoolDetails: schoolDetailsReducer,
    bonafideCertificate: bonafideCertificateReducer,
    transferCertificate: transferCertificateReducer,
    portalUpcomingEvent: portalUpcomingEventReducer,
    portalNoticeBoard: portalNoticeBoardReducer,
    parentHomework: parentHomeworkReducer,
    feesStatus: feesStatusReducer,
    bulkUpload: bulkUploadReducer,
    class: classReducer,
    department: departmentReducer,
    branch: branchReducer,
    location: locationReducer,
    textbooks: textbooksReducer,
    hallTicket: hallTicketReducer,
    studentHallTicket: studentHallTicketReducer,
    superAdminAuth: superAdminAuthReducer,
    superAdminSchools: superAdminSchoolsReducer,
    teacherAttendance: teacherAttendanceReducer,
    financialOverview: financialOverviewReducer,
    superAdminLocation: superAdminLocationReducer,
    academicYear: academicYearReducer,
    examinationType: examinationTypeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
