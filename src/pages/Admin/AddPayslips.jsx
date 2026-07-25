import React, { useState } from "react";
import { Calendar, Save, Eraser } from "lucide-react";

export default function AddPayslip() {
    const [paymentMethod, setPaymentMethod] = useState("bank");

    return (
        <div className="p-6 min-h-screen">
            {/* Header */}
            <h1 className="text-xl font-semibold text-gray-800">Add Payslips</h1>
            <p className="text-xs text-gray-500 mt-1 mb-5">
                Home / Accounts / Add Payslips
            </p>

            <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
                <h2 className="font-semibold text-gray-700 mb-4">Add Payslips</h2>

                {/* Teacher / Staff Details */}
                <div className="border border-gray-200 rounded mb-4">
                    <div className="bg-gray-50 px-4 py-2 font-sm text-gray-800 border-b border-gray-200">
                        Teacher / Staff Details
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-4 gap-2">
                            <Input label="Teacher / Staff ID" />
                            <Input label="Teacher / Staff Name" />
                            <Input label="Department" placeholder="Department" />
                            <Input label="Designation" placeholder="Designation" />
                        </div>

                        <div className="grid grid-cols-4 gap-2 mt-4">
                            <DateInput label="Salary Month/Year" />
                            <DateInput label="Payment Date" />
                            <Input label="Days Payable" />
                        </div>
                    </div>
                </div>

                {/* Earnings + Deductions */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Earnings */}
                    <div className="border border-gray-200 rounded">
                        <div className="bg-gray-50 px-4 py-2 font-sm text-gray-800 border-b border-gray-200">
                            Earnings
                        </div>

                        <div className="p-4 space-y-3">
                            <RowInput label="Basic Pay" />
                            <RowInput label="HRA (Rent)" />
                            <RowInput label="Conveyance" />
                            <RowInput label="Special Allowance" />
                            <RowInput label="Performance Bonus" />
                        </div>

                        <div className="bg-gray-50 px-4 py-3 flex justify-between text-sm border-t border-gray-200">
                            <span>Total Earnings</span>
                            <span>00.00</span>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="border border-gray-200 rounded">
                        <div className="bg-gray-50 px-4 py-2 font-xs text-gray-800 border-b border-gray-200">
                            Deductions
                        </div>

                        <div className="p-4 space-y-3">
                            <RowInput label="Provident Fund (PF)" />
                            <RowInput label="Income Tax (TDS)" />
                            <RowInput label="Professional Tax" />
                            <RowInput label="Leave Deductions" />
                            <RowInput label="Others" />
                        </div>

                        <div className="bg-gray-50 px-4 py-3 text-sm flex justify-between border-t border-gray-200">
                            <span>Total Deductions</span>
                            <span>00.00</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method + Remarks */}
                <div className="border border-gray-300 rounded">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-300 text-sm font-semibold text-gray-700">
                        Payment Method
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 items-start">
                        {/* Left */}
                        <div className="space-y-6">
                            <label className="h-[40px] border border-gray-300 rounded px-5 flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "bank"}
                                    onChange={() => setPaymentMethod("bank")}
                                    className="w-5 h-5 accent-teal-600 "
                                />
                                <span className="text-sm text-gray-700">Bank Transfer</span>
                            </label>

                            <label className="h-[40px] border border-gray-300 rounded px-5 flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "cheque"}
                                    onChange={() => setPaymentMethod("cheque")}
                                    className="w-5 h-5 accent-teal-600"
                                />
                                <span className="text-sm text-gray-700">Cheque Payment</span>
                            </label>
                        </div>

                        {/* Right */}
                        <div>
                            <label className="block text-xs font-semibold mb-1.5 text-gray-700">
                                Remarks
                            </label>

                            <textarea
                                rows={2}
                                className="w-full border border-gray-300 rounded p-4 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 text-xs">
                        <Eraser size={14} />
                        Clear
                    </button>

                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2 text-xs">
                        <Save size={14} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

/* Reusable Components */

function Input({ label, placeholder = "" }) {
    return (
        <div>
            <label className="block text-xs mb-1 font-medium">{label}</label>
            <input
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
        </div>
    );
}

function DateInput({ label }) {
    return (
        <div>
            <label className="block text-xs mb-1 font-medium">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                />
                <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
            </div>
        </div>
    );
}

function RowInput({ label }) {
    return (
        <div className="grid grid-cols-2 gap-3 items-center">
            <label className="text-xs">{label}</label>
            <input className="border border-gray-200 rounded px-3 py-1.5" />
        </div>
    );
}