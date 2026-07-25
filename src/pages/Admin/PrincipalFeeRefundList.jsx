import React, { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "../../components/common/Pagination";

import {
    FiSearch,
    FiCalendar,
    FiEye,
    FiMoreVertical,
    FiCheckCircle,
    FiXCircle,
} from "react-icons/fi";

const refundData = [
    {
        id: 1,
        refundId: "RFD000154",
        date: "01/04/2026",
        student: "Naresh",
        admissionNo: "ADM124",
        class: "10-A",
        refundType: "Partial Refund",
        method: "Online",
        amount: "₹8,000",
        status: "Completed",
        rejectComment: "",
    },

    {
        id: 2,
        refundId: "RFD000153",
        date: "14/03/2026",
        student: "Harika",
        admissionNo: "ADM521",
        class: "9-B",
        refundType: "Full",
        method: "Cash",
        amount: "₹45,000",
        status: "Pending",
        rejectComment: "",
    },

    {
        id: 3,
        refundId: "RFD000152",
        date: "01/03/2026",
        student: "Sowjanya Reddy",
        admissionNo: "ADM875",
        class: "8-B",
        refundType: "Transport",
        method: "UPI",
        amount: "₹2,500",
        status: "Rejected",
        rejectComment: "Not consider the refund fees.",
    },
];

export default function PrincipleFeeRefundList() {
    const [comments, setComments] = useState("");

    const [search, setSearch] = useState("");

    const [selectedClass, setSelectedClass] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [menuOpen, setMenuOpen] = useState(null);

    const [selectedRow, setSelectedRow] = useState(null);

    const [rejectModal, setRejectModal] = useState(false);

    const [viewModal, setViewModal] = useState(false);

    const filteredData = useMemo(() => {
        return refundData.filter((item) => {
            return (
                item.student.toLowerCase().includes(search.toLowerCase()) &&
                (selectedClass === "" || item.class === selectedClass) &&
                (selectedStatus === "" || item.status === selectedStatus)
            );
        });
    }, [search, selectedClass, selectedStatus]);

    const indexOfLast = currentPage * rowsPerPage;

    const indexOfFirst = indexOfLast - rowsPerPage;

    const currentData = filteredData.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <div className="w-full bg-white min-h-screen p-4 md:p-4">

            <div className="mb-4">

                <h1 className="text-2xl font-semibold">
                    Fees Refund List
                </h1>

                <p className="text-gray-500 mt-1 text-sm">
                    Fees Management / Fees Refund List
                </p>

            </div>

            <div className="bg-white rounded border border-gray-300 shadow-sm">

                <div className="border-b border-gray-300 px-4 py-3">

                    <h2 className="font-semibold">
                        Fees Refund List
                    </h2>

                </div>

                <div className="p-4">

                    <div className="flex flex-wrap gap-3 justify-end">

                        <div className="relative">

                            <FiSearch
                                className="absolute left-3 top-3 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search Student Name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-3 h-10 border border-gray-300 rounded w-64 outline-none "
                            />

                        </div>
                        <div className="relative">

                            <input
                                type="text"
                                placeholder="01/09/2025 - 30/10/2025"
                                className="border border-gray-300 h-10 rounded px-3 w-56 outline-none"
                            />

                            <FiCalendar
                                className="absolute right-3 top-3 text-gray-500"
                            />

                        </div>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="border border-gray-300 h-10 rounded px-3 w-44 outline-none"
                        >

                            <option value="">
                                Select Class
                            </option>

                            <option>
                                10-A
                            </option>

                            <option>
                                9-B
                            </option>

                            <option>
                                8-B
                            </option>

                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="border border-gray-300 h-10 rounded px-3 w-44 outline-none"
                        >

                            <option value="">
                                Select Status
                            </option>

                            <option>
                                Completed
                            </option>

                            <option>
                                Pending
                            </option>

                            <option>
                                Rejected
                            </option>

                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto mt-4 rounded border border-gray-200">
                    <table className="w-full min-w-[1200px] text-sm">
                        <thead className="bg-indigo-50">
                            <tr>

                                <th className="p-3 text-left">
                                    S.No.
                                </th>

                                <th className="p-3 text-left">
                                    Refund ID
                                </th>

                                <th className="p-3 text-left">
                                    Date
                                </th>

                                <th className="p-3 text-left">
                                    Student Name
                                </th>

                                <th className="p-3 text-left">
                                    Admission No
                                </th>

                                <th className="p-3 text-left">
                                    Class/Section
                                </th>

                                <th className="p-3 text-left">
                                    Refund Type
                                </th>

                                <th className="p-3 text-left">
                                    Method
                                </th>

                                <th className="p-3 text-left">
                                    Refund Amount
                                </th>

                                <th className="p-3 text-center">
                                    Reject Comments
                                </th>

                                <th className="p-3 text-center">
                                    Status
                                </th>

                                <th className="p-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="bg-white">
                            {currentData.length > 0 ? (
                                <>
                                    {currentData.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-gray-200 transition"
                                        >
                                            {/* S.No */}
                                            <td className="px-3 py-3">
                                                {indexOfFirst + index + 1}
                                            </td>

                                            {/* Refund ID */}
                                            <td className="px-3 py-3 text-gray-700">
                                                {item.refundId}
                                            </td>

                                            {/* Date */}
                                            <td className="px-3 py-3">
                                                {item.date}
                                            </td>

                                            {/* Student */}
                                            <td className="px-3 py-3">
                                                {item.student}
                                            </td>

                                            {/* Admission */}
                                            <td className="px-3 py-3">
                                                {item.admissionNo}
                                            </td>

                                            {/* Class */}
                                            <td className="px-3 py-3">
                                                {item.class}
                                            </td>

                                            {/* Refund Type */}
                                            <td className="px-3 py-3">
                                                {item.refundType}
                                            </td>

                                            {/* Method */}
                                            <td className="px-3 py-3">
                                                {item.method}
                                            </td>

                                            {/* Amount */}
                                            <td className="px-3 py-3 font-medium">
                                                {item.amount}
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRow(item);
                                                        setViewModal(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <FiEye size={18} />
                                                </button>
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <span
                                                    className={`px-4 py-1 rounded-full text-xs font-semibold ${item.status === "Completed"
                                                            ? "bg-green-100 text-green-600"
                                                            : item.status === "Pending"
                                                                ? "bg-yellow-100 text-yellow-600"
                                                                : "bg-red-100 text-red-600"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="relative px-3 py-3 text-center">
                                                <div className="inline-block relative">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setMenuOpen(menuOpen === item.id ? null : item.id)
                                                        }
                                                        className="rounded p-2"
                                                    >
                                                        <FiMoreVertical size={18} />
                                                    </button>

                                                    {menuOpen === item.id && (
                                                        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-300 bg-white shadow-lg z-50">

                                                            <button
                                                                onClick={() => {
                                                                    alert("Approved Successfully");
                                                                    setMenuOpen(null);
                                                                }}
                                                                className="flex w-full items-center gap-2 px-4 py-2"
                                                            >
                                                                <FiCheckCircle className="text-green-600" />
                                                                Approve
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setSelectedRow(item);
                                                                    setRejectModal(true);
                                                                    setMenuOpen(null);
                                                                }}
                                                                className="flex w-full items-center gap-2 px-4 py-2"
                                                            >
                                                                <FiXCircle className="text-red-600" />
                                                                Reject
                                                            </button>

                                                        </div>
                                                    )}

                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-semibold">

                                        <td colSpan={7}></td>

                                        <td className="px-3 py-3">
                                            Total
                                        </td>

                                        <td className="px-3 py-3">
                                            ₹55,500
                                        </td>

                                        <td colSpan={3}></td>

                                    </tr>
                                </>
                            ) : (

                                <tr>

                                    <td
                                        colSpan={12}
                                        className="text-center py-8 text-gray-500"
                                    >

                                        No Refund Requests Found

                                    </td>

                                </tr>

                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-5">

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        rowsPerPage={rowsPerPage}
                        setCurrentPage={setCurrentPage}
                        setRowsPerPage={setRowsPerPage}
                    />

                </div>
            </div>

            {/* Reject Popup */}

            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">

                        <div className="bg-indigo-600 flex items-center justify-between px-5 py-4">
                            <h2 className="text-lg font-semibold text-white">
                                Reject Comments
                            </h2>

                            <button
                                onClick={() => {
                                    setRejectModal(false);
                                    setComments("");
                                }}
                                className="text-white text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-5">

                            <label className="block text-sm font-medium mb-2">
                                Comments
                            </label>

                            <textarea
                                rows={5}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="w-full border rounded-md p-3"
                                placeholder="Enter comments..."
                            />

                            <div className="flex justify-end gap-3 mt-5">

                                <button
                                    onClick={() => {
                                        setRejectModal(false);
                                        setComments("");
                                    }}
                                    className="border border-red-500 text-red-500 px-5 py-2 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        console.log(selectedRow);
                                        console.log(comments);

                                        setRejectModal(false);
                                        setComments("");
                                    }}
                                    className="bg-indigo-600 text-white px-5 py-2 rounded"
                                >
                                    Submit
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            )}

            {/* View Comments Popup */}

            {viewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-md rounded-lg bg-white overflow-hidden shadow-xl">

                        <div className="bg-indigo-600 flex justify-between items-center px-5 py-4">

                            <h2 className="text-white font-semibold text-lg">
                                View Reject Comments
                            </h2>

                            <button
                                onClick={() => setViewModal(false)}
                                className="text-white text-xl"
                            >
                                ×
                            </button>

                        </div>

                        <div className="p-5">

                            <label className="block text-sm font-medium mb-2">
                                Comments
                            </label>

                            <div className="border rounded-md p-4 bg-gray-50 min-h-[120px]">
                                {selectedRow?.rejectComment || "No reject comments available."}
                            </div>

                            <div className="flex justify-end mt-5">

                                <button
                                    onClick={() => setViewModal(false)}
                                    className="border border-red-500 text-red-500 px-5 py-2 rounded"
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}


        </div>
    );
}