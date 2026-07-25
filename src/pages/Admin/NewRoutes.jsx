import React, { useState } from "react";
import { Trash2, MoreVertical, X, Plus } from "lucide-react";

const NewRoutes = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    startPoint: "",
    endPoint: "",
    routeName: "",
    routeStops: ["", "", "", ""],
    isActive: false,
  });

  const handleAddRouteStop = () => {
    setFormData({
      ...formData,
      routeStops: [...formData.routeStops, ""],
    });
  };

  const mockRoutesData = [
    {
      id: 1,
      sNo: 1,
      date: "02/01/2026",
      startPoint: "Ameerpet",
      endPoint: "Kondapur",
      routeName: "Ameerpet",
      routeStop: "Madhapur",
      status: "Active",
    },
    {
      id: 2,
      sNo: 2,
      date: "02/01/2026",
      startPoint: "Ameerpet",
      endPoint: "KPHB",
      routeName: "Kukatpally",
      routeStop: "Bharat Nagar",
      status: "Inactive",
    },
    {
      id: 3,
      sNo: 3,
      date: "02/01/2026",
      startPoint: "Ameerpet",
      endPoint: "Manikonda",
      routeName: "Hi-Tech City",
      routeStop: "Bio-diversity Park",
      status: "Active",
    },
    {
      id: 4,
      sNo: 4,
      date: "02/01/2026",
      startPoint: "Ameerpet",
      endPoint: "Raidurgam",
      routeName: "Manikonda",
      routeStop: "Jubllie Hills Check post",
      status: "Inactive",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRouteStopChange = (index, value) => {
    const newStops = [...formData.routeStops];
    newStops[index] = value;
    setFormData({ ...formData, routeStops: newStops });
  };

  const handleSave = () => {
    // API call would go here
    setFormData({
      startPoint: "",
      endPoint: "",
      routeName: "",
      routeStops: ["", "", "", ""],
      isActive: false,
    });
    setShowForm(false);
  };

  const handleDeleteRoute = (index) => {
    const newStops = formData.routeStops.filter((_, i) => i !== index);
    setFormData({ ...formData, routeStops: newStops });
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = mockRoutesData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(mockRoutesData.length / rowsPerPage);

  return (
    <div className="page-wrap">
      {/* Header */}
      <h2 className="text-[18px] font-semibold text-[#333333]">New Routes</h2>
      <p className="text-[12px] text-gray-500 mb-6">Home / Transportation / New Routes</p>

      {/* Add New Routes Button */}
      <div className="mb-6">
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add New Routes"}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="card-section">Add New Routes</h3>
          
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">General Vehicle Specifications</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="form-label">Start Point</label>
                <input
                  type="text"
                  name="startPoint"
                  value={formData.startPoint}
                  onChange={handleInputChange}
                  className="form-input mt-1"
                />
              </div>
              <div>
                <label className="form-label">End Point</label>
                <input
                  type="text"
                  name="endPoint"
                  value={formData.endPoint}
                  onChange={handleInputChange}
                  className="form-input mt-1"
                />
              </div>
              <div>
                <label className="form-label">Route Name</label>
                <input
                  type="text"
                  name="routeName"
                  value={formData.routeName}
                  onChange={handleInputChange}
                  className="form-input mt-1"
                />
              </div>
            </div>

            {/* Route Stops Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <table className="w-full text-[12px]">
                <thead className="thead-row">
                  <tr>
                    <th className="px-4 py-3 text-left">S.No.</th>
                    <th className="px-4 py-3 text-left">Route Stop</th>
                    <th className="px-4 py-3 text-center" style={{ width: "50px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.routeStops.map((stop, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={stop}
                          onChange={(e) => handleRouteStopChange(idx, e.target.value)}
                          className="form-input w-full"
                          placeholder="Enter route stop"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {formData.routeStops.length > 1 || stop !== "" ? (
                          <button
                            onClick={() => handleDeleteRoute(idx)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={handleAddRouteStop}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Plus size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Route Stop Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleAddRouteStop}
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition text-sm font-medium"
              >
                <Plus size={18} />
                Add Route Stop
              </button>
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
            placeholder="dd/mm/yyyy"
            className="form-input"
          />
          <select className="form-select">
            <option>Route</option>
          </select>
          <select className="form-select">
            <option>Status</option>
          </select>
          <div></div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] sm:text-[13px]">
            <thead className="thead-row">
              <tr>
                <th className="px-4 py-3 text-left min-w-[50px]">S.No.</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Date</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Start Point</th>
                <th className="px-4 py-3 text-left min-w-[120px]">End Point</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Route Name</th>
                <th className="px-4 py-3 text-left min-w-[120px]">Route Stop</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Status</th>
                <th className="px-4 py-3 text-left min-w-[80px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{item.sNo}</td>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.startPoint}</td>
                  <td className="px-4 py-3">{item.endPoint}</td>
                  <td className="px-4 py-3">{item.routeName}</td>
                  <td className="px-4 py-3">{item.routeStop}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === "Active"
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
    </div>
  );
};

export default NewRoutes;
