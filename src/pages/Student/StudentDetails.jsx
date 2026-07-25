import React from "react";
import girl from "../../assets/girl.png";
import bgimage from "../../assets/bgimage.png";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  fetchStudentDetails,
  fetchStudentDetailsByProfile,
} from "../../features/student/studentDetails/studentDetailsSlice";

// const studentData = {
//   name: "Hari Priya",
//   admissionNo: "AD1256589",
//   class: "2nd",
//   section: "A",
//   rollNo: "10",
//   subjects: ["Telugu", "Hindi", "English", "Maths", "Science", "Social"],
//   languages: "English, Hindi, Telugu",
//   personal: {
//     age: "8Y",
//     gender: "Female",
//     dob: "01/01/2018",
//     hobbies: "Playing Cricket, Listening Music",
//     fatherName: "Johnson",
//     motherName: "Mathew",
//     phone: "9876543210",
//     altPhone: "8765432109",
//     email: "xyz@gmail.com",
//     presentAddress: "2A/102, Gachibowli, Hyderabad, Telangana",
//     permanentAddress: "2A/102, Gachibowli, Hyderabad, Telangana",
//   },
//   previousSchool: "Stuyvesant High School",
//   documents: [{ label: "Aadhar Upload", file: "aadhar.pdf", url: "#" }],
// };

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
      <p className="text-md font-semibold text-black  px-5 py-3 border-b border-gray-100">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <tr className="">
      <td className="px-5 py-2.5 text-black text-md w-52 whitespace-nowrap">
        {label}
      </td>
      <td className="px-5 py-2.5 text-gray-800 text-sm">{children}</td>
    </tr>
  );
}

export default function StudentDetails() {
  const dispatch = useDispatch();
  const { studentDetails, loading, error } = useSelector(
    (state) => state.studentDetails,
  );
  // useEffect(() => {
  //   dispatch(fetchStudentDetails(7));
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStudentDetailsByProfile());
  }, [dispatch]);
  const {
    fullName,
    admissionNo,
    className,
    section,
    rollNo,
    dob,
    gender,
    hobbies,
    fatherName,
    motherName,
    phoneNo,
    altPhoneNo,
    email,
    presentAddress,
    permanentAddress,
    previousSchoolName,
    subjects,
    languages,
    documents,
  } = studentDetails || {};

  return (
    <div className="min-h-screen  ">
      <div className="px-2">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>

        <p className="text-sm text-gray-500 mb-6">Student / Student Details</p>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Banner */}
          <div
            className="h-62 rounded-lg overflow-hidden relative flex items-center justify-center text-center"
            style={{
              backgroundImage: `url(${bgimage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700/70 to-blue-500/60"></div>

            <div className="relative z-10 flex flex-col items-center">
              <img
                src={girl}
                alt="Student"
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
              />

              <h2 className="text-white text-2xl font-semibold mt-3">
                {studentDetails?.fullName}
              </h2>

              <p className="text-white/90 text-sm mt-1">
                Admission No.: {studentDetails?.admissionNo}
              </p>
            </div>
          </div>

          {/* Student Details Card */}
          <div className=" bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-md font-semibold text-black mb-3">
              Student Details
            </p>

            <div className="grid grid-cols-[120px_1fr] gap-y-2 text-md">
              <span className="text-gray-800">Class</span>
              <span>{studentDetails?.className}</span>

              <span className="text-gray-800">Section</span>
              <span>{studentDetails?.section}</span>

              <span className="text-gray-800 ">Roll No</span>
              <span className="font-sm text-gray-700">
                {studentDetails?.rollNo}
              </span>

              <span className="text-gray-800">Subjects</span>
              <div className="flex flex-wrap gap-2 max-w-[260px]">
                {studentDetails?.subjects?.map((sub) => (
                  <span
                    key={sub}
                    className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-gray-700"
                  >
                    {sub}
                  </span>
                ))}
              </div>

              <span className="text-gray-800">Languages</span>
              <span>{studentDetails?.languages}</span>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <Section title="Personal Information" className="mb-4 tetx-semibold">
          <table className="w-full">
            <tbody>
              {/* <InfoRow className="text-gray-800" label="Age">
                {age}
              </InfoRow> */}
              <InfoRow className="text-gray-800" label="Gender">
                {studentDetails?.gender}
              </InfoRow>
              <InfoRow className="text-gray-800" label="DOB">
                {studentDetails?.dob}
              </InfoRow>
              <InfoRow className="text-gray-800" label="Hobbies">
                {studentDetails?.hobbies}
              </InfoRow>
              <InfoRow className="text-gray-800" label="Father/Guardian Name">
                {studentDetails?.fatherName}
              </InfoRow>
              <InfoRow className="text-gray-800" label="Mother Name">
                {studentDetails?.motherName}
              </InfoRow>
              <InfoRow className="text-gray-800" label="Phone">
                {studentDetails?.phoneNo}
              </InfoRow>
              <InfoRow className="text-gray-800" label="Alternative Phone">
                {studentDetails?.altPhoneNo}
              </InfoRow>
              <InfoRow className="text-gray-800" label="Email">
                {studentDetails?.email}
              </InfoRow>
              <InfoRow className="text-gray-800" label="Present Address">
                {studentDetails?.presentAddress}
              </InfoRow>
              <InfoRow className="text-gray-800" label="Permanent Address">
                {studentDetails?.permanentAddress}
              </InfoRow>
            </tbody>
          </table>
        </Section>

        {/* Previous School */}
        <Section title="Previous School Details">
          <table className="w-full">
            <tbody>
              <InfoRow className="text-gray-800" label="School">
                {studentDetails?.previousSchoolName}
              </InfoRow>
            </tbody>
          </table>
        </Section>

        {/* Documents */}
        <Section title="Documents">
          <table className="w-full">
            <tbody>
              {studentDetails?.documents?.map((doc) => (
                <InfoRow key={doc.label} label={doc.label}>
                  <a
                    href={doc.url}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {doc.file}
                  </a>
                </InfoRow>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}
