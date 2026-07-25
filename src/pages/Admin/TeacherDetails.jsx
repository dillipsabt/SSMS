import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherByIdAsync } from "../../features/Admin/Teacher/teacherSlice";

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

const TeacherDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleTeacher: t, loading, error } = useSelector(
    (state) => state.teacher
  );

  useEffect(() => {
    if (id) {
      dispatch(getTeacherByIdAsync(id));
    }
  }, [id, dispatch]);

  if (loading) return <p className="p-4 sm:p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-4 sm:p-6 text-red-500">Error loading teacher details.</p>;
  if (!t) return <p className="p-4 sm:p-6 text-gray-400">No data found.</p>;

  const subject =
    t.workExperiences?.length > 0
      ? t.workExperiences.map((w) => w.subject).join(", ")
      : t.departmentName || "-";

  return (
    <div>
      <h1 className="text-[18px] font-semibold text-[#333333]">
        Teacher Details
      </h1>
      <p className="text-[12px] sm:text-sm text-gray-500 mb-4">
        Teacher / Teacher Details
      </p>

      {/* BASIC */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Full Name" value={t.fullName} />
          <Field label="ID No." value={t.id} />
          <Field label="Subject" value={subject} />

          <Field label="Gender" value={t.gender} />
          <Field label="Date of Birth" value={t.dob?.split("T")[0] || t.dob} />
          <Field label="Father / Guardian Name" value={t.fatherName} />

          <Field label="Mother Name" value={t.motherName} />
          <Field label="Marital Status" value={t.maritalStatus} />
          <Field label="Contract Type" value={t.contractType} />

          <Field label="Shift" value={t.shift} />
          <Field label="Work Location" value={t.worklocation || t.workLocation} />
          <Field label="Join Date" value={t.joinDate?.split("T")[0] || t.joinDate} />

          <Field label="Phone No." value={t.phoneNo} />
          <Field label="Alt Phone No." value={t.altPhoneNo} />
          <Field label="Email Id" value={t.email} />

          <Field label="Total Years of Experience" value={t.totalYearsExperience} />
          <Field label="Qualification" value={t.qualification} />
          <Field label="Religion" value={t.religion} />

          <Field label="Blood Group" value={t.bloodGroup} />
          <Field label="Aadhar No" value={t.aadharNumber} />
          <Field label="PAN No" value={t.panNo} />
        </div>
      </Section>

      {/* BANK */}
      {(t.bankAccountNumber || t.bankName) && (
        <Section title="Bank Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Bank Account Number" value={t.bankAccountNumber} />
            <Field label="Bank Name" value={t.bankName} />
            <Field label="IFSC Code" value={t.ifscCode} />
            <Field label="Branch Name" value={t.branchName} />
            <Field label="PF Number" value={t.pfNumber} />
          </div>
        </Section>
      )}

      {/* WORK EXPERIENCE */}
      {t.workExperiences?.length > 0 && (
        <Section title="Work Experience Details">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border min-w-[500px]">
              <thead className="thead-row">
                <tr>
                  <th className="border px-2 py-1 text-left">School Name</th>
                  <th className="border px-2 py-1 text-left">Subject</th>
                  <th className="border px-2 py-1 text-left">Years</th>
                  <th className="border px-2 py-1 text-left">From</th>
                  <th className="border px-2 py-1 text-left">To</th>
                </tr>
              </thead>
              <tbody>
                {(t.workExperiences || []).map((exp, i) => (
                  <tr key={i} className="border-t">
                    <td className="border px-2 py-1">{exp.schoolName || "-"}</td>
                    <td className="border px-2 py-1">{exp.subject || "-"}</td>
                    <td className="border px-2 py-1">{exp.years || "-"}</td>
                    <td className="border px-2 py-1">{exp.startDate?.split("T")[0] || "-"}</td>
                    <td className="border px-2 py-1">{exp.endDate?.split("T")[0] || "-"}</td>
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
              {t.presentAddress || "-"}
            </p>
          </div>

          <div>
            <p className="text-[12px] text-gray-500">Permanent Address</p>
            <p className="text-sm text-gray-800 break-words">
              {t.permanentAddress || "-"}
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default TeacherDetails;
