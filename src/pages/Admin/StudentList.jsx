import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudentsAsync,
  deleteStudentAsync,
  fetchClassesAsync,
  clearSuccess,
  clearError,
} from "../../features/Admin/student/studentSlice";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import useToastMessage from "../../utils/useToastMessage";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canManageStudents = localStorage.getItem("role") !== "staff-portal";
  const {
    students: reduxStudents,
    classes,
    message,
    error,
    success,
  } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getStudentsAsync());
    dispatch(fetchClassesAsync());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const formatted = (reduxStudents || []).map((s) => ({
      id: s.id,
      rollNo: s.rollNo,
      admission: s.admissionNo,
      name: s.fullName,
      class: `${s.className}`,
      age: `${s.age}Y / ${s.gender}`,
      dob: s.dob,
      parentPhoneNo: s.parentPhoneNo,
      email: s.email,
      joining: s.schoolJoiningDate,
      status: s.status || "Active",
      raw: s,
    }));

    setStudents(formatted);
  }, [reduxStudents]);

  useToastMessage({
    success,
    error,
    successMessage: message || "Student deleted successfully",
    clearSuccess,
    clearError,
    onSuccess: () => {
      dispatch(getStudentsAsync());
    },
  });

  const handleDeleteClick = (id, type = "student") => {
    setSelectedId(id);
    setDeleteType(type);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    dispatch(deleteStudentAsync(selectedId));
    setDeleteModal(false);
    setSelectedId(null);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All"
        ? true
        : s.status?.toLowerCase() === statusFilter.toLowerCase();

    // const matchesClass =
    //   selectedClass === ""
    //     ? true
    //     : `${s.raw.className}-${s.raw.section}` === selectedClass;

    const matchesClass =
      selectedClass === ""
        ? true
        : s.raw.className === selectedClass;

    return matchesSearch && matchesStatus && matchesClass;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">Student List</h2>
      <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">
        Student / Student List
      </p>

      <div className="card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-gray-700">Student List</h3>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-[250px]">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md px-3 pr-10 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-[160px] h-10 border border-gray-300 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full sm:w-[180px] h-10 border border-gray-300 rounded-md px-3 text-sm"
            >
              <option value="">All Classes</option>

              {[...new Map(
                classes?.map(item => [item.className, item])
              ).values()].map((cls) => (
                <option key={cls.className} value={cls.className}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden lg:block border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="thead-row">
              <tr>
                <th className="px-3 py-2 text-left">S.No.</th>
                <th className="px-3 py-2 text-left">Roll No.</th>
                <th className="px-3 py-2 text-left">admission No.</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Class</th>
                <th className="px-3 py-2 text-left">Age / Gender</th>
                <th className="px-3 py-2 text-left">DOB</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Joining</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.map((s, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{indexOfFirst + i + 1}</td>
                  <td className="px-3 py-2">{s.rollNo}</td>
                  <td className="px-3 py-2">{s.admission}</td>
                  <td className="px-3 py-2">{s.name}</td>
                  <td className="px-3 py-2">{s.class}</td>
                  <td className="px-3 py-2">{s.age}</td>
                  <td className="px-3 py-2">{s.dob}</td>
                  <td className="px-3 py-2">{s.parentPhoneNo}</td>
                  <td className="px-3 py-2">{s.email}</td>
                  <td className="px-3 py-2">{s.joining}</td>

                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${s.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="px-3 py-2 relative">
                    <MoreVertical
                      size={16}
                      className="cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.stopPropagation();
                        setMenuPos({
                          top: rect.bottom + 5,
                          left: rect.left - 80,
                        });
                        setOpenMenu(openMenu === i ? null : i);
                      }}
                    />

                    {openMenu === i && (
                      <div
                        style={{
                          position: "fixed",
                          top: menuPos.top,
                          left: menuPos.left,
                          zIndex: 9999,
                        }}
                        className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-50"
                      >
                        <button
                          onClick={() => {
                            navigate("/student-view", { state: s.raw });
                            setOpenMenu(null);
                          }}
                          className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                          View
                        </button>

                        {canManageStudents && (
                          <>
                            <button
                              onClick={() => {
                                navigate(`/add-student/${s.raw.id}`);
                                setOpenMenu(null);
                              }}
                              className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                handleDeleteClick(s.raw.id, "student");
                                setOpenMenu(null);
                              }}
                              className="block w-full px-3 py-2 text-left text-red-500 hover:bg-gray-100"
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

        {/* ✅ MOBILE VIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
          {filteredStudents.map((s, i) => (
            <div key={i} className="border rounded p-3 bg-white relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.class}</p>
                </div>

                {/* ✅ ACTION ICON */}
                <div className="relative">
                  <MoreVertical
                    size={16}
                    className="cursor-pointer"
                    onClick={() => setOpenMenu(openMenu === i ? null : i)}
                  />

                  {/* ✅ DROPDOWN */}
                  {openMenu === i && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-50 text-xs">
                      <button
                        onClick={() => {
                          navigate("/student-view", { state: s.raw });
                          setOpenMenu(null);
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        View
                      </button>

                      {canManageStudents && (
                        <>
                          <button
                            onClick={() => {
                              navigate(`/add-student/${s.raw.id}`);
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              handleDeleteClick(s.raw.id, "student");
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

              {/* DATA */}
              <div className="mt-2 text-xs space-y-1 text-gray-600">
                <p>
                  <b>Admission:</b> {s.admission}
                </p>
                <p>
                  <b>Age:</b> {s.age}
                </p>
                <p>
                  <b>DOB:</b> {s.dob}
                </p>
                <p>
                  <b>Phone:</b> {s.parentPhoneNo}
                </p>
                <p>
                  <b>Email:</b> {s.email}
                </p>
                <p>
                  <b>Joining:</b> {s.joining}
                </p>
              </div>

              <div className="mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${s.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                    }`}
                >
                  {s.status}
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
        title="Delete Student"
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

export default StudentList;
