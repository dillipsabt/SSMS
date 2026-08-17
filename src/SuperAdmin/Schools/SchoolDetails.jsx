import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock3, Save } from "lucide-react";
import UploadSchoolLogoModal from "./UploadSchoolLogoModal";
import {
  clearError,
  clearSuccess,
  clearUploadState,
  createSuperAdminSchoolAsync,
  updateSuperAdminSchoolAsync,
  uploadSchoolLogoAsync,
} from "../../features/SuperAdmin/Schools/superAdminSchoolSlice";
import {
  clearCities,
  clearStates,
  fetchSuperAdminCitiesAsync,
  fetchSuperAdminCountriesAsync,
  fetchSuperAdminStatesAsync,
} from "../../features/SuperAdmin/Location/superAdminLocationSlice";
import useToastMessage from "../../utils/useToastMessage";

const selectOptions = {
  tenantStatus: [ "TRIAL", "ACTIVE", "INACTIVE", "SUSPENDED", "EXPIRED"],
  subscriptionPlan: ["BASIC", "STANDARD", "PREMIUM", "ENTERPRISE"],
  billingCycle: ["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY"],
  paymentGatewayType: ["Razorpay", "Stripe"],
};

const sections = [
  [
    "School Information",
    [
      ["School Name", "schoolName"],
      ["School Code", "schoolCode"],
      ["Branch Name", "branchName"],
      ["School Types", "schoolType"],
      ["School Website", "website"],
      ["Number of Students", "numberOfStudents", "number"],
      ["Number of Teachers", "numberOfTeachers", "number"],
    ],
  ],
  [
    "Contact Information",
    [
      ["Contact Person Name", "contactPersonName"],
      ["Designation", "designation"],
      ["Phone No", "phoneNumber", "tel"],
      ["Alternate Phone No", "alternatePhoneNumber", "tel"],
      ["Email id", "email", "email"],
      ["Alternate Email", "alternateEmail", "email"],
    ],
  ],
  [
    "Address",
    [
      ["Address", "address"],
      ["Country", "countryId", "select"],
      ["State", "stateId", "select"],
      ["City", "cityId", "select"],
      ["Pin code", "pinCode"],
    ],
  ],
  [
    "Tenant Details",
    [
      ["Sub Domain Name", "subdomain"],
      ["Tenant Status", "tenantStatus", "select"],
      ["Trial Start Date", "trialStartDate", "date"],
      ["Trial End Date", "trialEndDate", "date"],
    ],
  ],
  [
    "Subscription Details",
    [
      ["Subscription Plan", "subscriptionPlan", "select"],
      ["Billing Cycle", "billingCycle", "select"],
      ["Subscription Start Date", "subscriptionStartDate", "date"],
      ["Expiry Date", "expiryDate", "date"],
    ],
  ],
  // [
  //   "Biometric Integration",
  //   [
  //     ["Enable Biometric", "biometricEnabled", "toggle"],
  //     ["Biometric Vendor", "biometricVendor", "select"],
  //     ["Device Name", "deviceName"],
  //     ["Device Serial Number", "deviceSerialNumber"],
  //   ],
  // ],
];

const emptyForm = {
  schoolName: "",
  schoolCode: "",
  branchName: "",
  schoolType: "",
  website: "",
  numberOfStudents: "",
  numberOfTeachers: "",
  contactPersonName: "",
  designation: "",
  phoneNumber: "",
  alternatePhoneNumber: "",
  email: "",
  alternateEmail: "",
  address: "",
  countryId: "",
  stateId: "",
  cityId: "",
  pinCode: "",
  subdomain: "",
  tenantStatus: "",
  trialStartDate: "",
  trialEndDate: "",
  subscriptionPlan: "",
  billingCycle: "",
  subscriptionStartDate: "",
  expiryDate: "",
  onlinePaymentEnabled: false,
  paymentGatewayType: "",
  academicYear: "",
  timeZone: "",
  curriculum: "",
  twoFactorAuthentication: false,
};

