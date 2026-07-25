import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeesStatusAsync,
  getClassesAsync,
} from "../../features/Admin/FeesStatus/feesStatusSlice";
import Pagination from "../../components/common/Pagination";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AdminFeesStatus() {
  const dispatch = useDispatch();

  const { feesStatusList, classes, loading } = useSelector(
    (state) => state.feesStatus,
  );

  const [filters, setFilters] = useState({
    studentName: "",
    startDate: "",
    endDate: "",
    classId: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch classes once
  useEffect(() => {
    dispatch(getClassesAsync());
  }, [dispatch]);

  // Auto search when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      dispatch(getFeesStatusAsync(filters));
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, dispatch]);

  const allFeesData = Array.isArray(feesStatusList)
    ? feesStatusList
    : feesStatusList?.content || [];

  const totalPages = Math.ceil(allFeesData.length / rowsPerPage) || 1;

  const feesData = allFeesData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleReset = () => {
    const resetFilters = {
      studentName: "",
      startDate: "",
      endDate: "",
      classId: "",
      status: "",
    };

    setFilters(resetFilters);
    setCurrentPage(1);
    setRowsPerPage(10);

    dispatch(getFeesStatusAsync(resetFilters));
  };
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      width: "150px",
      minHeight: "30px",
      height: "30px",
      borderColor: "#e5e7eb",
      boxShadow: "none",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "30px",
      padding: "0 12px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "30px",
    }),
  };

  return (
    <div className="min-h-screen bg-white p-2 sm:p-6">
      <h1 className="text-xl font-bold text-gray-800">Fees Status</h1>
      <p className="text-gray-500 mt-1">Fees Management / Fees Status</p>

      <div className="bg-white rounded-lg shadow mt-4 border border-gray-200">
        <div className="border-b border-gray-200 px-3 py-2">
          <h3 className="font-semibold text-gray-700">Fees Status List</h3>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 flex flex-wrap  gap-1.5 ">
          {/* Search */}
          <input
            type="text"
            placeholder="Search "
            value={filters.studentName}
            onChange={(e) =>
              setFilters({
                ...filters,
                studentName: e.target.value,
              })
            }
            className="border border-gray-200 rounded px-4 h-[30px] w-[150px] shrink-0"
          />

          {/* Start Date */}
          <DatePicker
            selected={filters.startDate ? new Date(filters.startDate) : null}
            onChange={(date) =>
              setFilters({
                ...filters,
                startDate: date ? date.toISOString().split("T")[0] : "",
              })
            }
            placeholderText="From Date"
            dateFormat="MM/dd/yyyy"
            className="border border-gray-200 rounded px-4 h-[30px] w-[150px] shrink-0"
            wrapperClassName="w-[150px] shrink-0"
            popperPlacement="bottom-start"
          />

          {/* End Date */}
          <DatePicker
            selected={filters.endDate ? new Date(filters.endDate) : null}
            onChange={(date) =>
              setFilters({
                ...filters,
                endDate: date ? date.toISOString().split("T")[0] : "",
              })
            }
            placeholderText="To Date"
            dateFormat="MM/dd/yyyy"
            className="border border-gray-200 rounded px-4 h-[30px] w-[150px] shrink-0"
            wrapperClassName="w-[150px] shrink-0"
            popperPlacement="bottom-start"
          />

          {/* Class */}
          <div className="w-[150px]  shrink-0 ">
            <Select
              styles={customSelectStyles}
              options={classes?.map((cls) => ({
                value: cls.classId || cls.id,
                label: cls.classCode || cls.className,
              }))}
              value={
                classes
                  ?.map((cls) => ({
                    value: cls.classId || cls.id,
                    label: cls.classCode || cls.className,
                  }))
                  .find((opt) => opt.value === filters.classId) || null
              }
              onChange={(selected) =>
                setFilters({
                  ...filters,
                  classId: selected ? selected.value : "",
                })
              }
              placeholder="Select Class"
            />
          </div>

          {/* Status */}
          <div className="w-[150px]  shrink-0 text-transform:lowercase">
            <Select
              styles={customSelectStyles}
              options={[
                { value: "COMPLETED", label: "Completed" },
                { value: "PENDING", label: "Pending" },
              ]}
              value={
                filters.status
                  ? {
                      value: filters.status,
                      label:
                        filters.status === "COMPLETED" ||
                        filters.status === "Completed"
                          ? "Completed"
                          : "Pending",
                    }
                  : null
              }
              onChange={(selected) =>
                setFilters({
                  ...filters,
                  status: selected ? selected.value : "",
                })
              }
              placeholder="Status"
            />
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="h-[30px] w-[80px] rounded border border-red-500 text-red-500 shrink-0"
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <div className="px-6 pb-6 overflow-x-auto">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <table className="w-full border-collapse border-gray-200">
              <thead>
                <tr className="bg-blue-50 text-gray-700 text-xs">
                  <th className="p-3 text-left">S.No.</th>
                  <th className="p-3 text-left">Trans ID</th>
                  <th className="p-3 text-left">Roll Number</th>
                  <th className="p-3 text-left">Student Name</th>
                  <th className="p-3 text-left">Class</th>
                  <th className="p-3 text-left">Trans Date</th>
                  <th className="p-3 text-left">Fees Type</th>
                  <th className="p-3 text-left">Installments</th>
                  <th className="p-3 text-left">Paid Amount</th>
                  <th className="p-3 text-left">Balance Amount</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {feesData.length > 0 ? (
                  feesData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 text-xs text-gray-700"
                    >
                      <td className="p-3">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="p-3">{item.transactionId}</td>
                      <td className="p-3">{item.rollNumber || item.rollNo}</td>
                      <td className="p-3">{item.studentName}</td>
                      <td className="p-3">{item.className || item.class}</td>
                      <td className="p-3">{item.transactionDate}</td>
                      <td className="p-3">{item.feeType || "-"}</td>
                      <td className="p-3">{item.installment || "-"}</td>
                      <td className="p-3">{item.paidAmount}</td>
                      <td className="p-3">{item.balanceAmount}</td>
                      <td className="p-3">
                        <span
                          className={`px-4 py-1 rounded-full text-xs ${
                            item.status === "COMPLETED" ||
                            item.status === "Completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4 text-gray-500">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
