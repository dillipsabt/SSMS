import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MoreVertical,
  Printer,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import BonafideCertificatePreview from "./BonafideCertificatePreview";
import useToastMessage from "../../utils/useToastMessage";
import {
  getBonafideCertificatesAsync,
  deleteBonafideCertificateAsync,
  getBonafideCertificateByIdAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/BonafideCertificate/bonafideCertificateSlice";

const BonafideCertificateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    certificateList,
    pagination,
    loading,
    error,
    success,
    successMessage,
  } = useSelector((state) => state.bonafideCertificate);

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [search, setSearch] = useState("");
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

  // Fetch bonafide certificates on mount and when filters change
  useEffect(() => {
    const params = {
      page: currentPage - 1,
      size: rowsPerPage,
      ...(search && { search }),
    };
    dispatch(getBonafideCertificatesAsync(params));
  }, [dispatch, currentPage, rowsPerPage, search]);

  useToastMessage({
    success,
    error,
    successMessage: "Bonafide certificate deleted successfully! ✅",
    clearSuccess,
    clearError,
    onSuccess: () => {
      const params = {
        page: 0,
        size: rowsPerPage,
        ...(search && { search }),
      };
      dispatch(getBonafideCertificatesAsync(params));
      setCurrentPage(1);
    },
  });

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    dispatch(deleteBonafideCertificateAsync(selectedId));
    setDeleteModal(false);
    setSelectedId(null);
  };

  const handlePreview = (item) => {
    dispatch(getBonafideCertificateByIdAsync(item.id)).then((action) => {
      if (action.payload) {
        setPreviewData({
          studentName: item.studentName,
          fatherName: item.fatherName,
          admissionNo: item.admissionNo,
          class: item.classSection,
          year: item.academicYear?.split("-")[2] || new Date().getFullYear(),
          schoolName: item.schoolName,
          dateOfIssue: item.issueDate,
          penNumber: item.penNumber || "",
        });
        setShowPreview(true);
      }
    });
    setOpenMenu(null);
  };

  const handleEdit = (id) => {
    navigate(`/issue-bonafide-certificate/${id}`);
  };

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Bonafide Certificate
      </h2>
      <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">
        Bonafide Certificate / Bonafide Certificate List
      </p>

      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Bonafide Certificate List
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-[250px]">
              <input
                type="text"
                placeholder="Search admission no./student Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                <th className="px-3 py-2 text-left">Academic Year</th>
                <th className="px-3 py-2 text-left">School Name</th>
                <th className="px-3 py-2 text-left">Date Of Issue</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {certificateList && certificateList.length > 0 ? (
                certificateList.map((item, i) => (
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
                    <td className="px-3 py-2">{item.academicYear}</td>
                    <td className="px-3 py-2">{item.schoolName}</td>
                    <td className="px-3 py-2">
                      {item.issueDate
                        ? new Date(item.issueDate).toLocaleDateString()
                        : "-"}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    {loading
                      ? "Loading certificates..."
                      : "No bonafide certificates found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE GRID VIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
          {certificateList && certificateList.length > 0 ? (
            certificateList.map((item) => (
              <div
                key={item.id}
                className="border rounded p-3 bg-white relative"
              >
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
                    <b>Academic Year:</b> {item.academicYear}
                  </p>
                  <p>
                    <b>Date Of Issue:</b>{" "}
                    {item.issueDate
                      ? new Date(item.issueDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500 py-6">
              {loading
                ? "Loading certificates..."
                : "No bonafide certificates found"}
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages || 1}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete Bonafide Certificate"
        message="Are you sure you want to delete this bonafide certificate?"
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />

      {showPreview && previewData && (
        <BonafideCertificatePreview
          initialData={previewData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default BonafideCertificateList;
