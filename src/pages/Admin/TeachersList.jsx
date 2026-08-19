import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTeachersAsync,
  resetTeacherState,
  deleteTeacherAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/Teacher/teacherSlice";

import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import useToastMessage from "../../utils/useToastMessage";

const TeachersList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const canManageTeachers = useSelector((state) => state.auth.role) !== "staff-portal";
  const [statusFilter, setStatusFilter] = useState("All");

  const { teachers, message, error, success } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTeachersAsync());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useToastMessage({
    success,
    error,
    successMessage: typeof message === "string" ? message : message?.message || "Operation successful",
    clearSuccess,
    clearError,
  });

  const formatted = (teachers || []).map((t) => ({
    id: t.id || t.teacherId,
    teacherId: t.id || t.teacherId,
    teacherCode: t.teacherCode || "-",
    name: t.fullName,
    subject: t.subjectName || "-",
    class: "-",
    phone: t.phoneNo,
    email: t.email,
    date: t.joinDate,
    status: t.status || "Active",
  }));

  const handleDeleteClick = (id, type = "teacher") => {
    setSelectedId(id);
    setDeleteType(type);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      dispatch(deleteTeacherAsync(selectedId));
    }

    setDeleteModal(false);
    setSelectedId(null);
  };


  const filteredTeachers = formatted.filter((t) => {
    const matchesSearch = search === "" ||
      [
        t.name,
        t.subject,
        t.phone,
        t.email,
        t.date,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(search)
        );

    const matchesStatus =
      statusFilter === "All"
        ? true
        : t.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });


  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">
        Teachers List
      </h2>
      <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">
        Teacher / Teachers List
      </p>

      <div className="card p-3 sm:p-4">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <h2 className="text-sm font-medium text-gray-700">
            Teachers List
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative w-full sm:w-[200px]">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 text-[12px] rounded px-3 py-[6px] pr-7 w-full focus:outline-none"
              />
              <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 text-[12px] rounded px-2 py-[6px] w-full sm:w-[120px]"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-4 py-2 text-left">S No.</th>
                <th className="px-4 py-2 text-left">Teacher Code</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Phone No.</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Join Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentTeachers.map((item, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{indexOfFirst + index + 1}</td>
                  <td className="px-4 py-2 font-medium">{item.teacherCode}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.subject}</td>
                  <td className="px-4 py-2">{item.phone}</td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">{item.date}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${item.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-2 relative">
                    <MoreVertical
                      size={16}
                      className="cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();

                        setMenuPos({
                          top: rect.bottom + 5,
                          left: rect.left - 80,
                        });

                        setOpenMenu(openMenu === index ? null : index);
                      }}
                    />

                    {openMenu === index && (
                      <div
                        style={{
                          position: "fixed",
                          top: menuPos.top,
                          left: menuPos.left,
                          zIndex: 9999,
                        }}
                        className="w-28 bg-white border rounded shadow"
                      >
                        <button
                          onClick={() => {
                            navigate(`/teacher-details/${item.id}`);
                            setOpenMenu(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          View
                        </button>

                        {canManageTeachers && (
                          <>
                            <button
                              onClick={() => {
                                if (!item?.id) return;

                                navigate(`/add-teacher/${item.id}`);

                                setOpenMenu(null);
                              }}
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                handleDeleteClick(item.id, "teacher");
                                setOpenMenu(null);
                              }}
                              className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
          {filteredTeachers.map((item, index) => (
            <div key={index} className="border rounded p-3 bg-white relative">

              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.subject}</p>
                </div>

                <div className="relative">
                  <MoreVertical
                    size={16}
                    className="cursor-pointer"
                    onClick={() =>
                      setOpenMenu(openMenu === index ? null : index)
                    }
                  />

                  {/* ✅ FIX: ACTION MENU */}
                  {openMenu === index && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-50 text-xs">
                      <button
                        onClick={() => {
                          navigate(`/teacher-details/${item.id}`);
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        View
                      </button>

                      {canManageTeachers && (
                        <>
                          <button
                            onClick={() => {
                              if (!item?.id) return;
                              navigate(`/add-teacher/${item.id}`);
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              handleDeleteClick(item.id, "teacher");
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 text-xs space-y-1 text-gray-600">
                <p><b>ID:</b> {item.teacherId}</p>
                <p><b>Class:</b> {item.class}</p>
                <p><b>Phone:</b> {item.phone}</p>
                <p><b>Email:</b> {item.email}</p>
                <p><b>Date:</b> {item.date}</p>
              </div>

              <div className="mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${item.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                    }`}
                >
                  {item.status}
                </span>
              </div>

            </div>
          ))}
        </div>
        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
      <DeleteConfirmModal
        isOpen={deleteModal}
        title="Delete Teacher"
        message={`Are you sure you want to delete this ${deleteType}?`}
        onClose={() => {
          setDeleteModal(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TeachersList;
