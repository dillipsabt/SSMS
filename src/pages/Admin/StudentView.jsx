import React from "react";
import { useLocation } from "react-router-dom";

const StudentView = () => {
  const { state } = useLocation();

  // fallback if no data
  if (!state) {
    return (
      <div className="p-6">
        <h2>No Student Data Found</h2>
      </div>
    );
  }

  return (
    <div className="text-[12px]">
      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Student Details
      </h2>
      <p className="text-gray-500 mb-4">Student / Student List</p>

      {/* MAIN CARD */}
      <div className="card p-4">
        {/* PERSONAL INFO */}
        <div className="border rounded mb-4">
          <div className="card-section">
            Personal Information
          </div>

          <div className="grid grid-cols-3 gap-4 p-3">
            <p>
              <span className="text-gray-500">Full Name</span>
              <br />
              {state.fullName}
            </p>
            <p>
              <span className="text-gray-500">Admission No.</span>
              <br />
              {state.admissionNo}
            </p>
            <p>
              <span className="text-gray-500">Roll No.</span>
              <br />
              {state.rollNo || "-"}
            </p>

            <p>
              <span className="text-gray-500">Class</span>
              <br />
              {state.className}
            </p>
            <p>
              <span className="text-gray-500">Section</span>
              <br />
              {state.section}
            </p>
            <p>
              <span className="text-gray-500">Date of Birth</span>
              <br />
              {state.dob}
            </p>

            <p>
              <span className="text-gray-500">Age / Gender</span>
              <br />
              {state.age}Y / {state.gender}
            </p>
            <p>
              <span className="text-gray-500">School Date of Joining</span>
              <br />
              {state.schoolJoiningDate}
            </p>
            <p>
              <span className="text-gray-500">Caste</span>
              <br />
              {state.caste}
            </p>

            <p>
              <span className="text-gray-500">Religion</span>
              <br />
              {state.religion}
            </p>
            <p>
              <span className="text-gray-500">Blood Group</span>
              <br />
              {state.bloodGroup}
            </p>
            <p>
              <span className="text-gray-500">Aadhar no.</span>
              <br />
              {state.aadharNo}
            </p>

            <p>
              <span className="text-gray-500">Upload Aadhar</span>
              <br />
              <span className="text-blue-500 cursor-pointer">
                {state.aadharFileName || "N/A"}
              </span>
            </p>

            <p>
              <span className="text-gray-500">Upload Student Photo</span>
              <br />
              <span className="text-blue-500 cursor-pointer">
                {state.photoFileName || "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* PARENTS INFO */}
        <div className="border rounded mb-4">
          <div className="card-section border-t border-gray-200">
            Parents / Guardians Info
          </div>

          <div className="grid grid-cols-3 gap-4 p-3">
            <p>
              <span className="text-gray-500">Father / Guardian Name</span>
              <br />
              {state.fatherName}
            </p>
            <p>
              <span className="text-gray-500">
                Father / Guardian Occupation
              </span>
              <br />
              {state.fatherOccupation}
            </p>
            <p>
              <span className="text-gray-500">Mother Name</span>
              <br />
              {state.motherName}
            </p>

            <p>
              <span className="text-gray-500">Mother Occupation</span>
              <br />
              {state.motherOccupation}
            </p>
            <p>
              <span className="text-gray-500">Email</span>
              <br />
              {state.email}
            </p>
            <p>
              <span className="text-gray-500">Phone No.</span>
              <br />
              {state.phoneNo}
            </p>

            <p>
              <span className="text-gray-500">Alt Phone No.</span>
              <br />
              {state.altPhoneNo}
            </p>
          </div>
        </div>

        {/* MEDICAL */}
        <div className="border rounded mb-4">
          <div className="card-section border-t border-gray-200">
            Medical Details
          </div>

          <div className="p-3">
            <p>
              <span className="text-gray-500">Health Issues</span>
              <br />
              {state.healthIllness || "N/A"}
            </p>
          </div>
        </div>

        {/* PREVIOUS SCHOOL */}
        <div className="border rounded mb-4">
          <div className="card-section border-t border-gray-200">
            Previous School Details
          </div>

          <div className="grid grid-cols-2 gap-4 p-3">
            <p>
              <span className="text-gray-500">School Name</span>
              <br />
              {state.previousSchoolName}
            </p>
            <p>
              <span className="text-gray-500">Upload Transfer Certificate</span>
              <br />
              <span className="text-blue-500 cursor-pointer">
                {state.transferCertFileName || "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="border rounded">
          <div className="card-section border-t border-gray-200">
            Address
          </div>

          <div className="grid grid-cols-2 gap-4 p-3">
            <p>
              <span className="text-gray-500">Present Address</span>
              <br />
              {state.presentAddress}
            </p>

            <p>
              <span className="text-gray-500">Permanent Address</span>
              <br />
              {state.permanentAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentView;