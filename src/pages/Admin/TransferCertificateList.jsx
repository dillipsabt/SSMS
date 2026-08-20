import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import TransferCertificatePreview from "./TransferCertificatePreview";
import useToastMessage from "../../utils/useToastMessage";
import {
  getTransferCertificatesAsync,
  deleteTransferCertificateAsync,
  getTransferCertificateByIdAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/TransferCertificate/transferCertificateSlice";

const TransferCertificateList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    certificateList,
    pagination,
    loading,
    success,
    error,
    successMessage,
  } = useSelector((state) => state.transferCertificate);

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [search, setSearch] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Clear stale messages on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
      ...(search && { search }),
      ...(issueDate && { issueDate }),
    };
    dispatch(getTransferCertificatesAsync(params));
  }, [dispatch, currentPage, rowsPerPage, search, issueDate]);

  useToastMessage({
    success,
    error,
    successMessage: "Transfer certificate deleted successfully! ✅",
    clearSuccess,
    clearError,
    onSuccess: () => {
      const params = {
        page: currentPage - 1,
        size: rowsPerPage,
        ...(search && { search }),
        ...(issueDate && { issueDate }),
      };
      dispatch(getTransferCertificatesAsync(params));
    },
  });

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    dispatch(deleteTransferCertificateAsync(selectedId));
    setDeleteModal(false);
    setSelectedId(null);
  };

  const handlePreview = (item) => {
    dispatch(getTransferCertificateByIdAsync(item.id)).then((action) => {
      if (action.payload) {
        const data = action.payload;
        setPreviewData({
          studentName: data.studentName || item.studentName,
          fatherName: data.fatherName || item.fatherName,
          admissionNo: data.admissionNo || item.admissionNo,
          classSection: data.classSection || item.classSection,
          dateOfBirth: data.dateOfBirth || item.dateOfBirth,
          dateOfLeaving: data.dateOfLeaving || item.dateOfLeaving,
          reasonForLeaving: data.reasonForLeaving || item.reasonForLeaving,
          dateOfIssue: data.issueDate || item.issueDate,
          schoolName: data.schoolName || "Sri Chaitanya E-Techno School",
          schoolAddress: data.schoolAddress,
          tcNumber: data.tcNumber,
          penNumber: data.penNumber,
        });
        setShowPreview(true);
      }
    });
    setOpenMenu(null);
  };

  const handleEdit = (id) => {
    navigate(`/issue-transfer-certificate/${id}`);
  };

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Transfer Certificate
      </h2>
      <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">
        Transfer Certificate / Transfer Certificate List
      </p>

      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Transfer Certificate List
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-[250px]">
              <input
                type="text"
                placeholder="Search admission no./student Name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 border border-gray-300 rounded-md px-3 pr-10 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Date Filter */}
            <input
              type="date"
              value={issueDate}
              onChange={(e) => {
                setIssueDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[160px] h-10 border border-gray-300 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden lg:block border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left">S.No.</th>
                <th className="px-3 py-2 text-left">Admission No.</th>
                <th className="px-3 py-2 text-left">Student Name</th>
                <th className="px-3 py-2 text-left">Class / Section</th>
                <th className="px-3 py-2 text-left">Father Name</th>
                <th className="px-3 py-2 text-left">Date Of Birth</th>
                <th className="px-3 py-2 text-left">Date of Leaving</th>
                <th className="px-3 py-2 text-left">Reason for Leaving</th>
                <th className="px-3 py-2 text-left">Date Of Issue TC</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {(certificateList || []).map((item, i) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">
                    {(currentPage - 1) * rowsPerPage + i + 1}
                  </td>
                  <td className="px-3 py-2">{item.admissionNo}</td>
                  <td className="px-3 py-2">{item.studentName}</td>
                  <td className="px-3 py-2">{item.classSection}</td>
                  <td className="px-3 py-2">{item.fatherName}</td>
                  <td className="px-3 py-2">{item.dateOfBirth}</td>
                  <td className="px-3 py-2">{item.dateOfLeaving}</td>
                  <td className="px-3 py-2">{item.reasonForLeaving}</td>
                  <td className="px-3 py-2">{item.issueDate}</td>
                  <td className="px-3 py-2">
                    <span className="text-blue-600 font-medium">
                      {item.status || "Issued TC"}
                    </span>
                  </td>

                  <td className="px-3 py-2 relative">
                    <MoreVertical
                      size={16}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPos({ top: rect.bottom + 5, left: rect.left - 80 });
                        setOpenMenu(openMenu === item.id ? null : item.id);
                      }}
                    />

                    {openMenu === item.id && (
                      <div style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }} className="w-32 bg-white border rounded shadow z-50 text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(item);
                          }}
                          className="block w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Eye size={14} /> Preview
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(null);
                            handleEdit(item.id);
                          }}
                          className="block w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(item.id);
                            setOpenMenu(null);
                          }}
                          className="block w-full px-3 py-2 text-left text-red-500 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
          {(certificateList || []).map((item) => (
            <div key={item.id} className="border rounded p-3 bg-white relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{item.studentName}</p>
                  <p className="text-xs text-gray-500">{item.classSection}</p>
                </div>

                <div className="relative">
                  <MoreVertical
                    size={16}
                    className="cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPos({ top: rect.bottom + 5, left: rect.left - 80 });
                        setOpenMenu(openMenu === item.id ? null : item.id);
                      }}
                  />

                  {openMenu === item.id && (
                    <div style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }} className="w-28 bg-white border rounded shadow z-50 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(item);
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(null);
                          handleEdit(item.id);
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item.id);
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 text-xs space-y-1 text-gray-600">
                <p>
                  <b>Admission No:</b> {item.admissionNo}
                </p>
                <p>
                  <b>Father Name:</b> {item.fatherName}
                </p>
                <p>
                  <b>DOB:</b> {item.dateOfBirth}
                </p>
                <p>
                  <b>Date of Leaving:</b> {item.dateOfLeaving}
                </p>
                <p>
                  <b>Date Of Issue TC:</b> {item.issueDate}
                </p>
              </div>

              <div className="mt-2">
                <span className="text-blue-600 text-xs font-medium">
                  {item.status || "Issued TC"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages || 1}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={(newSize) => {
            setRowsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete Transfer Certificate"
        message="Are you sure you want to delete this transfer certificate?"
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />

      {showPreview && previewData && (
        <TransferCertificatePreview
          initialData={previewData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default TransferCertificateList;
