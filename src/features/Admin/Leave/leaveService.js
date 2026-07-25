import API from "../../../services/api";

// ✅ GET ALL LEAVES
export const getLeaves = () => {
  return API.get("/leaves");
};

// ✅ GET LEAVE STATUS SUMMARY
export const getLeaveStatus = async () => {
  const response = await API.get("/leaves");

  const leaves = response.data || [];

  return {
    data: {
      APPROVED: leaves.filter((item) => item.status === "APPROVED").length,

      PENDING: leaves.filter((item) => item.status === "PENDING").length,

      REJECTED: leaves.filter((item) => item.status === "REJECTED").length,

      onLeave: leaves.filter((item) => item.status === "APPROVED").length,
    },
  };
};

// ✅ GET USER LEAVES
export const getUserLeaves = (userId) => {
  return API.get(`/leaves/user/${userId}`);
};

// ✅ APPLY LEAVE
export const applyLeave = (formData) => {
  return API.post("/leaves/apply", formData);
};

// ✅ UPDATE LEAVE STATUS
export const updateLeaveStatus = (id, status, comment) => {
  return API.put(`/leaves/${id}/status`, {
    status,
    approvedBy: "Admin",
    rejectionReason: status === "REJECTED" ? comment : null,
  });
};

//get departments
export const getDepartments = async () => {
  const response = await API.get("/departments");

  return response.data;
};
