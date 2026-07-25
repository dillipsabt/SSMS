import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addStaffAsync,
  getStaffByIdAsync,
  updateStaffAsync,
  resetStaffState,
  getReligionsAsync,
  getBloodGroupsAsync,
  getDepartmentsAsync,
} from "../../features/Admin/Staff/staffSlice";
import { fetchBranchesAsync } from "../../features/Admin/Branch/branchSlice";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
 
/* ---------- INPUT COMPONENT ---------- */
const Input = ({ label, required, name, onChange, value, type = "text" }) => (
  <div>
    <label className="form-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="form-input mt-1"
    />
  </div>
);
 
/* ---------- SELECT ---------- */
const Select = ({ label, required, name, onChange, value, options = [], loading = false }) => (
  <div>
    <label className="form-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={loading}
      className="form-select mt-1"
    >
      <option value="">{loading ? "Loading..." : "Select"}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
 
/* ---------- FILE INPUT ---------- */
const FileInput = ({ label, name, onChange }) => {
  const [fileName, setFileName] = useState("No file chosen");
 
  const handleFile = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "No file chosen");
    onChange(e);
  };
 
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-md mt-1 h-9 overflow-hidden bg-white">
        <input
          type="file"
          name={name}
          onChange={handleFile}
          className="hidden"
          id={name}
        />
        <label
          htmlFor={name}
          className="bg-brand-100 text-brand-600 px-3 text-[12px] h-full flex items-center cursor-pointer shrink-0 hover:bg-brand-50 transition-colors"
        >
          Choose File
        </label>
        <span className="text-gray-400 text-[12px] px-2 truncate">
          {fileName}
        </span>
      </div>
    </div>
  );
};
 
