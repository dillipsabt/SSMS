import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStaffByIdAsync } from "../../features/Admin/Staff/staffSlice";

const Field = ({ label, value, link }) => (
  <div>
    <p className="text-[12px] text-gray-500">{label}</p>

    {link ? (
      <a href="#" className="text-brand-600 text-sm hover:underline">
        {value || "-"}
      </a>
    ) : (
      <p className="text-sm text-gray-800 break-words">{value || "-"}</p>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <div className="card mb-5">
    <div className="card-section">{title}</div>
    <div className="p-3 sm:p-4">{children}</div>
  </div>
);

const StaffDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    singleStaff: s,
    loading,
    error,
  } = useSelector((state) => state.staff);

  useEffect(() => {
    if (id) {
      dispatch(getStaffByIdAsync(id));
    }
  }, [id, dispatch]);

  if (loading) return <p className="p-4 sm:p-6 text-gray-500">Loading...</p>;
  if (error)
    return (
      <p className="p-4 sm:p-6 text-red-500">Error loading staff details.</p>
    );
  if (!s) return <p className="p-4 sm:p-6 text-gray-400">No data found.</p>;

  return (
    <div>
      <h1 className="text-[18px] font-semibold text-[#333333]">
        Staff Details
      </h1>
      <p className="text-[12px] sm:text-sm text-gray-500 mb-4">
        Staff / Staff Details
      </p>

      {/* BASIC */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Full Name" value={s.fullName} />
          <Field label="ID No." value={s.id} />
          <Field label="Department" value={s.department} />

          <Field label="Designation" value={s.designation} />
          <Field label="Gender" value={s.gender} />
          <Field label="Date of Birth" value={s.dob?.split("T")[0] || s.dob} />

          <Field label="Father / Guardian Name" value={s.fatherName} />
          <Field label="Mother Name" value={s.motherName} />
          <Field label="Marital Status" value={s.maritalStatus} />

          <Field label="Contract Type" value={s.contractType} />
          <Field label="Shift" value={s.shift} />
          <Field
            label="Work Location"
            value={s.worklocation || s.workLocation}
          />

          <Field
            label="Join Date"
            value={s.joinDate?.split("T")[0] || s.joinDate}
          />
          <Field label="Phone No." value={s.phoneNo} />
          <Field label="Alt Phone No." value={s.altPhoneNo} />

          <Field label="Email Id" value={s.email} />
          <Field
            label="Total Years of Experience"
            value={s.totalYearsExperience}
          />
          <Field label="Qualification" value={s.qualification} />

          <Field label="Religion" value={s.religion} />
          <Field label="Blood Group" value={s.bloodGroup} />
          <Field label="Aadhar No" value={s.aadharNumber} />

          <Field label="PAN No" value={s.panNo} />
        </div>
      </Section>

      {/* BANK */}
      {(s.bankAccountNumber || s.bankName) && (
        <Section title="Bank Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Bank Account Number" value={s.bankAccountNumber} />
            <Field label="Bank Name" value={s.bankName} />
            <Field label="IFSC Code" value={s.ifscCode} />
            <Field label="Branch Name" value={s.branchName} />
            <Field label="PF Number" value={s.pfNumber} />
          </div>
        </Section>
      )}

      {/* LICENSE DETAILS - SHOWN ONLY FOR DRIVER DEPARTMENT */}
      {s.licenseDetails && (s.department?.toLowerCase() === "driver" || s.departmentName?.toLowerCase() === "driver") && (
        <Section title="License Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="License Number" value={s.licenseDetails.licenseNumber} />
            <Field label="License Expiry Date" value={s.licenseDetails.licenseExpiryDate?.split("T")[0] || s.licenseDetails.licenseExpiryDate} />
          </div>
        </Section>
      )}

      {/* WORK EXPERIENCE */}
      {s.workExperiences?.length > 0 && (
        <Section title="Work Experience Details">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border min-w-[500px]">
              <thead className="thead-row">
                <tr>
                  <th className="border px-2 py-1 text-left">Company Name</th>
                  <th className="border px-2 py-1 text-left">Years</th>
                  <th className="border px-2 py-1 text-left">From</th>
                  <th className="border px-2 py-1 text-left">To</th>
                </tr>
              </thead>
              <tbody>
                {(s.workExperiences || []).map((exp, i) => (
                  <tr key={i} className="border-t">
                    <td className="border px-2 py-1">
                      {exp.companyName || "-"}
                    </td>
                    <td className="border px-2 py-1">{exp.years || "-"}</td>
                    <td className="border px-2 py-1">
                      {exp.startDate?.split("T")[0] || "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {exp.endDate?.split("T")[0] || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* ADDRESS */}
      <Section title="Address">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[12px] text-gray-500">Present Address</p>
            <p className="text-sm text-gray-800 break-words">
              {s.presentAddress || "-"}
            </p>
          </div>

          <div>
            <p className="text-[12px] text-gray-500">Permanent Address</p>
            <p className="text-sm text-gray-800 break-words">
              {s.permanentAddress || "-"}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default StaffDetails;
