import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import girl from "../../assets/girl.png";
import bgimage from "../../assets/bgimage.png";

import { fetchTeacherProfileAsync } from "../../features/teacher/TeacherDetails/teacherDetailsSlice";

function Section({ title, children, className = "" }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden mb-3 ${className}`}
    >
      <p className="text-md font-semibold text-black px-5 py-3 border-b border-gray-100">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function TeacherPersonalDetails() {
  const dispatch = useDispatch();

  const { teacher, loading } = useSelector(
    (state) => state.teacherDetails
  );

  useEffect(() => {
    dispatch(fetchTeacherProfileAsync());
  }, [dispatch]);


  if (loading) {
    return (
      <div className="p-5 text-center text-lg font-medium">
        Loading...
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-5 text-center text-lg font-medium">
        Teacher Details Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-1xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">
          Teacher Details
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Teacher / Teacher Details
        </p>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Banner */}
          <div
            className="md:col-span-3 h-62 rounded-lg overflow-hidden relative flex items-center justify-center text-center"
            style={{
              backgroundImage: `url(${bgimage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700/70 to-blue-500/60"></div>

            <div className="relative z-10 flex flex-col items-center">
              <img
                src={teacher.profileUrl || girl}
                alt="Teacher"
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
              />

              <h2 className="text-white text-2xl font-semibold mt-3">
                {teacher.fullName}
              </h2>

              <p className="text-white/90 text-sm mt-1">
                Teacher Code : {teacher.teacherCode}
              </p>
            </div>
          </div>

          {/* Teacher Details Card */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-md font-semibold text-black mb-4">
              Personal Information
            </p>

            <div className="grid grid-cols-[120px_1fr] gap-y-2 text-md">
              <span className="text-gray-900">Department</span>
              <span>{teacher.departmentName || "-"}</span>

              <span className="text-gray-900">Subjects</span>
              <span>{teacher.subject || "-"}</span>

              <span className="text-gray-900">Contract Type</span>
              <span className="text-gray-900">
                {teacher.contractType || "-"}
              </span>

              <span className="text-gray-900">Shift</span>
              <span className="text-gray-900">
                {teacher.shift || "-"}
              </span>

              <span className="text-gray-900">Work Location</span>
              <span>{teacher.worklocation || "-"}</span>
            </div>
          </div>
        </div>

        {/* Teacher Details */}
        <Section title="Teacher Details" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-25 gap-y-3 p-4">
            {/* Left */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Gender</span>
                <span className="text-gray-600">
                  {teacher.gender || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Date Of Birth</span>
                <span className="text-gray-600">
                  {teacher.dob || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Father / Guardian Name</span>
                <span className="text-gray-600">
                  {teacher.fatherName || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Mother Name</span>
                <span className="text-gray-600">
                  {teacher.motherName || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Phone</span>
                <span className="text-gray-600">
                  {teacher.phoneNo || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Email</span>
                <span className="text-gray-600">
                  {teacher.email || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Marital Status</span>
                <span className="text-gray-600">
                  {teacher.maritalStatus || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Join Date</span>
                <span className="text-gray-600">
                  {teacher.joinDate || "-"}
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="text-gray-600">
                  {teacher.totalYearsExperience || 0} Years
                </span>
              </div>

              <div className="flex justify-between">
                <span>Qualification</span>
                <span className="text-gray-600">
                  {teacher.qualification || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Aadhar No.</span>
                <span className="text-gray-600">
                  {teacher.aadharNumber || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Aadhar Upload</span>

                <span>
                  {teacher.aadharUrl ? (
                    <a
                      href={teacher.aadharUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )}
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Work Experience */}
        <Section title="Work Experience Details" className="mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="text-gray-500 bg-gray-50 text-sm">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">School Name</th>
                  <th className="px-4 py-3">Year of Experience</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">From Date</th>
                  <th className="px-4 py-3">To Date</th>
                  <th className="px-4 py-3">Certificate</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(teacher?.workExperiences) && teacher.workExperiences.length > 0 ? (
                  teacher.workExperiences.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-gray-700">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {item.schoolName}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {item.years}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {item.subject}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {item.startDate}
                      </td>

                      <td className="px-4 py-3 text-gray-700">
                        {item.endDate}
                      </td>

                      <td className="px-4 py-3">
                        {item.experienceCertUrl ? (
                          <a
                            href={item.experienceCertUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            View Certificate
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-4 text-gray-500"
                    >
                      No Work Experience Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Address */}
        <Section title="Address" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 p-4">
            <div className="space-y-3">
              <div className="flex flex-col">
                <span>Present Address</span>

                <span className="text-gray-600">
                  {teacher.presentAddress || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col">
                <span>Permanent Address</span>

                <span className="text-gray-600">
                  {teacher.permanentAddress || "-"}
                </span>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