export default function AddStaff() {
  const [form, setForm] = useState({});
  const [experience, setExperience] = useState([
    { id: null, companyName: "", years: "", startDate: "", endDate: "" },
  ]);
  const [licenseDetails, setLicenseDetails] = useState({
    licenseNumber: "",
    licenseExpiryDate: "",
    licenseFile: null,
  });
  const [sameAddress, setSameAddress] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
 
  const { singleStaff, religions, bloodGroups, departments, message, error } =
    useSelector((state) => state.staff);
  const { branches, loading: branchLoading } = useSelector((state) => state.branch);

  /* ---------- OPTIONS ---------- */
  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];
 
  const titleOptions = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Miss", value: "Miss" },
    { label: "Ms", value: "Ms" },
    { label: "Dr", value: "Dr" },
  ];
 
  const maritalOptions = [
    { label: "Single", value: "Single" },
    { label: "Married", value: "Married" },
  ];
 
  const shiftOptions = [
    { label: "General", value: "General" },
    { label: "Morning", value: "Morning" },
    { label: "Evening", value: "Evening" },
  ];
 
  const contractOptions = [
    { value: "Full Time", label: "Full Time" },
    { value: "Part Time", label: "Part Time" },
  ];
 
  const religionOptions = Array.isArray(religions)
    ? religions.map((r) => ({
        label: r.name,
        value: r.id,
      }))
    : [];
 
  const bloodOptions = Array.isArray(bloodGroups)
    ? bloodGroups.map((b) => ({
        label: b.groupName,
        value: String(b.id),
      }))
    : [];
 
  const departmentOptions = Array.isArray(departments)
    ? departments.map((d) => ({
        label: d.name,
        value: String(d.id),
      }))
    : [];

  const branchOptions = Array.isArray(branches)
    ? branches.map((branch) => ({
        label: branch.name,
        value: String(branch.id),
      }))
    : [];

  useEffect(() => {
    if (!branches.length && !branchLoading) {
      dispatch(fetchBranchesAsync())
        .unwrap()
        .catch((error) => toast.error(error?.message || "Failed to fetch branches"));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getReligionsAsync());
    dispatch(getBloodGroupsAsync());
    dispatch(getDepartmentsAsync());
 
    if (id) {
      dispatch(getStaffByIdAsync(id));
    }
  }, [id, dispatch]);
 
  useEffect(() => {
    if (
      singleStaff &&
      religions.length &&
      bloodGroups.length &&
      departments.length
    ) {
      // const findReligionId = religions.find(
      //   (r) =>
      //     r.name === singleStaff.religion || r.id === singleStaff.religionId,
      // )?.id;
 
      // const findBloodId = bloodGroups.find(
      //   (b) =>
      //     b.groupName === singleStaff.bloodGroup ||
      //     b.id === singleStaff.bloodGroupId,
      // )?.id;
 
      // const findDepartmentId = departments.find(
      //   (d) =>
      //     d.name === singleStaff.department ||
      //     d.id === singleStaff.departmentId,
      // )?.id;
      const findDepartmentId = departments.find(
        (d) =>
          d.name === singleStaff.departmentName ||
          d.id === singleStaff.departmentId,
      )?.id;
      const findReligionId = religions.find(
        (r) =>
          r.name === singleStaff.religionName ||
          r.id === singleStaff.religionId,
      )?.id;
      const findBloodId = bloodGroups.find(
        (b) =>
          b.groupName === singleStaff.bloodGroupName ||
          b.id === singleStaff.bloodGroupId,
      )?.id;
 
      setForm({
        fullName: singleStaff.fullName || "",
        email: singleStaff.email || "",
        phone: singleStaff.phoneNumber || singleStaff.phoneNo || "",
        departmentId: findDepartmentId || "",
        branchId: singleStaff.branchId ? String(singleStaff.branchId) : "",
        designation: singleStaff.designation || "",
        title: singleStaff.title || "",
        gender: singleStaff.gender || "",
        religionId: findReligionId || "",
        bloodGroupId: findBloodId || "",
        dob: singleStaff.dob?.split("T")[0] || "",
        joinDate: singleStaff.joinDate?.split("T")[0] || "",
        fatherName: singleStaff.fathersName || singleStaff.fatherName || "",
        motherName: singleStaff.mothersName || singleStaff.motherName || "",
        maritalStatus: singleStaff.maritalStatus || "",
        contractType: singleStaff.contractType || "",
        shift: singleStaff.shift || "",
        worklocation:
          singleStaff.workLocation || singleStaff.worklocation || "",
        experience: singleStaff.totalYearsExperience || "",
        qualification: singleStaff.qualification || "",
        aadhar: singleStaff.aadharNo || singleStaff.aadharNumber || "",
        pan: singleStaff.panNo || "",
        altPhone: singleStaff.altPhoneNo || "",
        bankAccountNumber: singleStaff.bankAccountNumber || "",
        bankName: singleStaff.bankName || "",
        ifscCode: singleStaff.ifscCode || "",
        branchName: singleStaff.branchName || "",
        pfNumber: singleStaff.pfNumber || "",
        presentAddress: singleStaff.presentAddress || "",
        permanentAddress: singleStaff.permanentAddress || "",
      });

      if (singleStaff.licenseDetails) {
        setLicenseDetails({
          licenseNumber: singleStaff.licenseDetails.licenseNumber || "",
          licenseExpiryDate: singleStaff.licenseDetails.licenseExpiryDate?.split("T")[0] || "",
          licenseFile: null,
        });
      }
 
      if (
        singleStaff.presentAddress &&
        singleStaff.presentAddress === singleStaff.permanentAddress
      ) {
        setSameAddress(true);
      }
 
      if (singleStaff.workExperiences?.length) {
        setExperience(
          singleStaff.workExperiences.map((exp) => ({
            id: exp.id || null,
            companyName: exp.companyName || "",
            startDate: (exp.fromDate || exp.startDate)?.split("T")[0] || "",
            endDate: (exp.toDate || exp.endDate)?.split("T")[0] || "",
            years: exp.yearsOfExperience || exp.years || "",
          })),
        );
      }
    }
  }, [singleStaff, religions, bloodGroups, departments]);
 
  const handleSameAddress = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);
 
    setForm((prev) => ({
      ...prev,
      permanentAddress: checked ? prev.presentAddress || "" : "",
    }));
  };
 
  const handleChange = (e) => {
    const { name, value, files } = e.target;
 
    const inputValue = ["bloodGroupId", "religionId", "departmentId", "branchId"].includes(
      name,
    )
      ? Number(value)
      : files
        ? files[0]
        : value;
 
    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: inputValue,
      };
 
      if (sameAddress && name === "presentAddress") {
        updatedForm.permanentAddress = inputValue;
      }
 
      return updatedForm;
    });
  };
 
  /* ---------- EXPERIENCE CHANGE ---------- */
  const handleExpChange = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };
 
  /* ---------- VALIDATION ---------- */
  const validate = () => {
    if (!form.fullName) {
      toast.error("Full Name Required");
      return false;
    }
    if (!form.branchId) {
      toast.error("Branch Required");
      return false;
    }
    if (!form.gender) {
      toast.error("Gender Required");
      return false;
    }
    if (!form.phone) {
      toast.error("Phone Required");
      return false;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Phone must be 10 digits");
      return false;
    }
    if (!form.email) {
      toast.error("Email Required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Invalid Email");
      return false;
    }
    if (!form.aadhar) {
      toast.error("Aadhar Required");
      return false;
    }
    if (!/^[0-9]{12}$/.test(form.aadhar)) {
      toast.error("Aadhar must be 12 digits");
      return false;
    }
    return true;
  };
 
  // Clear stale messages on mount
  useEffect(() => {
    dispatch(resetStaffState());
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      dispatch(resetStaffState());
    }
  }, [message, error, dispatch]);
 
  /* ---------- SUBMIT WITH API ---------- */
  const handleSubmit = async () => {
    if (!validate()) return;
 
    try {
      const formData = new FormData();
      const finalPermanentAddress = sameAddress
        ? form.presentAddress
        : form.permanentAddress;
 
      const dto = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phone,
        title: form.title,
        gender: form.gender,
        dob: form.dob,
        fathersName: form.fatherName,
        mothersName: form.motherName,
        maritalStatus: form.maritalStatus,
        contractType: form.contractType,
        shift: form.shift,
        workLocation: form.worklocation,
        joinDate: form.joinDate,
        totalYearsExperience: Number(form.experience) || 0,
        qualification: form.qualification,
        departmentId: Number(form.departmentId),
        branchId: Number(form.branchId),
        designation: form.designation,
        religionId: Number(form.religionId),
        bloodGroupId: Number(form.bloodGroupId),
        panNo: form.pan,
        aadharNo: form.aadhar,
        bankAccountNumber: form.bankAccountNumber,
        bankName: form.bankName,
        ifscCode: form.ifscCode,
        branchName: form.branchName,
        pfNumber: form.pfNumber,
        presentAddress: form.presentAddress,
        permanentAddress: finalPermanentAddress,
        altPhoneNo: form.altPhone,
 
        // CLEAN STRUCTURAL TRANSFORMATION FOR NESTED EXPERIENCE DTOs
        workExperiences: experience.map((e) => {
          const expItem = {
            companyName: e.companyName,
            fromDate: e.startDate,
            toDate: e.endDate,
            yearsOfExperience: Number(e.years) || 0,
          };
          if (id && e.id) {
            expItem.id = Number(e.id);
          }
          return expItem;
        }),
      };

      // Add license details if driver
      const selectedDept = departments.find(d => d.id === Number(form.departmentId));
      if (selectedDept && selectedDept.name?.toLowerCase() === "driver") {
        dto.licenseDetails = {
          licenseNumber: licenseDetails.licenseNumber,
          licenseExpiryDate: licenseDetails.licenseExpiryDate,
        };
      }
 
      if (id) {
        dto.id = Number(id);
      }
 
      formData.append("dto", JSON.stringify(dto));

      if (form.aadharFile) formData.append("aadharFile", form.aadharFile);
      if (form.photoFile) formData.append("photoFile", form.photoFile);
      if (licenseDetails.licenseFile) formData.append("licenseFile", licenseDetails.licenseFile);
 
      let res;
      if (id) {
        res = await dispatch(
          updateStaffAsync({
            id,
            data: formData,
          }),
        ).unwrap();
        toast.success(res?.message || "Staff Updated Successfully");
      } else {
        res = await dispatch(addStaffAsync(formData)).unwrap();
        toast.success(res?.message || "Staff Added Successfully");
 
        // ---------- THE FIX: RESET FORM DATA AFTER SUCCESSFUL CREATION ----------
        setForm({});
        setExperience([
          { id: null, companyName: "", years: "", startDate: "", endDate: "" },
        ]);
        setLicenseDetails({
          licenseNumber: "",
          licenseExpiryDate: "",
          licenseFile: null,
        });
        setSameAddress(false);
      }
 
      setTimeout(() => {
        navigate("/staff_list");
      }, 800);
    } catch (err) {
      toast.error(err?.message || err || "Operation Failed");
    }
  };
 
  const addRow = () => {
    setExperience([
      ...experience,
      {
        id: null,
        companyName: "",
        years: "",
        startDate: "",
        endDate: "",
        file: null,
      },
    ]);
  };
 
  const deleteRow = (index) => {
    if (experience.length === 1) {
      toast.error("At least one row required");
      return;
    }
    setExperience(experience.filter((_, i) => i !== index));
  };

  /* ---------- LICENSE DETAILS CHANGE ---------- */
  const handleLicenseChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "licenseFile") {
      setLicenseDetails((prev) => ({
        ...prev,
        licenseFile: files[0] || null,
      }));
    } else {
      setLicenseDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
 
  return (
    <div>
      {/* HEADER */}
      <h2 className="text-[18px] font-semibold text-[#333333]">
        {id ? "Edit Staff" : "Add New Staff"}
      </h2>
      <p className="text-[12px] text-gray-500 mb-4">
        Staff / {id ? "Edit Staff" : "Add New Staff"}
      </p>
 
      <div className="card">
        {/* BASIC INFO */}
        <div className="card-section">Basic Information</div>
 
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            name="title"
            label="Title"
            value={form.title}
            options={titleOptions}
            onChange={handleChange}
          />
          <Input
            label="Full Name"
            required
            name="fullName"
            value={form.fullName || ""}
            onChange={handleChange}
          />
 
          <Select
            name="departmentId"
            label="Department"
            required
            value={String(form.departmentId || "")}
            options={departmentOptions}
            onChange={handleChange}
          />

          <Select
            name="branchId"
            label="Branch"
            required
            value={form.branchId}
            options={branchOptions}
            onChange={handleChange}
            loading={branchLoading}
          />

          <Input
            label="Designation"
            required
            name="designation"
            value={form.designation || ""}
            onChange={handleChange}
          />
          <Select
            name="gender"
            label="Gender"
            value={form.gender}
            options={genderOptions}
            onChange={handleChange}
          />
          <Input
            label="Date of Birth"
            type="date"
            required
            name="dob"
            value={form.dob || ""}
            onChange={handleChange}
          />
 
          <Input
            label="Father's Name"
            required
            name="fatherName"
            value={form.fatherName || ""}
            onChange={handleChange}
          />
          <Input
            label="Mother's Name"
            required
            name="motherName"
            value={form.motherName || ""}
            onChange={handleChange}
          />
          <Select
            name="maritalStatus"
            label="Marital Status"
            required
            value={form.maritalStatus || ""}
            options={maritalOptions}
            onChange={handleChange}
          />
 
          <Select
            name="contractType"
            label="Contract Type"
            required
            value={form.contractType || ""}
            options={contractOptions}
            onChange={handleChange}
          />
 
          <Select
            name="shift"
            label="Shift"
            required
            value={form.shift || ""}
            options={shiftOptions}
            onChange={handleChange}
          />
          <Input
            label="Work Location"
            name="worklocation"
            value={form.worklocation || ""}
            onChange={handleChange}
          />
 
          <Input
            label="Join Date"
            type="date"
            required
            name="joinDate"
            value={form.joinDate || ""}
            onChange={handleChange}
          />
          <Input
            label="Phone No"
            required
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
          />
          <Input
            label="Alt Phone No"
            name="altPhone"
            value={form.altPhone || ""}
            onChange={handleChange}
          />
 
          <Input
            label="Email Id"
            required
            name="email"
            value={form.email || ""}
            onChange={handleChange}
          />
          <Input
            label="Total Years of Experience"
            name="experience"
            value={form.experience || ""}
            onChange={handleChange}
          />
          <Input
            label="Qualification"
            name="qualification"
            value={form.qualification || ""}
            onChange={handleChange}
          />
 
          <Select
            name="religionId"
            label="Religion"
            required
            value={form.religionId || ""}
            options={religionOptions}
            onChange={handleChange}
          />
          <Select
            name="bloodGroupId"
            label="Blood Group"
            required
            value={String(form.bloodGroupId || "")}
            options={bloodOptions}
            onChange={handleChange}
          />
          <Input
            label="Pan No"
            name="pan"
            value={form.pan || ""}
            onChange={handleChange}
          />
 
          <Input
            label="Aadhar No"
            required
            name="aadhar"
            value={form.aadhar || ""}
            onChange={handleChange}
          />
          <FileInput
            label="Upload Aadhar"
            name="aadharFile"
            onChange={handleChange}
          />
          <FileInput
            label="Upload Profile Photo"
            name="photoFile"
            onChange={handleChange}
          />
        </div>
 
        {/* WORK EXPERIENCE */}
        <div className="card-section border-t border-gray-200">
          Work Experience Details
        </div>
 
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-[12px] border border-gray-200 rounded min-w-[800px] border-collapse">
            <thead>
              <tr className="thead-row">
                <th className="border border-gray-200 px-3 py-2 text-left">
                  S.No
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Company Name
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Years
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  From
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  To
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Upload
                </th>
                <th className="border border-gray-200 px-3 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
 
            <tbody>
              {experience.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="border border-gray-200 px-3 py-2 text-center w-10">
                    {i + 1}
                  </td>
 
                  <td className="border border-gray-200 px-2 py-1">
                    <input
                      value={row.companyName || ""}
                      className="table-input"
                      placeholder="Company name"
                      onChange={(e) =>
                        handleExpChange(i, "companyName", e.target.value)
                      }
                    />
                  </td>
                  <td className="border border-gray-200 px-2 py-1 w-20">
                    <input
                      value={row.years || ""}
                      className="table-input"
                      placeholder="Years"
                      onChange={(e) =>
                        handleExpChange(i, "years", e.target.value)
                      }
                    />
                  </td>
                  <td className="border border-gray-200 px-2 py-1 w-36">
                    <input
                      type="date"
                      value={row.startDate || ""}
                      className="table-input"
                      onChange={(e) =>
                        handleExpChange(i, "startDate", e.target.value)
                      }
                    />
                  </td>
                  <td className="border border-gray-200 px-2 py-1 w-36">
                    <input
                      type="date"
                      value={row.endDate || ""}
                      className="table-input"
                      onChange={(e) =>
                        handleExpChange(i, "endDate", e.target.value)
                      }
                    />
                  </td>
 
                  <td className="border border-gray-200 px-2 py-1 text-center">
                    <label className="text-brand-600 text-[11px] cursor-pointer hover:text-brand-700 transition-colors font-medium">
                      Choose File
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleExpChange(i, "file", e.target.files[0])
                        }
                      />
                    </label>
                  </td>
 
                  <td className="border border-gray-200 px-2 py-1">
                    <div className="flex justify-center items-center gap-2">
                      {i === experience.length - 1 && (
                        <button
                          type="button"
                          title="Add row"
                          onClick={addRow}
                          className="p-1 rounded hover:bg-brand-100 text-brand-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Delete row"
                        onClick={() => deleteRow(i)}
                        className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LICENSE DETAILS - SHOWN ONLY FOR DRIVER DEPARTMENT */}
        {(() => {
          const selectedDept = departments.find(d => d.id === Number(form.departmentId));
          return selectedDept && selectedDept.name?.toLowerCase() === "driver" ? (
            <>
              <div className="card-section border-t border-gray-200">
                License Details
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="License Number"
                  required
                  name="licenseNumber"
                  value={licenseDetails.licenseNumber || ""}
                  onChange={handleLicenseChange}
                />
                <Input
                  label="License Expiry Date"
                  type="date"
                  required
                  name="licenseExpiryDate"
                  value={licenseDetails.licenseExpiryDate || ""}
                  onChange={handleLicenseChange}
                />
                <div>
                  <label className="form-label">Upload License</label>
                  <div className="flex items-center border border-gray-300 rounded-md mt-1 h-9 overflow-hidden bg-white">
                    <input
                      type="file"
                      name="licenseFile"
                      onChange={handleLicenseChange}
                      className="hidden"
                      id="licenseFile"
                    />
                    <label
                      htmlFor="licenseFile"
                      className="bg-brand-100 text-brand-600 px-3 text-[12px] h-full flex items-center cursor-pointer shrink-0 hover:bg-brand-50 transition-colors"
                    >
                      Choose File
                    </label>
                    <span className="text-gray-400 text-[12px] px-2 truncate">
                      {licenseDetails.licenseFile?.name || "No choose file"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : null;
        })()}

        {/* BANK DETAILS */}
        <div className="card-section border-t border-gray-200">
          Bank Details
        </div>
 
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Bank Account Number"
            name="bankAccountNumber"
            value={form.bankAccountNumber || ""}
            onChange={handleChange}
          />
          <Input
            label="Bank Name"
            name="bankName"
            value={form.bankName || ""}
            onChange={handleChange}
          />
          <Input
            label="IFSC Code"
            name="ifscCode"
            value={form.ifscCode || ""}
            onChange={handleChange}
          />
          <Input
            label="Branch Name"
            name="branchName"
            value={form.branchName || ""}
            onChange={handleChange}
          />
          <Input
            label="PF Number"
            name="pfNumber"
            value={form.pfNumber || ""}
            onChange={handleChange}
          />
        </div>
 
        {/* ADDRESS */}
        <div className="card-section border-t border-gray-200">Address</div>
 
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="form-label">Present Address</label>
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
              value={form.presentAddress || ""}
              onChange={handleChange}
              placeholder="Enter present address"
              rows={3}
              className="form-textarea mt-1"
            />
          </div>
 
          {!sameAddress && (
            <div>
              <label className="form-label">Permanent Address</label>
              <textarea
                name="permanentAddress"
                value={form.permanentAddress || ""}
                onChange={handleChange}
                placeholder="Enter permanent address"
                rows={3}
                className="form-textarea mt-1"
              />
            </div>
          )}
        </div>
 
        {/* SAVE */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/staff_list")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="btn-primary">
            {id ? "✏️ Update" : "💾 Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
