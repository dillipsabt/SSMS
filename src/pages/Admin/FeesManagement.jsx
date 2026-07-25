import React, { useState } from "react";
import { Search, Bell, Mail, User, ChevronDown, Trash2, Edit } from "lucide-react";


const FeesManagement = () => {
  const [activeTab, setActiveTab] = useState("fees-configure");
  const [formData, setFormData] = useState({
    adminName: "",
    class: "",
    admissionFees: "",
    schoolFees: "",
    booksFees: "",
    labFees: "",
  });

  const [feesData, setFeesData] = useState([
    {
      id: 1,
      createdDate: "01/04/2028",
      adminName: "Rajesh",
      class: "Class 8",
      admissionFees: 1500,
      schoolFees: 60000,
      booksFees: 10000,
      labFees: 2000,
    },
    {
      id: 2,
      createdDate: "14/03/2028",
      adminName: "Rajesh",
      class: "Class 9",
      admissionFees: 1500,
      schoolFees: 80000,
      booksFees: 10200,
      labFees: 4000,
    },
    {
      id: 3,
      createdDate: "01/03/2028",
      adminName: "Rajesh",
      class: "Class 10",
      admissionFees: 1500,
      schoolFees: 100000,
      booksFees: 10800,
      labFees: 5000,
    },
  ]);

  const [studentFormData, setStudentFormData] = useState({
    rollNumber: "1028354",
    studentName: "Kishore",
    class: "8",
    transactionDate: "22/04/2026",
  });

  const [paymentData, setPaymentData] = useState({
    feesType: "School Fees",
    billingSelection: "Monthly",
    instalments: "Jan",
    amount: 5000,
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveConfig = () => {
    alert("Fees configuration saved!");
  };

  const handlePayment = () => {
    alert("Payment processed!");
  };

  return (
    <div className="min-h-screen bg-gray-100 fees-management-container">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-40 fees-header">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:w-64 header-search">
          <Search className="text-gray-400 flex-shrink-0" size={16} />
          <input type="text" placeholder="Search" className="outline-none text-xs sm:text-sm text-gray-600 bg-transparent w-full search-input-mobile" />
        </div>
        <div className="flex items-center gap-3 sm:gap-5 header-icons">
          <Mail className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20} />
          <div className="relative">
            <Bell className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </div>
          <User className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 fees-main-content">
        {/* Tabs */}
        <div className="flex gap-3 sm:gap-6 mb-6 border-b border-gray-200 fees-tabs overflow-x-auto">
          <button
            onClick={() => setActiveTab("fees-configure")}
            className={`pb-3 font-medium transition tab-button ${
              activeTab === "fees-configure"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Fees Configure
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`pb-3 font-medium transition tab-button ${
              activeTab === "fees"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Fees
          </button>
        </div>

        {/* Fees Configure Tab */}
        {activeTab === "fees-configure" && (
          <div>
            <div className="mb-6">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 page-title">Fees Configure</h1>
              <p className="text-xs sm:text-sm text-gray-500 page-subtitle">Fees Management / Fees Configure</p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 fees-card">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 card-title">Add Fees Configure</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 fees-form-grid-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name *</label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleFormChange}
                    placeholder="Admin name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admission Fees *</label>
                  <input
                    type="number"
                    name="admissionFees"
                    value={formData.admissionFees}
                    onChange={handleFormChange}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Fees *</label>
                  <input
                    type="number"
                    name="schoolFees"
                    value={formData.schoolFees}
                    onChange={handleFormChange}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 fees-form-grid-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Books Fees *</label>
                  <input
                    type="number"
                    name="booksFees"
                    value={formData.booksFees}
                    onChange={handleFormChange}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lab Fees *</label>
                  <input
                    type="number"
                    name="labFees"
                    value={formData.labFees}
                    onChange={handleFormChange}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveConfig}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition float-right fees-button text-sm sm:text-base"
              >
                📋 Save
              </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 fees-card">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 search-row">
                <p className="text-xs sm:text-sm text-gray-600 date-range-text">01/03/2025 - 30/10/2025</p>
                <input
                  type="text"
                  placeholder="Search"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 search-input"
                />
              </div>

              <div className="overflow-x-auto fees-table-wrapper">
                <table className="w-full text-xs sm:text-sm fees-table min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">S.No.</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">Created Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">Admin Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">Class</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">Admission Fees</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">School Fees</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">Books Fees</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">Lab Fees</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 table-header">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(feesData || []).map((row, idx) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800 table-cell">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-800 table-cell">{row.createdDate}</td>
                        <td className="px-4 py-3 text-gray-800 table-cell">{row.adminName}</td>
                        <td className="px-4 py-3 text-gray-800 table-cell">{row.class}</td>
                        <td className="px-4 py-3 text-gray-800 table-cell">{row.admissionFees}</td>
                        <td className="px-4 py-3 text-gray-800 table-cell">{row.schoolFees}</td>
                        <td className="px-4 py-3 text-gray-800 table-cell">{row.booksFees}</td>
                        <td className="px-4 py-3 text-gray-800 table-cell">{row.labFees}</td>
                        <td className="px-4 py-3 text-gray-800 table-cell">
                          <div className="flex gap-2">
                            <Edit className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800 action-icon" />
                            <Trash2 className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-800 action-icon" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === "fees" && (
          <div>
            <div className="mb-6">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 page-title">Fees</h1>
              <p className="text-xs sm:text-sm text-gray-500 page-subtitle">Fees Management / Fees</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 fees-main-grid">
              {/* Left Column - Student & Payment Details */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6 fees-left-column">
                {/* Student Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 fees-card">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 card-title">Student Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 student-form-grid">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                      <input
                        type="text"
                        name="rollNumber"
                        value={studentFormData.rollNumber}
                        onChange={handleStudentFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student name *</label>
                      <input
                        type="text"
                        name="studentName"
                        value={studentFormData.studentName}
                        onChange={handleStudentFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                      <input
                        type="text"
                        name="class"
                        value={studentFormData.class}
                        onChange={handleStudentFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Date *</label>
                      <input
                        type="text"
                        name="transactionDate"
                        value={studentFormData.transactionDate}
                        onChange={handleStudentFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 fees-card">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 card-title">Payment</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 payment-form-grid">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fees Type</label>
                      <select
                        name="feesType"
                        value={paymentData.feesType}
                        onChange={handlePaymentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option>School Fees</option>
                        <option>Admission Fees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Billing Selection</label>
                      <select
                        name="billingSelection"
                        value={paymentData.billingSelection}
                        onChange={handlePaymentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Yearly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instalments</label>
                      <select
                        name="instalments"
                        value={paymentData.instalments}
                        onChange={handlePaymentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option>Jan</option>
                        <option>Feb</option>
                        <option>Mar</option>
                        <option>Apr</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={paymentData.amount}
                        onChange={handlePaymentChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Financial Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:h-fit fees-card fees-right-column financial-summary">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 card-title">Financial Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center summary-item">
                    <span className="text-gray-700 font-medium summary-label">Total Amount</span>
                    <span className="text-gray-800 font-bold summary-value">₹10000</span>
                  </div>
                  <div className="flex justify-between items-center summary-item">
                    <span className="text-gray-700 font-medium summary-label">Charges</span>
                    <span className="text-gray-800 font-bold summary-value">₹00.00</span>
                  </div>
                  <div className="flex justify-between items-center summary-item">
                    <span className="text-gray-700 font-medium summary-label">Include GST</span>
                    <span className="text-gray-800 font-bold summary-value">5%</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between items-center summary-item">
                    <span className="text-gray-700 font-medium summary-label">Net Amount</span>
                    <span className="text-gray-800 font-bold summary-value">₹14000</span>
                  </div>
                  <div className="flex justify-between items-center summary-item">
                    <span className="text-gray-700 font-medium summary-label">Payment Mode</span>
                    <select className="px-2 py-1 border border-gray-300 rounded text-sm form-select">
                      <option>Select Mode</option>
                      <option>Online</option>
                      <option>Cash</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition fees-button btn-full-width"
                >
                  💳 Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesManagement;
