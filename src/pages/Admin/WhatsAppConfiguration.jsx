import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { saveWhatsAppConfigurationAsync } from "../../features/Admin/WhatsAppConfiguration/whatsAppConfigurationSlice";

const initialForm = {
  phoneNumber: "",
  phoneNumberId: "",
  active: false,
};

export default function WhatsAppConfiguration() {
  const dispatch = useDispatch();
  const isSaving = useSelector((state) => state.whatsAppConfiguration.loading);
  const [form, setForm] = useState(initialForm);

  const handleChange = ({ target: { name, value, checked, type } }) => {
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    const displayNumber = form.phoneNumber.trim();
    const phoneNumberId = form.phoneNumberId.trim();

    if (!displayNumber || !phoneNumberId) {
      toast.error("Phone Number and Phone Number ID are required");
      return;
    }

    try {
      await dispatch(
        saveWhatsAppConfigurationAsync({
          displayNumber,
          phoneNumberId,
          active: form.active,
        }),
      ).unwrap();
      toast.success("WhatsApp configuration saved successfully");
    } catch (error) {
      toast.error(error?.message || "Unable to save WhatsApp configuration");
    }
  };

  return (
    <main className="page-wrap min-h-screen p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#303038]">
          Whatsapp Configuration
        </h1>
        <p className="mt-1 text-sm text-[#222]">Home / Whatsapp Configuration</p>
      </header>

      <section className="card overflow-hidden">
        <h2 className="card-section px-4 py-3 text-base">
          Whatsapp configuration Details
        </h2>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <FormInput
              label="Phone Number ID"
              name="phoneNumberId"
              value={form.phoneNumberId}
              onChange={handleChange}
              placeholder="Phone Number ID"
            />
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <label className="inline-flex cursor-pointer flex-col gap-2 text-sm font-medium text-gray-800">
              Active
              <span className="relative inline-flex h-8 w-14 items-center">
                <input
                  aria-label="Active WhatsApp configuration"
                  checked={form.active}
                  className="peer sr-only"
                  name="active"
                  onChange={handleChange}
                  type="checkbox"
                />
                <span className="absolute inset-0 rounded-full bg-gray-200 transition peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-600/30" />
                <span className="relative ml-1 h-6 w-6 rounded-full bg-white shadow-sm transition peer-checked:translate-x-6" />
              </span>
            </label>

            <button
              className="btn-primary h-10 self-end px-5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={handleSave}
              type="button"
            >
              <Save size={17} />
              {isSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function FormInput({ label, name, onChange, placeholder, type = "text", value }) {
  return (
    <label className="block text-sm font-medium text-gray-800">
      {label}
      <input
        className="form-input mt-1.5 h-9"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}
