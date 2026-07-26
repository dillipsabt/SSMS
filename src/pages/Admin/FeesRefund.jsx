import React, { useState } from "react";
import { Building2, CreditCard, Landmark, Wallet, Send } from "lucide-react";

const FeesRefund = ({ rollNumber = "", handleRollNumberChange }) => {
  // State to track selected refund method
  const [refundMethod, setRefundMethod] = useState("online");

  // Dummy Student Data
  const student = {
    name: "Marcus Thorne",
    className: "Class 10-B",
    roll: "#14",
    fatherName: "Satyanarayana",
    image: "https://i.pravatar.cc/100?img=12", // Replace with API image
    totalFees: "₹12,450.00",
    status: "CLEAR",
  };

  // Helper function to render conditional fields based on refundMethod
  const renderDynamicFormFields = () => {
    switch (refundMethod) {
      case "online":
        return (
          <>
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-700">
                Bank Details
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-700">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-700">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Account Number"
                    className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-700">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-700">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case "card":
        return (
          <>
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-700">
                Card Terminal Details
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-700">
                    Debit Card No.<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-700">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Bank"
                    className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-xs font-medium mb-1.5 text-gray-700"
                  >
                    Expiry Date <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    placeholder="DD/MM/YY"
                    className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </>
        );
      case "upi":
        return (
          <>
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-700">
                UPI Details
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-700">
                    UPI ID / VPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="username@upi"
                    className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case "cash":
        return (
          <>
            <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-700">
                Cash Disbursal Receipt
              </h3>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                No bank credentials are required for cash disbursals. Please
                ensure a physical petty cash voucher is signed by the recipient
                upon handover.
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-5 fees-theme-scope">
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-800">Fees Refund</h2>
      <p className="text-xs text-gray-500 mb-4">
        Fees Management / Fees Refund
      </p>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <h3 className="text-sm font-semibold text-gray-700">
            Student Details
          </h3>
        </div>

        <div className="p-4">
          {/* Admission Number */}
          <div className="max-w-xs mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Admission Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={handleRollNumberChange}
              placeholder="1029384"
              className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Student Info Card */}
          <div className="border border-gray-200 rounded-lg bg-white p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center flex-1">
              <img
                src={student.image}
                alt={student.name}
                className="w-14 h-14 rounded-lg border border-gray-200 object-cover"
              />
              <div className="ml-3">
                <h3 className="text-xl font-bold text-gray-800">
                  {student.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {student.className} <span className="mx-1">•</span> Roll:{" "}
                  {student.roll}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Father Name:{" "}
                  <span className="font-semibold">{student.fatherName}</span>
                </p>
              </div>
            </div>

            <div className="flex border border-gray-200 rounded-md overflow-hidden bg-gray-50">
              <div className="px-4 py-2 text-center border-r border-gray-200">
                <p className="text-[10px] uppercase text-gray-500 font-medium tracking-wider">
                  TOTAL FEES PAID
                </p>
                <p className="text-xl font-bold text-teal-600 mt-0.5">
                  {student.totalFees}
                </p>
              </div>
              <div className="px-4 py-2 text-center flex flex-col justify-center items-center">
                <p className="text-[10px] uppercase text-gray-500 font-medium tracking-wider">
                  STATUS
                </p>
                <span className="inline-flex mt-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[11px] font-semibold">
                  {student.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Request Details */}
      <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h3 className="text-sm font-semibold text-gray-700">
            Refund Request Details
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Refund Type <span className="text-red-500">*</span>
              </label>
              <select className="w-full h-9 border border-gray-300 rounded-md px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select</option>
                <option>Full Refund</option>
                <option>Partial Refund</option>
                <option>Transport Refund</option>
                <option>Hostel Refund</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Refund Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Request Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Reason for Refund
            </label>
            <textarea
              rows={2}
              placeholder="Write here"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Refund Method & Dynamic Form Content */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Side (Selection Panel) */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-fit">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 rounded-t-lg flex items-center gap-2">
            <Building2 size={16} className="text-teal-700" />
            <h3 className="font-semibold tracking-wide text-gray-800 uppercase text-xs">
              Refund Method
            </h3>
          </div>

          <div className="p-3 space-y-2.5">
            {/* Online Bank */}
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="refundMethod"
                checked={refundMethod === "online"}
                onChange={() => setRefundMethod("online")}
                className="mr-2 accent-teal-600"
              />
              <div
                className={`flex-1 border rounded-md p-4.5 flex justify-between items-center transition-all ${
                  refundMethod === "online"
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-teal-500"
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-gray-800">
                    Online/Bank Transfer
                  </h4>
                  <p className="text-[14px] text-gray-500 mt-0.5">
                    Transfer to parent account
                  </p>
                </div>
                <Landmark
                  size={18}
                  className="text-teal-700 flex-shrink-0 ml-1"
                />
              </div>
            </label>

            {/* Card */}
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="refundMethod"
                checked={refundMethod === "card"}
                onChange={() => setRefundMethod("card")}
                className="mr-2 accent-teal-600"
              />
              <div
                className={`flex-1 border rounded-md p-4.5 flex justify-between items-center transition-all ${
                  refundMethod === "card"
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-teal-500"
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-gray-800">
                    Debit/Credit Card
                  </h4>
                  <p className="text-[14px] text-gray-500 mt-0.5">
                    Physical Swipe the card
                  </p>
                </div>
                <CreditCard
                  size={18}
                  className="text-teal-700 flex-shrink-0 ml-1"
                />
              </div>
            </label>

            {/* UPI */}
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="refundMethod"
                checked={refundMethod === "upi"}
                onChange={() => setRefundMethod("upi")}
                className="mr-2 accent-teal-600"
              />
              <div
                className={`flex-1 border rounded-md p-4.5 flex justify-between items-center transition-all ${
                  refundMethod === "upi"
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-teal-500"
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-gray-800">UPI</h4>
                  <p className="text-[14px] text-gray-500 mt-0.5">
                    Transfer amount to UPI ID
                  </p>
                </div>
                <Wallet
                  size={18}
                  className="text-teal-700 flex-shrink-0 ml-1"
                />
              </div>
            </label>

            {/* Cash */}
            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="refundMethod"
                checked={refundMethod === "cash"}
                onChange={() => setRefundMethod("cash")}
                className="mr-2 accent-teal-600"
              />
              <div
                className={`flex-1 border rounded-md p-4.5 flex justify-between items-center transition-all ${
                  refundMethod === "cash"
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-teal-500"
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Cash</h4>
                  <p className="text-[14px] text-gray-500 mt-0.5">
                    Disburse from petty cash
                  </p>
                </div>
                <Wallet
                  size={18}
                  className="text-teal-700 flex-shrink-0 ml-1"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Right Side (Dynamic Content Wrapper) */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {renderDynamicFormFields()}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 mt-4">
            <button
              type="button"
              className="px-4 py-1.5 rounded bg-red-500 hover:bg-red-600 text-white font-medium text-xs"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5"
            >
              Submit Request
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesRefund;
