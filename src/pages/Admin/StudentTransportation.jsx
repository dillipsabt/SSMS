import React, { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

export default function StudentTransportation() {
    const location = useLocation();

    const editData = location.state;

    const [formData, setFormData] = useState(
        editData || {
            admissionNo: "",
            studentName: "",
            classSection: "",
            rollNo: "",

            parentName: "",
            parentMobile: "",

            pickupRoute: "",
            pickupStop: "",
            pickupLandmark: "",
            pickupAddress: "",
            pickupTime: "",
            pickupGps: "",

            dropRoute: "",
            dropStop: "",
            dropLandmark: "",
            dropAddress: "",
            dropTime: "",
            dropGps: "",

            busNo: "",
            vehicleNo: "",
            driverName: "",
            driverMobile: "",
            licenseNo: "",
        }
    );

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        if (!formData.admissionNo.trim()) {
            toast.error("Admission Number is required");
            return false;
        }

        if (!formData.studentName.trim()) {
            toast.error("Student Name is required");
            return false;
        }

        if (!formData.rollNo.trim()) {
            toast.error("Roll Number is required");
            return false;
        }

        if (!formData.parentMobile.trim()) {
            toast.error("Parent Mobile Number is required");
            return false;
        }

        return true;
    };

    const handleSubmit = () => {

        if (!validateForm()) return;

        if (editData) {

            toast.success(
                "Transportation Updated Successfully"
            );

        } else {

            toast.success(
                "Transportation Saved Successfully"
            );
        }
    };


    const Input = ({ label, name, value, placeholder = "", type = "text", }) => (
        <div>
            <label className="block text-[12px] text-[#333] mb-1">
                {label} <span className="text-red-500">*</span>
            </label>

            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                className="w-full h-[32px] px-2 text-[12px] border border-[#d6d6d6] rounded outline-none focus:border-indigo-500"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-white p-2">

            {/* PAGE TITLE */}
            <h1 className="text-2xl font-bold text-[#222]">
                Student Transportation
            </h1>

            <p className="text-[12px] text-[#666] mb-4">
                Home / Transportation / Student Transportation
            </p>

            {/* MAIN CARD */}
            <div className="bg-white border border-[#d9d9d9] rounded shadow-sm">

                {/* HEADER */}
                <div className="border-b border-[#d9d9d9] px-4 py-2">
                    <h2 className="text-xm font-semibold">
                        {editData
                            ? "Edit Student Transport"
                            : "Add New Student Transport"}
                    </h2>
                </div>

                <div className="p-3">

                    {/* STUDENT INFO */}
                    <div className="border border-[#d9d9d9] rounded mb-4">

                        <div className="border-b border-[#d9d9d9] px-3 py-2">
                            <h3 className="text-[12px] font-semibold">
                                Student Information
                            </h3>
                        </div>

                        <div className="p-3">

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                                <Input
                                    label="Admission Number"
                                    name="admissionNo"
                                    value={formData.admissionNo}
                                />

                                <Input
                                    label="Student Name"
                                    name="studentName"
                                    value={formData.studentName}
                                />

                                <Input
                                    label="Class / Section"
                                    name="classSection"
                                    value={formData.classSection}
                                />

                                <Input
                                    label="Roll Number"
                                    name="rollNo"
                                    value={formData.rollNo}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">

                                <Input
                                    label="Parent Name"
                                    name="parentName"
                                    value={formData.parentName}
                                />

                                <Input
                                    label="Parent Mobile No."
                                    name="parentMobile"
                                    value={formData.parentMobile}
                                />
                            </div>
                        </div>
                    </div>

                    {/* PICKUP + DROP */}
                    <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 mb-4">

                        {/* PICKUP */}
                        <div className="border border-[#d9d9d9] rounded">

                            <div className="border-b border-[#d9d9d9] px-3 py-2">
                                <h3 className="text-[12px] font-semibold">
                                    Pickup Details
                                </h3>
                            </div>

                            <div className="p-3">

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Pickup Route"
                                        name="pickupRoute"
                                        value={formData.pickupRoute}
                                    />

                                    <Input
                                        label="Pickup Stop"
                                        name="pickupStop"
                                        value={formData.pickupStop}
                                    />
                                </div>

                                <div className="mt-3">
                                    <Input
                                        label="Landmark"
                                        name="pickupLandmark"
                                        value={formData.pickupLandmark}
                                    />
                                </div>

                                <div className="mt-3">
                                    <Input
                                        label="Address"
                                        name="pickupAddress"
                                        value={formData.pickupAddress}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <Input
                                        label="Pickup Time"
                                        name="pickupTime"
                                        type="time"
                                        value={formData.pickupTime}
                                    />

                                    <Input
                                        label="GPS Coordinates"
                                        name="pickupGps"
                                        value={formData.pickupGps}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* DROP */}
                        <div className="border border-[#d9d9d9] rounded">

                            <div className="border-b border-[#d9d9d9] px-3 py-2">
                                <h3 className="text-[12px] font-semibold">
                                    Drop Details
                                </h3>
                            </div>

                            <div className="p-3">

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Drop Route"
                                        name="dropRoute"
                                        value={formData.dropRoute}
                                    />

                                    <Input
                                        label="Drop Stop"
                                        name="dropStop"
                                        value={formData.dropStop}
                                    />
                                </div>

                                <div className="mt-3">
                                    <Input
                                        label="Landmark"
                                        name="dropLandmark"
                                        value={formData.dropLandmark}
                                    />
                                </div>

                                <div className="mt-3">
                                    <Input
                                        label="Address"
                                        name="dropAddress"
                                        value={formData.dropAddress}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <Input
                                        label="Drop Time"
                                        name="dropTime"
                                        type="time"
                                        value={formData.dropTime}
                                    />

                                    <Input
                                        label="GPS Coordinates"
                                        name="dropGps"
                                        value={formData.dropGps}
                                    />
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* DRIVER DETAILS */}
                    <div className="border border-[#d9d9d9] rounded">

                        <div className="border-b border-[#d9d9d9] px-3 py-2">
                            <h3 className="text-[12px] font-semibold">
                                Driver & Vehicle Details
                            </h3>
                        </div>

                        <div className="p-3">

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                                <Input
                                    label="Bus Number"
                                    name="busNo"
                                    value={formData.busNo}
                                />

                                <Input
                                    label="Vehicle Plate Number"
                                    name="vehicleNo"
                                    value={formData.vehicleNo}
                                />

                                <Input
                                    label="Driver Name"
                                    name="driverName"
                                    value={formData.driverName}
                                />

                                <Input
                                    label="Driver Mobile No."
                                    name="driverMobile"
                                    value={formData.driverMobile}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-3">

                                <Input
                                    label="License No."
                                    name="licenseNo"
                                    value={formData.licenseNo}
                                />

                            </div>
                        </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="flex justify-end mt-4">

                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[12px] px-4 py-2 rounded "
                        >
                            <Save size={14} />
                            {/* Save */}
                            {editData ? "Update" : "Save"}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}