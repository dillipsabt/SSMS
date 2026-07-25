import API from "../../../services/api";

// GET DASHBOARD DATA
export const getDashboardData = (params = {}) => {
  return API.get("/admin/dashboard", { params });
};

// UPDATE LEAVE REQUEST STATUS
export const updateLeaveStatus = (id, tabContext, status, comments = "") => {
  return API.patch(`/admin/dashboard/leaves/${id}`, null, {
    params: {
      tabContext,
      status,
      ...(comments && { comments }),
    },
  });
};

// GET ALL CLASSES
export const getClasses = () => {
  return API.get("/classes/get-all");
};

// GET CLASS PERFORMANCE
export const getClassPerformance = (classId) => {
  return API.get("/admin/dashboard/class-performance", {
    params: { classId },
  });
};

// GET ATTENDANCE
export const getAttendance = (tab = "STUDENT", breakdownType = "TODAY") => {
  return API.get("/admin/dashboard/attendance", {
    params: { tab, breakdownType },
  });
};