function Field({ label, name, type = "text", value, onChange, options, disabled = false }) {
  if (type === "toggle") {
    return <Toggle label={label} name={name} checked={Boolean(value)} onChange={onChange} />;
  }

  if (type === "select") {
    return (
      <label className="sa-field">
        <span>{label}</span>
        <select name={name} value={value ?? ""} onChange={onChange} disabled={disabled}>
          <option value="">Select</option>
          {(options || selectOptions[name] || []).map((option) => {
            const optionValue = typeof option === "object" ? option.id ?? option.value : option;
            const optionLabel = typeof option === "object" ? option.name ?? option.label : option;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      </label>
    );
  }

  return (
    <label className="sa-field">
      <span>{label}</span>
      <div className={name === "timeZone" ? "sa-date" : ""}>
        <input
          name={name}
          type={type}
          placeholder={type === "date" ? "dd/mm/yyyy" : undefined}
          value={value ?? ""}
          onChange={onChange}
        />
        {name === "timeZone" && <Clock3 size={20} />}
      </div>
    </label>
  );
}

function Toggle({ label, name, checked, onChange }) {
  return (
    <label className="sa-toggle-field">
      <span>{label}</span>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <i />
    </label>
  );
}

export default function SchoolDetails() {
  const { state } = useLocation();
  const school = state?.school;
  const [form, setForm] = useState(() => ({ ...emptyForm, ...(school || {}) }));
  const [schoolIdForLogo, setSchoolIdForLogo] = useState(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { countries, states, cities } = useSelector((state) => state.superAdminLocation);
  const {
    loading,
    success,
    error,
    successMessage,
    uploadLoading,
    uploadSuccess,
    uploadError,
  } = useSelector((state) => state.superAdminSchools);

  useEffect(() => {
    dispatch(fetchSuperAdminCountriesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (!school?.countryId) return;

    dispatch(fetchSuperAdminStatesAsync(school.countryId)).then(() => {
      if (school.stateId) {
        dispatch(fetchSuperAdminCitiesAsync(school.stateId));
      }
    });
  }, [dispatch, school?.countryId, school?.stateId]);

  useToastMessage({
    success,
    error,
    successMessage,
    clearSuccess,
    clearError,
  });

  useToastMessage({
    success: uploadSuccess,
    error: uploadError,
    successMessage: "School logo uploaded successfully",
    clearSuccess: clearUploadState,
    clearError: clearUploadState,
    onSuccess: () => {
      setIsLogoModalOpen(false);
      navigate("/school-details/lists", { replace: true });
    },
  });

  const onChange = ({ target: { name, value, type, checked, files } }) => {
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));

    if (name === "countryId") {
      dispatch(clearStates());
      dispatch(clearCities());
      setForm((current) => ({ ...current, stateId: "", cityId: "" }));
      if (value) dispatch(fetchSuperAdminStatesAsync(value));
    }

    if (name === "stateId") {
      dispatch(clearCities());
      setForm((current) => ({ ...current, cityId: "" }));
      if (value) dispatch(fetchSuperAdminCitiesAsync(value));
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      numberOfStudents: Number(form.numberOfStudents) || 0,
      numberOfTeachers: Number(form.numberOfTeachers) || 0,
      countryId: form.countryId ? Number(form.countryId) : null,
      stateId: form.stateId ? Number(form.stateId) : null,
      cityId: form.cityId ? Number(form.cityId) : null,
    };
    const id = school?.id ?? school?.schoolId;

    if (id) {
      try {
        await dispatch(updateSuperAdminSchoolAsync({ id, data: payload })).unwrap();
        setSchoolIdForLogo(id);
        setIsLogoModalOpen(true);
      } catch {
        return;
      }
      return;
    }

    try {
      const createdSchool = await dispatch(createSuperAdminSchoolAsync(payload)).unwrap();
      const newSchoolId =
        createdSchool?.id ??
        createdSchool?.schoolId ??
        createdSchool?.data?.id ??
        createdSchool?.data?.schoolId;

      setSchoolIdForLogo(newSchoolId);
      setIsLogoModalOpen(true);
    } catch {
      return;
    }
  };

  const uploadLogo = (file) =>
    dispatch(uploadSchoolLogoAsync({ schoolId: schoolIdForLogo, file }));

  return (
    <div className="sa-page">
      <h1>School Details</h1>
      <p className="sa-breadcrumb">Home / School Details</p>

      <form onSubmit={submit}>
        {sections.map(([title, fields]) => (
          <section className="sa-card sa-form-card" key={title}>
            <h2>{title}</h2>
            <div className="sa-fields">
              {fields.map(([label, name, type]) => (
                <Field
                  key={name}
                  label={label}
                  name={name}
                  type={type}
                  value={form[name]}
                  options={
                    name === "countryId"
                      ? countries
                      : name === "stateId"
                        ? states
                        : name === "cityId"
                          ? cities
                          : undefined
                  }
                  disabled={name === "stateId" ? !form.countryId : name === "cityId" ? !form.stateId : false}
                  onChange={onChange}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="sa-card sa-form-card">
          <h2>Payment Gateway</h2>
          <div className="sa-fields">
            <Toggle
              label="Enable Online Payment"
              name="onlinePaymentEnabled"
              checked={form.onlinePaymentEnabled}
              onChange={onChange}
            />
            <Field
              label="Payment Gateway Type"
              name="paymentGatewayType"
              type="select"
              value={form.paymentGatewayType}
              onChange={onChange}
            />
          </div>
        </section>

        <section className="sa-card sa-form-card">
          <h2>Academic Settings</h2>
          <div className="sa-fields">
            <Field label="Academic Year" name="academicYear" value={form.academicYear} onChange={onChange} />
            <Field label="Time Zone" name="timeZone" value={form.timeZone} onChange={onChange} />
            <Field
              label="Curriculum"
              name="curriculum"
              type="text"
              value={form.curriculum}
              onChange={onChange}
            />
          </div>
        </section>

        <section className="sa-card sa-form-card">
          <h2>Security</h2>
          <div className="sa-fields">
            <Toggle
              label="Two Factor Authentication"
              name="twoFactorAuthentication"
              checked={form.twoFactorAuthentication}
              onChange={onChange}
            />
          </div>
        </section>

        <div className="sa-form-actions">
          <button className="sa-primary-button" type="submit" disabled={loading}>
            <Save size={19} />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      <UploadSchoolLogoModal
        isOpen={isLogoModalOpen}
        loading={uploadLoading}
        schoolName={form.schoolName}
        onClose={() => setIsLogoModalOpen(false)}
        onUpload={uploadLogo}
      />
    </div>
  );
}
