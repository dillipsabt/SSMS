import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { Eye, Download, Trash2, MoreVertical } from "lucide-react";
import PayslipDownload from "./PayslipDownload";

export default function PayslipList() {
    const [openMenu, setOpenMenu] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showPayslip, setShowPayslip] = useState(false);

    const payslips = [
        {
            id: "001",
            name: "Dellip",
            date: "21-03-2009",
            dept: "Science Faculty",
            designation: "Senior Lecturer",
            month: "04/2026",
            days: 30,
            salary: "48,290",
        },
        {
            id: "002",
            name: "Naveen Kumar",
            date: "21-03-2009",
            dept: "Maths Faculty",
            designation: "Junior Lecturer",
            month: "04/2026",
            days: 28,
            salary: "23,590",
        },
        {
            id: "003",
            name: "Surya Kumar",
            date: "21-03-2009",
            dept: "Social Faculty",
            designation: "Senior Lecturer",
            month: "04/2026",
            days: 31,
            salary: "30,292",
        },
        {
            id: "004",
            name: "Aravind Reddy",
            date: "21-03-2009",
            dept: "Hindi Faculty",
            designation: "Senior Lecturer",
            month: "04/2026",
            days: 29,
            salary: "42,890",
        },
        {
            id: "005",
            name: "Ashish",
            date: "21-03-2009",
            dept: "Electrical",
            designation: "Electrician",
            month: "04/2026",
            days: 25,
            salary: "50,345",
        },
        {
            id: "006",
            name: "Ali Khan",
            date: "21-03-2009",
            dept: "Cleaning",
            designation: "Cleaning",
            month: "04/2026",
            days: 30,
            salary: "10,000",
        },
        {
            id: "007",
            name: "Meena Kumari",
            date: "21-03-2009",
            dept: "Driver",
            designation: "Senior Driver",
            month: "04/2026",
            days: 29,
            salary: "13,000",
        },
        {
            id: "008",
            name: "Dellip",
            date: "21-03-2009",
            dept: "Telugu Faculty",
            designation: "Junior Lecturer",
            month: "04/2026",
            days: 31,
            salary: "20,000",
        },
        {
            id: "009",
            name: "Naveen Kumar",
            date: "21-03-2009",
            dept: "English Faculty",
            designation: "Junior Lecturer",
            month: "04/2026",
            days: 29,
            salary: "20,000",
        },
        {
            id: "010",
            name: "Surya Kumar",
            date: "21-03-2009",
            dept: "English Faculty",
            designation: "Senior Lecturer",
            month: "04/2026",
            days: 28,
            salary: "34,504",
        },
    ];

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-xl font-semibold text-gray-800">Payslip Lists</h1>
            <p className="text-sm text-gray-500 mt-1 mb-5">
                Home / Accounts / Payslip Lists
            </p>

            <div className="bg-white border border-gray-200 rounded shadow-sm">
                <div className="border-b border-gray-300">
                    <h2 className="text-sm text-gray-700 px-3 py-2">Payslip Lists</h2>
                </div>

                {/* Filters */}
                <div className="flex justify-end gap-3 py-3 px-4">
                    <input
                        placeholder="Search Teacher / Staff Name"
                        className="border border-gray-300 rounded px-3 py-2 text-xs w-56"
                    />

                    <select className="border border-gray-300 rounded px-3 py-2 text-xs w-32">
                        <option>Department</option>
                    </select>

                    <select className="border border-gray-300 rounded px-3 py-2 text-xs w-32">
                        <option>Designation</option>
                    </select>

                    <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        className="border border-gray-300 rounded px-3 py-2 text-xs w-32"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-300 rounded mx-4">
                    <table className="w-full text-xs">
                        <thead className="bg-[#eef3fa]">
                            <tr>
                                {[
                                    "S.No.",
                                    "Teacher/Staff ID",
                                    "Teacher/Staff Name",
                                    "Payment Date",
                                    "Department",
                                    "Designation",
                                    "Salary Month/Year",
                                    "Days Payable",
                                    "Salary Credited",
                                    "Action",
                                ].map((head) => (
                                    <th
                                        key={head}
                                        className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {payslips.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-t border-gray-300 hover:bg-gray-50"
                                >
                                    <td className="px-3 py-2">{index + 1}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{item.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{item.name}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{item.date}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{item.dept}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {item.designation}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">{item.month}</td>
                                    <td className="px-3 py-2">{item.days}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {item.salary}
                                    </td>

                                    <td className="px-3 py-2 relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenu(openMenu === index ? null : index)
                                            }
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {openMenu === index && (
                                            <div className="absolute right-6 top-6 bg-white border border-gray-300 shadow rounded w-36 z-10">
                                                <button
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setOpenMenu(null);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-xs"
                                                >
                                                    <Eye size={14} className="text-purple-500" />
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        window.open("/payslip-download", "_blank");
                                                        setOpenMenu(null);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-xs"
                                                >
                                                    <Download size={14} className="text-blue-500" />
                                                    Download
                                                </button>

                                                <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-xs">
                                                    <Trash2 size={14} className="text-red-500" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-end items-center gap-3 mt-4 px-4 pb-4 text-xs">
                    <button className="border border-gray-300 px-3 py-1 rounded">
                        Prev
                    </button>

                    <button className="bg-indigo-600 text-white px-3 py-1 rounded">
                        Next
                    </button>

                    <span className="text-xs text-gray-600">Page: 1 of 1</span>

                    <select className="border border-gray-300 rounded px-2 py-1 pr-7">
                        <option>10</option>
                    </select>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-150">
                        {/* Header */}
                        <div className="bg-indigo-600 text-white px-5 py-3 rounded-t-xl flex justify-between items-center">
                            <h2 className="font-semibold text-sm">View Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-sm"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Top Info */}
                            <div className="grid grid-cols-4 bg-[#eef3fa] rounded p-3 text-xs font-medium mb-4">
                                <div>
                                    <div>Naveen Kumar</div>
                                    <div className="text-xs text-gray-500 mt-1">101</div>
                                </div>
                                <div>Maths Faculty</div>
                                <div>Junior Lecturer</div>
                                <div>23,590</div>
                            </div>

                            {/* Earnings + Deductions */}
                            <div className="grid grid-cols-2 gap-5">
                                {/* Earnings */}
                                <div className="border border-gray-200 rounded">
                                    <div className="px-4 py-2 border-b border-gray-200 font-semibold text-xs">
                                        Earnings
                                    </div>

                                    <div className="p-4 space-y-4 text-xs">
                                        <div className="flex justify-between">
                                            <span>Basic Pay</span>
                                            <span>14000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>HRA (Rent)</span>
                                            <span>4000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Conveyance</span>
                                            <span>2000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Special Allowance</span>
                                            <span>3590</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Performance Bonus</span>
                                            <span>00</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between font-medium text-sm">
                                        <span>Total Earnings</span>
                                        <span>23590</span>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div className="border border-gray-200 rounded">
                                    <div className="px-4 py-2 border-b border-gray-200 font-semibold text-xs">
                                        Deductions
                                    </div>

                                    <div className="p-4 space-y-4 text-xs">
                                        <div className="flex justify-between">
                                            <span>Provident Fund (PF)</span>
                                            <span>2000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Income Tax (TDS)</span>
                                            <span>1000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Professional Tax</span>
                                            <span>00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Leave Deductions</span>
                                            <span>00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Others</span>
                                            <span>00</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between font-medium text-xs">
                                        <span>Total Deductions</span>
                                        <span>3000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className="mt-5 text-xs">
                                <div className="font-medium mb-1">Remarks</div>
                                <div>-</div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="border border-red-500 text-red-500 px-4 py-2 rounded text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showPayslip && (
                <div className="fixed inset-0 bg-black/40 z-50 overflow-auto">
                    <div className="relative">
                        <PayslipDownload />
                    </div>
                </div>
            )}
        </div>
    );
}