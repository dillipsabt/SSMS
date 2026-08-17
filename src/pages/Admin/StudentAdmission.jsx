import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useToastMessage from "../../utils/useToastMessage";
import { toast } from "sonner";
import {
  addStudentAsync,
  updateStudentAsync,
  getStudentByIdAsync,
  getStudentsAsync,
  resetStudentState,
  getBloodGroupsAsync,
  getReligionsAsync,
  getCastsAsync,
  fetchClassesAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/student/studentSlice";
import { fetchBranchesAsync } from "../../features/Admin/Branch/branchSlice";
/* ================= INPUT ================= */
const Input = ({
  label,
  required,
  name,
  onChange,
  type = "text",
  value,
  disabled = false,
}) => (
  <div className="flex flex-col w-full min-w-0">
    <label className="form-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className="form-input"
    />
  </div>
);

const Select = ({ label, required, name, value, onChange, options, loading = false }) => (
  <div className="flex flex-col w-full min-w-0">
    <label className="form-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={loading}
      className="form-select"
    >
      <option value="">{loading ? "Loading..." : `Select ${label}`}</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

/* ================= FILE INPUT ================= */
const FileInput = ({ label, required, name, onChange }) => {
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "No file chosen");
    if (onChange) onChange(e);
  };

  return (
    <div className="flex flex-col w-full min-w-0">
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center border border-gray-300 rounded-md h-9 overflow-hidden bg-white">
        <input
          type="file"
          id={name}
          name={name}
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor={name}
          className="bg-brand-100 text-brand-600 px-3 text-[12px] h-full flex items-center cursor-pointer shrink-0 hover:bg-brand-50 transition-colors"
        >
          Choose
        </label>
        <span className="px-2 text-[12px] text-gray-500 truncate min-w-0 flex-1">
          {fileName}
        </span>
      </div>
    </div>
  );
};

/* ================= SECTION ================= */
const SectionCard = ({ title, children }) => (
  <div className="card mb-4">
    <div className="card-section">{title}</div>
    <div className="p-4">{children}</div>
  </div>
);

