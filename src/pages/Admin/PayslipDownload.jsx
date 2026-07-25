import React from "react";

export default function Payslip() {
    const employeeDetails = [
        ["Employee Id", "101", "Employee Name", "Naveen Kumar"],
        ["Date of Joining", "20-Sep-2025", "Designation", "Senior Lecturer"],
        ["Department", "Maths Faculty", "Bank Name", "ICICI"],
        ["Bank A/c Number", "120938746512", "IFSC Code", "ICICI101202"],
        ["UAN Number", "1029384750", "PF Account Number", "APHYD001928390282990"],
        ["Pan No.", "MAPWJ0010L", "ESIC Number", "Not applicable"],
        ["Period (Paid)", "01-Nov-2025 To 30-Nov-2025", "Total No.of Days in this Month", "30"],
        ["LOP Days", "0.00", "No.Of Days Paid", "28"],
    ];

    const earnings = [
        ["Basic", "14000"],
        ["HRA", "4000"],
        ["Conveyance", "2000"],
        ["Special Allowance", "3590"],
        ["Performance Bonus", "00"],
    ];

    const deductions = [
        ["Provident Fund (PF)", "200.00"],
        ["Income Tax (TDS)", "1,800.00"],
        ["Professional Tax", "1,243.00"],
        ["Leave Deductions", ""],
        ["Others", ""],
    ];

    return (
        <div className="min-h-screen p-6 flex justify-center">
            <div className="bg-white w-full max-w-3xl p-6 shadow-md border border-gray-300 rounded-md">
                {/* Header */}
                <div className="w-full border border-gray-300 flex items-stretch">
                    {/* Left Logo Box */}
                    <div className="w-[150px] bg-black text-white flex items-center justify-center px-4 py-3">
                        <div className="text-center font-semibold text-xl leading-tight">
                            Chaitanya
                            <br />
                            E-Techno
                        </div>
                    </div>

                    {/* Right School Details */}
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                        <h1 className="text-xl font-semibold text-black">
                            Chaitanya E-Techno School
                        </h1>

                        <p className="mt-4 text-xs text-gray-900">
                            3/11A Kondapur Madhapur, Hyderabad, Telangana - 500081
                        </p>
                    </div>
                </div>

                {/* Payslip Title */}
                <div className="mt-4 border border-gray-300  ">
                    <div className="bg-indigo-100 text-center font-semibold py-2 text-xs">
                        PAYSLIP FOR THE MONTH OF NOVEMBER 2025
                    </div>

                    {/* Employee Details */}
                    <table className="w-full border-collapse text-xs">
                        <tbody>
                            {employeeDetails.map((row, index) => (
                                <tr key={index} className="border border-gray-300">
                                    {row.map((cell, i) => (
                                        <td key={i} className="border border-gray-300 px-2 py-2">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Earnings & Deductions */}
                <div className="mt-6 border border-gray-300">
                    <table className="w-full border-collapse text-xs ">
                        <thead>
                            <tr className="bg-indigo-100 text-center font-semibold">
                                <th colSpan="2" className="border border-gray-300 py-2">
                                    Earnings
                                </th>
                                <th colSpan="2" className="border border-gray-300 py-2">
                                    Deductions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {earnings.map((earning, index) => (
                                <tr key={index}>
                                    {/* Earnings */}
                                    <td className="w-1/4 border border-gray-300 px-3 py-2">
                                        {earning[0]}
                                    </td>
                                    <td className="w-1/4 border border-gray-300 px-3 py-2 text-right">
                                        {earning[1]}
                                    </td>

                                    {/* Deductions */}
                                    <td className="w-1/4 border border-gray-300 px-3 py-2">
                                        {deductions[index]?.[0] || ""}
                                    </td>
                                    <td className="w-1/4 border border-gray-300 px-3 py-2 text-right">
                                        {deductions[index]?.[1] || ""}
                                    </td>
                                </tr>
                            ))}

                            <tr className="font-semibold">
                                <td className="border border-gray-300 px-3 py-2">
                                    Gross Salary
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-right">
                                    23590.00
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Total deduction
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-right">
                                    3,243.00
                                </td>
                            </tr>

                            <tr className="font-semibold">
                                <td className="border border-gray-300 px-3 py-2">
                                    Total Earning
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-right">
                                    23590.00
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    NET salary
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-right">
                                    20,000.00
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Footer */}
                <p className="text-xs mt-6">
                    Note: This is a Computer generated document and doesn't require any
                    signature
                </p>
            </div>
        </div>
    );
}