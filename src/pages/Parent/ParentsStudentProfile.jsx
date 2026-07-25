import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetailsByProfile } from "../../features/student/studentDetails/studentDetailsSlice";

import girl from "../../assets/girl.png";
import boy from "../../assets/boy.png";


export default function ParentsStudentProfile() {
  const dispatch = useDispatch();
  const { studentDetails } = useSelector((state) => state.studentDetails);
  const { selectedStudentId } = useSelector((state) => state.parentDashboard);

  useEffect(() => {
    if (selectedStudentId) {
      dispatch(fetchStudentDetailsByProfile(selectedStudentId));
    }
  }, [selectedStudentId, dispatch]);

  const student = {
    id: studentDetails?.admissionNo || "AD1256589",
    name: studentDetails?.fullName || "Hari Priya",
    class: studentDetails?.className || "2nd",
    section: studentDetails?.section || "A",
    rollNo: studentDetails?.rollNo || "10",
    subjects: studentDetails?.subjects || [
      "Telugu",
      "Hindi",
      "English",
      "Maths",
      "Science",
      "Social",
    ],
    languages: studentDetails?.languages || "English, Hindi, Telugu",
    age: studentDetails?.age || "8Y",
    gender: studentDetails?.gender || "Female",
    dob: studentDetails?.dob || "01/01/2018",
    hobbies: studentDetails?.hobbies || "Playing Cricket, Listening Music",
    // fatherName: studentDetails?.fatherName || "Johnson",
    fatherName:
      studentDetails?.fatherName ||
      studentDetails?.guardianName ||
      "-",
    // motherName: studentDetails?.motherName || "Matthew",
    motherName: studentDetails?.motherName || "-",
    phone: studentDetails?.phoneNo || "9876543210",
    alternativePhone: studentDetails?.altPhoneNo || "8765432109",
    email: studentDetails?.email || "xyz@gmail.com",
    presentAddress:
      studentDetails?.presentAddress ||
      "2A/102, 1st floor, Gachibowli, Hyderabad, Telangana",
    permanentAddress:
      studentDetails?.permanentAddress ||
      "2A/102, 1st floor, Gachibowli, Hyderabad, Telangana",
    previousSchool:
      studentDetails?.previousSchoolName || "Shuyansh High School",
    aadhar: studentDetails?.aadharFileUrl || "",
    // aadhar: studentDetails?.documents?.[0]?.file || "aadhar.pdf",
  };

  const defaultProfileImage =
    student.gender?.toLowerCase() === "female"
      ? girl
      : boy;

  const profileImage =
    studentDetails?.photoUrl &&
      !studentDetails.photoUrl.toLowerCase().endsWith(".pdf")
      ? studentDetails.photoUrl
      : defaultProfileImage;

  return (
    <div className="w-full px-4 sm:px-6">

      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Student Profile
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Home / Student Profile
      </p>

      {/* STUDENT PROFILE CARD */}
      <div className="card overflow-hidden mb-4">

        {/* Banner */}
        <div
          className="relative px-6 py-8 text-white bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5">

            <img
              src={profileImage}
              alt={student.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultProfileImage;
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg"
            />

            <div className="text-center sm:text-left">

              <p className="text-sm text-purple-100">
                Admission No.
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold">
                {student.name}
              </h2>

              <p className="text-sm text-purple-100 mt-1">
                {student.id}
              </p>

              <p className="text-sm mt-2">
                Class {student.class}
                {student.section
                  ? ` - Section ${student.section}`
                  : ""}
              </p>

            </div>

          </div>
        </div>

        {/* Student Details */}
        <div className="p-4 sm:p-6 bg-gray-50">

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">

            <div>
              <p className="text-xs text-gray-500 font-medium">
                Class
              </p>

              <p className="text-lg font-bold text-gray-800">
                {student.class || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">
                Section
              </p>

              <p className="text-lg font-bold text-gray-800">
                {student.section || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">
                Roll No
              </p>

              <p className="text-lg font-bold text-gray-800">
                {student.rollNo || "-"}
              </p>
            </div>

          </div>

          {/* Subjects */}
          <div className="mt-6">

            <p className="text-xs text-gray-500 font-medium mb-3">
              Subjects
            </p>

            <div className="flex flex-wrap gap-2">

              {(Array.isArray(student.subjects)
                ? student.subjects
                : []
              ).map((subject, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {typeof subject === "string"
                    ? subject
                    : subject?.subjectName}
                </span>
              ))}

            </div>

          </div>

          {/* Languages */}
          <div className="mt-6">

            <p className="text-xs text-gray-500 font-medium">
              Languages
            </p>

            <p className="text-sm text-gray-800 mt-1">
              {student.languages || "-"}
            </p>

          </div>

        </div>

      </div>

      {/* PERSONAL INFORMATION */}
      <div className="card overflow-hidden mb-6">

        <div className="h-[50px] flex items-center px-4 border-b border-gray-200">
          <h3 className="text-[16px] font-semibold text-[#333333]">
            Personal Information
          </h3>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-5">

          {[
            { label: "Age", value: student.age },
            { label: "Gender", value: student.gender },
            { label: "Date of Birth", value: student.dob },
            { label: "Hobbies", value: student.hobbies },
            { label: "Father / Guardian Name", value: student.fatherName },
            { label: "Mother Name", value: student.motherName },
            { label: "Phone Number", value: student.phone },
            {
              label: "Alternative Phone",
              value: student.alternativePhone,
            },
            { label: "Email", value: student.email },
            { label: "Present Address", value: student.presentAddress },
            {
              label: "Permanent Address",
              value: student.permanentAddress,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[140px_1fr] gap-3"
            >
              <p className="text-sm text-gray-500 font-medium">
                {item.label}
              </p>

              <p className="text-sm font-medium text-gray-800 break-words">
                {item.value || "-"}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* PREVIOUS SCHOOL DETAILS */}
      <div className="card overflow-hidden mb-6">

        <div className="h-[50px] flex items-center px-4 border-b border-gray-200">
          <h3 className="text-[16px] font-semibold text-[#333333]">
            Previous School Details
          </h3>
        </div>

        <div className="p-4 sm:p-6">

          <div className="grid grid-cols-[180px_1fr] gap-3">

            <p className="text-sm text-gray-500 font-medium">
              Previous School Name
            </p>

            <p className="text-sm font-medium text-gray-800 break-words">
              {student.previousSchool || "-"}
            </p>

          </div>

        </div>

      </div>

      {/* DOCUMENTS */}
      <div className="card overflow-hidden mb-6">

        <div className="h-[50px] flex items-center px-4 border-b border-gray-200">
          <h3 className="text-[16px] font-semibold text-[#333333]">
            Documents
          </h3>
        </div>

        <div className="p-4 sm:p-6">

          <div className="grid grid-cols-[140px_1fr] gap-3">

            <p className="text-sm text-gray-500 font-medium">
              Aadhar Document
            </p>

            <div>
              {student.aadhar ? (
                <a
                  href={student.aadhar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                >
                  View Aadhar Document
                </a>
              ) : (
                <span className="text-gray-500">
                  No documents available
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