/* ================= MAIN ================= */
const StudentAdmission = () => {
  const [formData, setFormData] = useState({});
  const [sameAddress, setSameAddress] = useState(false);
  const [studentLoginEnabled, setStudentLoginEnabled] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    student,
    success,
    message,
    error,
    religions,
    castes,
    bloodGroups,
    classes,
  } = useSelector((state) => state.student);
  const { branches, loading: branchLoading } = useSelector((state) => state.branch);

  /* ---------- OPTIONS ---------- */
  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const titleOptions = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Ms", value: "Ms" },
    { label: "Dr", value: "Dr" },
  ];

  // API based
  const religionOptions = religions?.map((r) => ({
    label: r.name,
    value: String(r.id),
  }));

  const casteOptions = castes?.map((c) => ({
    label: c.categoryName,
    value: String(c.id),
  }));

  const bloodOptions = bloodGroups?.map((b) => ({
    label: b.groupName,
    value: String(b.id),
  }));
  const selectedClass = classes?.find(
    (c) => c?.className === student?.className,
  );

  const classOptions = classes?.map((c) => ({
    label: c.classCode,
    value: String(c.id),
  }));
  const branchOptions = branches?.map((branch) => ({
    label: branch.name,
    value: String(branch.id),
  }));

  useEffect(() => {
    if (!branches.length && !branchLoading) {
      dispatch(fetchBranchesAsync())
        .unwrap()
        .catch((error) => toast.error(error?.message || "Failed to fetch branches"));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getReligionsAsync());
    dispatch(getCastsAsync());
    dispatch(getBloodGroupsAsync());
    dispatch(fetchClassesAsync());
    if (id) {
      dispatch(getStudentByIdAsync(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (
      student &&
      id &&
      castes.length &&
      religions.length &&
      bloodGroups.length &&
      classes.length
    ) {
      const selectedCaste = castes.find(
        (c) => c.categoryName === student.caste,
      );

      const selectedReligion = religions.find(
        (r) => r.name === student.religion,
      );

      const selectedBlood = bloodGroups.find(
        (b) => b.groupName === student.bloodGroup,
      );

      setStudentLoginEnabled(Boolean(student.studentLoginEnabled));

      setFormData({
        fullName: student.fullName || "",
        email: student.email || "",
        parentPhoneNo: student.parentPhoneNo || "",
        studentPhoneNo: student.studentPhoneNo || "",
        title: student.title || "",
        classId: selectedClass ? String(selectedClass.id) : "",
        branchId: student.branchId ? String(student.branchId) : "",
        dob: student.dob || "",
        age: student.age || "",
        gender: student.gender || "",
        schoolJoiningDate: student.schoolJoiningDate || "",

        casteId: selectedCaste ? String(selectedCaste.id) : "",
        religionId: selectedReligion ? String(selectedReligion.id) : "",
        bloodGroupId: selectedBlood ? String(selectedBlood.id) : "",

        hobbies: student.hobbies || "",
        penNumber: student.penNumber || "",
        aadharNo: student.aadharNo || "",
        guardianName: student.guardianName || "",
        guardianOccupation: student.guardianOccupation || "",
        fatherName: student.fatherName || "",
        surname: student.surname || "",
        parentEmail: student.parentEmail || "",
        fatherOccupation: student.fatherOccupation || "",
        motherName: student.motherName || "",
        motherOccupation: student.motherOccupation || "",
        healthIllness: student.healthIllness || "",
        previousSchoolName: student.previousSchoolName || "",
        presentAddress: student.presentAddress || "",
        permanentAddress: student.permanentAddress || "",
      });

      if (student.presentAddress === student.permanentAddress) {
        setSameAddress(true);
      } else {
        setSameAddress(false);
      }
    }
  }, [student, castes, religions, bloodGroups, classes, id]);

  useEffect(() => {
    if (sameAddress) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: prev.presentAddress,
      }));
    }
  }, [formData.presentAddress, sameAddress]);

  const handleSameAddress = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);

    if (checked) {
      setFormData({
        ...formData,
        permanentAddress: formData.presentAddress || "",
      });
    } else {
      setFormData({
        ...formData,
        permanentAddress: "",
      });
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // DOB → Auto Age Calculate
    if (name === "dob") {
      const age = calculateAge(value);

      setFormData((prev) => ({
        ...prev,
        dob: value,
        age: age,
      }));

      return;
    }

    // Class → Auto Section Fill
    if (name === "classId") {
      const selectedClass = classes.find((c) => String(c.id) === value);

      setFormData((prev) => ({
        ...prev,
        classId: value,
      }));

      return;
    }

    // Normal Fields
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!formData.fullName) return toast.error("Full Name Required");
    if (!formData.classId) return toast.error("Class Required");
    if (!formData.branchId) return toast.error("Branch Required");
    if (!formData.dob) return toast.error("DOB Required");
    if (!formData.age) return toast.error("Age Required");
    if (!/^[0-9]+$/.test(formData.age))
      return toast.error("Age must be number");
    if (!formData.gender) return toast.error("Gender Required");
    if (!formData.schoolJoiningDate)
      return toast.error("Joining Date Required");
    if (!formData.penNumber) return toast.error("Pen Number Required");
    if (!formData.aadharNo) return toast.error("Aadhar Required");
    if (!/^[0-9]{12}$/.test(formData.aadharNo))
      return toast.error("Aadhar must be 12 digits");
    if (!formData.fatherName) return toast.error("Father Name Required");
    if (!formData.motherName) return toast.error("Mother Name Required");
    const userEmail = formData.parentEmail;
    if (!userEmail) return toast.error("Parent Email Required");
    if (!/\S+@\S+\.\S+/.test(userEmail))
      return toast.error("Invalid Email");
    if (!formData.parentPhoneNo) return toast.error("Parent Phone Required");
    if (!/^[0-9]{10}$/.test(formData.parentPhoneNo))
      return toast.error("Parent Phone must be 10 digit");
    if (!formData.presentAddress)
      return toast.error("Present Address Required");
    if (!formData.permanentAddress)
      return toast.error("Permanent Address Required");

    return true;
  };
  

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(resetStudentState());
  }, [dispatch]);

  useToastMessage({
    success,
    error,
    successMessage: message || (id ? "Student updated successfully" : "Student added successfully"),
    clearSuccess,
    clearError,
    onSuccess: () => {
      dispatch(getStudentsAsync());
      setTimeout(() => {
        navigate("/students_list");
      }, 500);
    },
  });

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (validate() !== true) return;

    try {
      const formDataObj = new FormData();
console.log("Form Data Before Submission:", formData);

      const dto = {
        fullName: formData.fullName,

        email: formData.email || "",
        studentLoginEnabled,

        parentPhoneNo: formData.parentPhoneNo || "",
        studentPhoneNo: formData.studentPhoneNo || "",

        title: formData.title || "",

        classId: Number(formData.classId),
        branchId: Number(formData.branchId),

        dob: formData.dob,

        age: Number(formData.age),

        gender: formData.gender,

        schoolJoiningDate: formData.schoolJoiningDate,

        casteId: formData.casteId ? Number(formData.casteId) : null,

        religionId: formData.religionId ? Number(formData.religionId) : null,

        bloodGroupId: formData.bloodGroupId
          ? Number(formData.bloodGroupId)
          : null,

        hobbies: formData.hobbies || "",
        penNumber: formData.penNumber || "",

        aadharNo: formData.aadharNo,

        guardianName: formData.guardianName || "",
        guardianOccupation: formData.guardianOccupation || "",

        fatherName: formData.fatherName,
        surname: formData.surname,
        parentEmail: formData.parentEmail || "",
        fatherOccupation: formData.fatherOccupation || "",

        motherName: formData.motherName,
        motherOccupation: formData.motherOccupation || "",

        healthIllness: formData.healthIllness || "",

        previousSchoolName: formData.previousSchoolName || "",

        presentAddress: formData.presentAddress,

        permanentAddress: formData.permanentAddress,
      };

      console.log("Submitting DTO:", dto);

      formDataObj.append(
        "dto",
        new Blob([JSON.stringify(dto)], {
          type: "application/json",
        }),
      );

      if (formData.aadharFile) {
        formDataObj.append("aadharFile", formData.aadharFile);
      }

      if (formData.studentPhoto) {
        formDataObj.append("photoFile", formData.studentPhoto);
      }

      if (formData.tcFile) {
        formDataObj.append("transferCertFile", formData.tcFile);
      }

      // for (let pair of formDataObj.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      if (id) {
        await dispatch(
          updateStudentAsync({ id, formData: formDataObj }),
        ).unwrap();
        toast.success("Student Updated Successfully ✅");
      } else {
        await dispatch(addStudentAsync(formDataObj)).unwrap();
        toast.success("Student Added Successfully ✅");
      }
    } catch (err) {
      toast.error(err?.message || "Operation Failed ❌");
    }
  };

  return (
    <div>
      <h1 className="text-[18px] font-semibold mb-4 text-[#333333]">
        {id ? "Edit Student" : "Student Admission"}
      </h1>

      {/* BASIC */}
      <SectionCard title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Select
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            options={titleOptions}
          />

          <Input
            label="Full Name"
            required
            name="fullName"
            onChange={handleChange}
            value={formData.fullName}
          />

          <Select
            label="Class"
            required
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            options={classOptions}
          />

          <Select
            label="Branch"
            required
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
            options={branchOptions}
            loading={branchLoading}
          />

          <Input
            label="DOB"
            required
            type="date"
            name="dob"
            onChange={handleChange}
            value={formData.dob}
          />

          <Input
            label="Age"
            required
            name="age"
            value={formData.age}
            disabled
          />

          <div className="col-span-full flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-100">
            <input
              type="checkbox"
              aria-label="Enable student login"
              checked={studentLoginEnabled}
              onChange={(event) => setStudentLoginEnabled(event.target.checked)}
              className="h-5 w-5 rounded border-2 border-indigo-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            />
            <span>Enable student login</span>
          </div>

          {studentLoginEnabled && (
            <>
              <Input
                label="Student Email"
                name="email"
                onChange={handleChange}
                value={formData.email}
              />

              <Input
                label="Phone Number"
                name="studentPhoneNo"
                value={formData.studentPhoneNo}
                onChange={handleChange}
              />
            </>
          )}

          <Select
            label="Gender"
            required
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
          />

          <Input
            label="Joining Date"
            required
            type="date"
            name="schoolJoiningDate"
            onChange={handleChange}
            value={formData.schoolJoiningDate}
          />

          <Select
            label="Caste"
            name="casteId"
            value={formData.casteId}
            onChange={handleChange}
            options={casteOptions}
          />

          <Select
            label="Religion"
            name="religionId"
            value={formData.religionId}
            onChange={handleChange}
            options={religionOptions}
          />

          <Select
            label="Blood Group"
            name="bloodGroupId"
            value={formData.bloodGroupId}
            onChange={handleChange}
            options={bloodOptions}
          />
          <Input
            label="Hobbies"
            name="hobbies"
            onChange={handleChange}
            value={formData.hobbies}
          />
          <Input
            label="Aadhar"
            required
            name="aadharNo"
            onChange={handleChange}
            value={formData.aadharNo}
          />
          <Input
            label="Pen"
            required
            name="penNumber"
            onChange={handleChange}
            value={formData.penNumber}
          />
          <FileInput
            label="Upload Aadhar"
            name="aadharFile"
            onChange={handleChange}
          />
          <FileInput
            label="Upload Photo"
            name="studentPhoto"
            onChange={handleChange}
          />
        </div>
      </SectionCard>

      {/* PARENT */}
      <SectionCard title="Parent Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input
            label="Father Name"
            required
            name="fatherName"
            onChange={handleChange}
            value={formData.fatherName}
          />
          <Input
            label="Father surname"
            name="surname"
            onChange={handleChange}
            value={formData.surname}
          />
          <Input
            label="Father Occupation"
            name="fatherOccupation"
            onChange={handleChange}
            value={formData.fatherOccupation}
          />
          <Input
            label="Mother Name"
            required
            name="motherName"
            onChange={handleChange}
            value={formData.motherName}
          />
          <Input
            label="Mother Occupation"
            name="motherOccupation"
            onChange={handleChange}
            value={formData.motherOccupation}
          />
          <Input
            label="Guardian Name"
            name="guardianName"
            onChange={handleChange}
            value={formData.guardianName}
          />
          <Input
            label="Guardian Occupation"
            name="guardianOccupation"
            onChange={handleChange}
            value={formData.guardianOccupation}
          />
          <Input
            label="ParentEmail"
            required
            name="parentEmail"
            onChange={handleChange}
            value={formData.parentEmail}
          />
          <Input
            label="Phone Number"
            required
            name="parentPhoneNo"
            onChange={handleChange}
            value={formData.parentPhoneNo}
          />
        </div>
      </SectionCard>

      {/* MEDICAL */}
      <SectionCard title="Medical Details">
        <textarea
          name="healthIllness"
          rows="3"
          value={formData.healthIllness || ""}
          onChange={handleChange}
          className="form-textarea"
        />
      </SectionCard>

      {/* SCHOOL */}
      <SectionCard title="Previous School">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          <Input
            label="School Name"
            name="previousSchoolName"
            onChange={handleChange}
            value={formData.previousSchoolName}
          />
          <FileInput
            label="Transfer Certificate"
            name="tcFile"
            onChange={handleChange}
          />
        </div>
      </SectionCard>

      {/* ADDRESS */}
      <SectionCard title="Address">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {/* Present */}
          <div>
            <div className="flex items-center justify-between">
              <label className="form-label">
                Present Address <span className="text-red-500">*</span>
              </label>

              <label className="flex items-center gap-1 text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={handleSameAddress}
                />
                Same as Present
              </label>
            </div>

            <textarea
              name="presentAddress"
              rows="3"
              value={formData.presentAddress || ""}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          {!sameAddress && (
            <div>
              <label className="form-label">
                Permanent Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="permanentAddress"
                rows="3"
                value={formData.permanentAddress || ""}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/students_list")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary"
          >
            {id ? "✏️ Update" : "💾 Save"}
          </button>
        </div>
    </div>
  );
};

export default StudentAdmission;
