import React, { useState } from "react";
import { Eye, Edit, Trash2, MoreVertical, X } from "lucide-react";

const Transportation = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    plateNumber: "",
    manufacturingYear: "",
    busNumber: "",
    vin: "",
    assignedRoute: "",
    licenseNumber: "",
    driverName: "",
    phoneNumber: "",
    morningStart: "",
    morningEnd: "",
    eveningStart: "",
    eveningEnd: "",
    isActive: false,
  });

  const mockTransportData = [
    {
      id: 1,
      sNo: 1,
      date: "02/01/2026",
      driverName: "Narayana",
      assignedRoute: "Kondapur",
      licenseNo: "MH-14-2011-0062821",
      morningShift: "06:00AM - 09:00AM",
      eveningShift: "04:00PM - 06:00PM",
      phoneNo: "9876543210",
      status: "Active",
      vehicleDetails: {
        model: "Mercedes-Benz Sprinter",
        plateNumber: "SCH-BUS-102",
        busNumber: "B101",
        manufacturingYear: "2022",
        vin: "1A2B3C4D5E6F7G8H9",
      },
    },
    {
      id: 2,
      sNo: 2,
      date: "02/01/2026",
      driverName: "Krishna",
      assignedRoute: "Gachibowli",
      licenseNo: "MH-14-2011-0062821",
      morningShift: "06:00AM - 09:00AM",
      eveningShift: "04:00PM - 06:00PM",
      phoneNo: "8765432101",
      status: "Inactive",
      vehicleDetails: {
        model: "Mercedes-Benz Sprinter",
        plateNumber: "SCH-BUS-102",
        busNumber: "B102",
        manufacturingYear: "2022",
        vin: "1A2B3C4D5E6F7G8H9",
      },
    },
    {
      id: 3,
      sNo: 3,
      date: "02/01/2026",
      driverName: "Harini",
      assignedRoute: "Manikonda",
      licenseNo: "MH-14-2011-0062821",
      morningShift: "06:00AM - 09:00AM",
      eveningShift: "04:00PM - 06:00PM",
      phoneNo: "9182736450",
      status: "Active",
      vehicleDetails: {
        model: "Mercedes-Benz Sprinter",
        plateNumber: "SCH-BUS-102",
        busNumber: "B103",
        manufacturingYear: "2022",
        vin: "1A2B3C4D5E6F7G8H9",
      },
    },
    {
      id: 4,
      sNo: 4,
      date: "02/01/2026",
      driverName: "Naresh",
      assignedRoute: "Raidurgam",
      licenseNo: "MH-14-2011-0062821",
      morningShift: "06:00AM - 09:00AM",
      eveningShift: "04:00PM - 06:00PM",
      phoneNo: "9281737545",
      status: "Inactive",
      vehicleDetails: {
        model: "Mercedes-Benz Sprinter",
        plateNumber: "SCH-BUS-102",
        busNumber: "B104",
        manufacturingYear: "2022",
        vin: "1A2B3C4D5E6F7G8H9",
      },
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleSave = () => {
    // API call would go here
    setFormData({
      model: "",
      plateNumber: "",
      manufacturingYear: "",
      busNumber: "",
      vin: "",
      assignedRoute: "",
      licenseNumber: "",
      driverName: "",
      phoneNumber: "",
      morningStart: "",
      morningEnd: "",
      eveningStart: "",
      eveningEnd: "",
      isActive: false,
    });

    setShowForm(false);
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = mockTransportData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(mockTransportData.length / rowsPerPage);

  return (
    <div className="page-wrap">
      {/* Header */}
      <h2 className="text-[18px] font-semibold text-[#333333]">Transportation</h2>
      <p className="text-[12px] text-gray-500 mb-6">Home / Transportation</p>

      {/* Add New Transport Button */}
      <div className="mb-6">
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add New Transport"}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="card-section">Add New Transport</h3>

          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* General Vehicle Specifications */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-4">General Vehicle Specifications</h4>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Model / Manufacturer</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="form-label">Plate Number</label>
                    <input
                      type="text"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="form-label">Manufacturing Year</label>
                    <input
                      type="text"
                      name="manufacturingYear"
                      value={formData.manufacturingYear}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="form-label">Bus Number</label>
                    <input
                      type="text"
                      name="busNumber"
                      value={formData.busNumber}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Route & Schedule Assignment */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-4">Route & Schedule Assignment</h4>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Driver Name</label>
                    <input
                      type="text"
                      name="driverName"
                      value={formData.driverName}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="form-label">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="form-label">Route Name</label>
                    <select
                      name="assignedRoute"
                      value={formData.assignedRoute}
                      onChange={handleInputChange}
                      className="form-select mt-1"
                    >
                      <option>Select Route</option>
                      <option>Kondapur</option>
                      <option>Gachibowli</option>
                      <option>Manikonda</option>
                      <option>Raidurgam</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Morning Shift Timings</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="--:--"
                    name="morningStart"
                    value={formData.morningStart}
                    onChange={handleInputChange}
                    className="form-input flex-1"
                  />
                  <span className="text-gray-700 font-medium">to</span>
                  <input
                    type="text"
                    placeholder="--:--"
                    name="morningEnd"
                    value={formData.morningEnd}
                    onChange={handleInputChange}
                    className="form-input flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Evening Shift Timings</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="--:--"
                    name="eveningStart"
                    value={formData.eveningStart}
                    onChange={handleInputChange}
                    className="form-input flex-1"
                  />
                  <span className="text-gray-700 font-medium">to</span>
                  <input
                    type="text"
                    placeholder="--:--"
                    name="eveningEnd"
                    value={formData.eveningEnd}
                    onChange={handleInputChange}
                    className="form-input flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Checkbox and Save Button */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded accent-brand-600"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                Active
              </label>
            </div>
            <button onClick={handleSave} className="btn-primary">
              Save
            </button>
          </div>
        </div>
      )}

      {/* Transport Lists */}
      <div className="card">
        <h3 className="card-section">Transport Lists</h3>

        {/* Filter Row */}
        <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Driver Name"
            className="form-input"
          />
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            className="form-input"
          />
          <select className="form-select">
            <option>Route</option>
          </select>
          <select className="form-select">
            <option>Status</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] sm:text-[13px]">
            <thead className="thead-row">
              <tr>
                <th className="px-4 py-3 text-left min-w-[50px]">S.No.</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Date</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Driver Name</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Route Name</th>
                <th className="px-4 py-3 text-left min-w-[140px]">License No.</th>
                <th className="px-4 py-3 text-left min-w-[130px]">Morning Shift</th>
                <th className="px-4 py-3 text-left min-w-[130px]">Evening Shift</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Phone No.</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Vehicle Details</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Status</th>
                <th className="px-4 py-3 text-left min-w-[80px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{item.sNo}</td>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.driverName}</td>
                  <td className="px-4 py-3">{item.assignedRoute}</td>
                  <td className="px-4 py-3">{item.licenseNo}</td>
                  <td className="px-4 py-3">{item.morningShift}</td>
                  <td className="px-4 py-3">{item.eveningShift}</td>
                  <td className="px-4 py-3">{item.phoneNo}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <span className="text-[12px] text-gray-600">
            Page: <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn-primary disabled:opacity-50"
            >
              Next
            </button>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              className="form-select"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-lg">
            {/* Modal Header with Blue Background */}
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-semibold">Vehicle Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-blue-700 p-1 rounded transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Modal / Manufacture</label>
                  <p className="text-sm text-gray-600">{selectedVehicle.vehicleDetails.model}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Manufacturing Year</label>
                  <p className="text-sm text-gray-600">{selectedVehicle.vehicleDetails.manufacturingYear}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Vehicle Plate Number</label>
                  <p className="text-sm text-gray-600">{selectedVehicle.vehicleDetails.plateNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Bus Number</label>
                  <p className="text-sm text-gray-600">{selectedVehicle.vehicleDetails.busNumber}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-red-500 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transportation;
