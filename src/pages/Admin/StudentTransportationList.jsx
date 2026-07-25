import React, { useState } from "react";
import {
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const transportationData = [
    {
        id: 1,
        rollNo: "001",
        studentName: "Dellip",
        classSection: "10-A",
        date: "21-03-2009",
        busNo: "B101",
        pickupRoute: "Hi-Tech City",
        pickupStop: "Madhapur",
        dropRoute: "Hi-Tech City",
        dropStop: "Madhapur",
        driverName: "Dellip",
    },
    {
        id: 2,
        rollNo: "002",
        studentName: "Naveen Kumar",
        classSection: "9-B",
        date: "21-03-2009",
        busNo: "B102",
        pickupRoute: "Gachibowli",
        pickupStop: "Botanical Gardens",
        dropRoute: "Gachibowli",
        dropStop: "Botanical Gardens",
        driverName: "Naveen",
    },
    {
        id: 3,
        rollNo: "003",
        studentName: "Surya Kumar",
        classSection: "6-A",
        date: "21-03-2009",
        busNo: "B103",
        pickupRoute: "KPHB",
        pickupStop: "Kukatpally",
        dropRoute: "KPHB",
        dropStop: "Kukatpally",
        driverName: "Surya",
    },
    {
        id: 4,
        rollNo: "004",
        studentName: "Surya",
        classSection: "7-A",
        date: "21-03-2007",
        busNo: "B104",
        pickupRoute: "KPHB",
        pickupStop: "Kukatpally",
        dropRoute: "KPHB",
        dropStop: "Kukatpally",
        driverName: "Sanjay",
    },
    {
        id: 5,
        rollNo: "005",
        studentName: "Kumar",
        classSection: "6-A",
        date: "21-03-2009",
        busNo: "B103",
        pickupRoute: "Hi-Tech City",
        pickupStop: "Madhapur",
        dropRoute: "Hi-Tech City",
        dropStop: "Madhapur",
        driverName: "Sravan",
    },
    {
        id: 6,
        rollNo: "006",
        studentName: "Praveen Kumar",
        classSection: "6-A",
        date: "21-03-2009",
        busNo: "B102",
        pickupRoute: "KPHB",
        pickupStop: "Kukatpally",
        dropRoute: "KPHB",
        dropStop: "Kukatpally",
        driverName: "Somesh",
    },
    {
        id: 7,
        rollNo: "007",
        studentName: "Udhay",
        classSection: "7-A",
        date: "21-03-2009",
        busNo: "B101",
        pickupRoute: "Gachibowli",
        pickupStop: "Botanical Gardens",
        dropRoute: "Gachibowli",
        dropStop: "Botanical Gardens",
        driverName: "Bhargav",
    },
];

export default function StudentTransportationList() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedBus, setSelectedBus] = useState("");
    const [selectedDriver, setSelectedDriver] = useState("");
    const [openMenu, setOpenMenu] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedTransport, setSelectedTransport] = useState(null);

    const handleView = (row) => {
        setSelectedTransport({
            ...row,
            admissionNo: "00001",
            parentName: "Nagendra",
            parentMobile: "9876543210",

            pickupLandmark: "Madhapur Metro pill no. 1019",
            pickupAddress: "Gachibowli, Hyderabad, Telangana",
            pickupTime: "06:00 AM",
            pickupGps: "34.0522° N, 118.2437° W",

            dropLandmark: "Madhapur Metro pill no. 1019",
            dropAddress: "Gachibowli, Hyderabad, Telangana",
            dropTime: "06:00 AM",
            dropGps: "34.0522° N, 118.2437° W",

            vehicleNo: "TS091234",
            driverMobile: "92876524101",
            licenseNo: "ACZ728030222",
        });

        setViewModal(true);
        setOpenMenu(null);
    };

    const handleEdit = (row) => {
        const editData = {
            admissionNo: "00001",
            studentName: row.studentName,
            classSection: row.classSection,
            rollNo: row.rollNo,

            parentName: "Nagendra",
            parentMobile: "9876543210",

            pickupRoute: row.pickupRoute,
            pickupStop: row.pickupStop,
            pickupLandmark: "Madhapur Metro pill no. 1019",
            pickupAddress: "Gachibowli, Hyderabad, Telangana",
            pickupTime: "09:45",
            pickupGps: "34.0522° N, 118.2437° W",

            dropRoute: row.dropRoute,
            dropStop: row.dropStop,
            dropLandmark: "Madhapur Metro pill no. 1019",
            dropAddress: "Gachibowli, Hyderabad, Telangana",
            dropTime: "09:45",
            dropGps: "34.0522° N, 118.2437° W",

            busNo: row.busNo,
            vehicleNo: "TS091234",
            driverName: row.driverName,
            driverMobile: "9876543210",
            licenseNo: "ACZ728030222",
        };

        navigate("/student-transportation", {
            state: editData,
        });
    };

    const handleDelete = (row) => {
        toast.success(`${row.studentName} Deleted`);
    };

    const filteredData = transportationData.filter((item) =>
        item.studentName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white p-2">

            {/* HEADER */}
            <h1 className="text-2xl font-bold text-[#222]">
                Student Transportation List
            </h1>

            <p className="text-[12px] text-[#666] mb-4">
                Home / Transportation / Student Transportation List
            </p>

            <div className="bg-white border border-[#d9d9d9] rounded shadow-sm">

                {/* CARD HEADER */}
                <div className="border-b border-[#d9d9d9] px-4 py-3">
                    <h2 className="text-xm font-semibold">
                        Student Transport List
                    </h2>
                </div>

                <div className="p-4">

                    {/* FILTERS */}
                    <div className="flex flex-wrap justify-end gap-3 mb-4">

                        <input
                            type="text"
                            placeholder="Search Student Name / Roll Number"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-[220px] h-9 border border-gray-300 rounded px-3 text-xs"
                        />

                        <select
                            value={selectedDriver}
                            onChange={(e) => setSelectedDriver(e.target.value)}
                            className="w-[100px] h-9 border border-gray-300 rounded px-2 text-xs"
                        >
                            <option>Select Driver</option>
                        </select>

                        <select
                            value={selectedBus}
                            onChange={(e) => setSelectedBus(e.target.value)}
                            className="w-[100px] h-9 border border-gray-300 rounded px-2 text-xs"
                        >
                            <option>Bus No.</option>
                        </select>

                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-[100px] h-9 border border-gray-300 rounded px-2 text-xs"
                        >
                            <option>Select Class</option>
                        </select>

                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto border border-gray-200 rounded">

                        <table className="w-full min-w-[1400px]">

                            <thead>
                                <tr className="bg-indigo-50">

                                    {[
                                        "S.No.",
                                        "Roll No.",
                                        "Student Name",
                                        "Class / Section",
                                        "Date",
                                        "Bus No.",
                                        "Pickup Route",
                                        "Pickup Stop",
                                        "Drop Route",
                                        "Drop Stop",
                                        "Driver Name",
                                        "Action",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="border border-gray-300 px-3 py-3 text-left text-xs font-semibold text-[#334155]"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>

                                {filteredData.map((row, index) => (

                                    <tr key={row.id}>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {index + 1}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.rollNo}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.studentName}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.classSection}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.date}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.busNo}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.pickupRoute}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.pickupStop}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.dropRoute}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.dropStop}
                                        </td>

                                        <td className="border border-gray-300 px-3 py-2 text-xs">
                                            {row.driverName}
                                        </td>

                                        {/* ACTION */}
                                        <td className="border border-gray-300 px-3 py-2 text-center relative">

                                            <button
                                                onClick={() =>
                                                    setOpenMenu(
                                                        openMenu === row.id ? null : row.id
                                                    )
                                                }
                                            >
                                                <MoreVertical size={16} />
                                            </button>

                                            {openMenu === row.id && (
                                                <div className="absolute right-4 top-8 bg-white border rounded shadow-lg z-50 w-32">

                                                    <button
                                                        onClick={() => handleView(row)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100"
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </button>

                                                    <button
                                                        onClick={() => handleEdit(row)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100"
                                                    >
                                                        <Pencil size={14} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(row)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-red-50 text-red-600"
                                                    >
                                                        <Trash2 size={14} />
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

                    {/* PAGINATION */}
                    <div className="flex justify-end items-center gap-2 mt-4">

                        <button className="border px-3 py-1 text-xs rounded bg-white">
                            <ChevronLeft size={14} />
                        </button>

                        <button className="bg-indigo-600 text-white px-3 py-1 text-xs rounded">
                            1
                        </button>

                        <button className="border px-3 py-1 text-xs rounded bg-white">
                            <ChevronRight size={14} />
                        </button>

                        <span className="text-xs text-gray-600 ml-2">
                            Page: 1 of 1
                        </span>

                    </div>

                </div>
            </div>
            {viewModal && selectedTransport && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

                    <div className="bg-white w-[90%] max-w-6xl rounded-lg shadow-lg">

                        <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between">
                            <h2 className="font-semibold">
                                View Details
                            </h2>

                            <button onClick={() => setViewModal(false)}>
                                ✕
                            </button>
                        </div>

                        <div className="p-4 max-h-[80vh] overflow-y-auto">

                            <div className="border border-gray-300 rounded">

                                <div className="border-b border-gray-300 px-4 py-2 font-semibold">
                                    Student Information
                                </div>

                                <div className="grid grid-cols-4 gap-4 p-4 text-sm">

                                    <div>
                                        <label className="font-medium">
                                            Admission Number
                                        </label>
                                        <p>{selectedTransport.admissionNo}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            Student Name
                                        </label>
                                        <p>{selectedTransport.studentName}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            Class / Section
                                        </label>
                                        <p>{selectedTransport.classSection}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            Roll Number
                                        </label>
                                        <p>{selectedTransport.rollNo}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            Parent Name
                                        </label>
                                        <p>{selectedTransport.parentName}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            Parent Mobile
                                        </label>
                                        <p>{selectedTransport.parentMobile}</p>
                                    </div>

                                </div>
                            </div>

                            {/* Pickup / Drop */}

                            <div className="grid grid-cols-2 gap-4 mt-4">

                                <div className="border border-gray-300 rounded p-4">
                                    <h3 className="font-semibold mb-4">
                                        Pickup Details
                                    </h3>

                                    <div className="space-y-3 text-sm">
                                        <p>
                                            <strong>Route:</strong>{" "}
                                            {selectedTransport.pickupRoute}
                                        </p>

                                        <p>
                                            <strong>Stop:</strong>{" "}
                                            {selectedTransport.pickupStop}
                                        </p>

                                        <p>
                                            <strong>Landmark:</strong>{" "}
                                            {selectedTransport.pickupLandmark}
                                        </p>

                                        <p>
                                            <strong>Address:</strong>{" "}
                                            {selectedTransport.pickupAddress}
                                        </p>

                                        <p>
                                            <strong>Time:</strong>{" "}
                                            {selectedTransport.pickupTime}
                                        </p>

                                        <p>
                                            <strong>GPS:</strong>{" "}
                                            {selectedTransport.pickupGps}
                                        </p>
                                    </div>
                                </div>

                                <div className="border border-gray-300 rounded p-4">
                                    <h3 className="font-semibold mb-4">
                                        Drop Details
                                    </h3>

                                    <div className="space-y-3 text-sm">
                                        <p>
                                            <strong>Route:</strong>{" "}
                                            {selectedTransport.dropRoute}
                                        </p>

                                        <p>
                                            <strong>Stop:</strong>{" "}
                                            {selectedTransport.dropStop}
                                        </p>

                                        <p>
                                            <strong>Landmark:</strong>{" "}
                                            {selectedTransport.dropLandmark}
                                        </p>

                                        <p>
                                            <strong>Address:</strong>{" "}
                                            {selectedTransport.dropAddress}
                                        </p>

                                        <p>
                                            <strong>Time:</strong>{" "}
                                            {selectedTransport.dropTime}
                                        </p>

                                        <p>
                                            <strong>GPS:</strong>{" "}
                                            {selectedTransport.dropGps}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="border border-gray-300 rounded mt-4">

                                <div className="border-b border-gray-300 px-4 py-2 font-semibold">
                                    Driver & Vehicle Details
                                </div>

                                <div className="grid grid-cols-4 gap-4 p-4 text-sm">

                                    <div>
                                        <label className="font-medium">
                                            Bus Number
                                        </label>

                                        <p>{selectedTransport.busNo}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            Vehicle Plate Number
                                        </label>

                                        <p>{selectedTransport.vehicleNo}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            Driver Name
                                        </label>

                                        <p>{selectedTransport.driverName}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            Driver Mobile No.
                                        </label>

                                        <p>{selectedTransport.driverMobile}</p>
                                    </div>

                                    <div>
                                        <label className="font-medium">
                                            License No.
                                        </label>

                                        <p>{selectedTransport.licenseNo}</p>
                                    </div>

                                </div>

                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setViewModal(false)}
                                    className="border border-red-500 text-red-500 px-6 py-2 rounded"
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