import React from "react";
import Select from "react-select";

const TeacherPayslip = () => {
  return (
    <div className="min-h-screen p-2">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Payslip</h1>
      <p className="text-sm text-gray-500 mb-4">Teacher / Payslip</p>

      {/* Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header Row (FULL WIDTH BORDER) */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 px-4 py-3 border-b border-gray-200">          <h2 className="font-semibold text-gray-700">Payslip Details</h2>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">            <Select
            className="w-full"
            options={[
              { value: "Nov 2025", label: "Nov 2025" },
            ]}
            value={{ value: "Nov 2025", label: "Nov 2025" }}
            onChange={(selected) => { }}
          />

            <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
              Download
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-center font-medium text-gray-700 mb-4">
            PAYSLIP FOR THE MONTH OF NOVEMBER 2025
          </h3>

          {/* Tables Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Earnings */}

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="px-3 py-2 font-medium bg-[#EFF3FF]">Earnings</div>

              <div className="text-sm ">
                {[
                  ["Basic Salary", "₹ 26,184"],
                  ["HRA", "₹ 15,710"],
                  ["LTA", "₹ 2,618"],
                  ["Other Allowance", "₹ 7,855"],
                  ["Total Earnings", "₹ 52,367.00"],
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between px-3 py-2 border-t border-gray-200"
                  >
                    <span>{item[0]}</span>
                    <span>{item[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="px-3 py-2 font-medium bg-[#EFF3FF]">
                Deductions
              </div>

              <div className="text-sm">
                {[
                  ["PF", "₹ 1,800"],
                  ["Professional Tax", "₹ 200"],
                  ["TDS", "₹ 0"],
                  ["Total Deductions", "₹ 2,000.00"],
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between px-3 py-2 border-t border-gray-200"
                  >
                    <span>{item[0]}</span>
                    <span>{item[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="mt-4 text-sm font-medium text-gray-700">
            NET PAY :{" "}
            <span className="font-semibold">
              50,367.00 (Fifty Thousand Three Hundred and Sixty Seven Only)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPayslip;
