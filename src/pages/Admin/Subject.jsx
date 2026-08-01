import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubjectAsync,
  deleteSubjectAsync,
  fetchSubjectByIdAsync,
  fetchSubjectsAsync,
  updateSubjectAsync,
} from "../../features/Admin/Subject/subjectSlice";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";
import { toast } from "sonner";

const emptyForm = {
  subjectCode: "",
  subjectName: "",
  description: "",
};

const Subject = () => {
  const dispatch = useDispatch();
  const { subjects, loading } = useSelector((state) => state.subject);
  const [editId, setEditId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [filters, setFilters] = useState({ search: "" });
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchSubjectsAsync());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (filters.search) {
      params.search = filters.search;
    }
    dispatch(fetchSubjectsAsync(params));
  }, [filters, dispatch]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.subjectCode || !formData.subjectName) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      subjectCode: formData.subjectCode,
      subjectName: formData.subjectName,
      description: formData.description,
    };

    try {
      const response = editId
        ? await dispatch(updateSubjectAsync({ id: editId, data: payload }))
        : await dispatch(createSubjectAsync(payload));

      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success(
          editId ? "Subject updated successfully" : "Subject created successfully"
        );
        dispatch(fetchSubjectsAsync());
        setEditId(null);
        setFormData(emptyForm);
      } else {
        toast.error(
          response?.payload?.message ||
            (editId ? "Failed to update subject" : "Failed to create subject")
        );
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || "Something went wrong";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleEdit = async (subject) => {
    setEditId(subject.id);

    try {
      const selectedSubject = await dispatch(
        fetchSubjectByIdAsync(subject.id)
      ).unwrap();
      setFormData({
        subjectCode: selectedSubject.subjectCode || "",
        subjectName: selectedSubject.subjectName || "",
        description: selectedSubject.description || "",
      });
    } catch (error) {
      setEditId(null);
      toast.error(error?.message || "Failed to load subject");
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await dispatch(deleteSubjectAsync(selectedDeleteId));

      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("Subject deleted successfully");
        dispatch(fetchSubjectsAsync());
        setDeleteModalOpen(false);
        setSelectedDeleteId(null);
      } else {
        toast.error(response?.payload?.message || "Failed to delete subject");
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || "Something went wrong";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
        Subject Management
      </h2>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">
          {editId ? "Edit Subject" : "Add Subject"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subject Code *
            </label>
            <input
              type="text"
              name="subjectCode"
              value={formData.subjectCode}
              onChange={handleFormChange}
              placeholder="Enter subject code"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleFormChange}
              placeholder="Enter subject name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Enter description"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded text-xs sm:text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
          >
            {editId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <input
            type="text"
            name="search"
            placeholder="Search by subject name..."
            value={filters.search}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 text-xs w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Subject Code
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Subject Name
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Description
                </th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : subjects?.length > 0 ? (
                subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-800">
                      {subject.subjectCode}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {subject.subjectName}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {subject.description}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Edit
                          onClick={() => handleEdit(subject)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />
                        <Trash2
                          onClick={() => handleDeleteClick(subject.id)}
                          className="w-4 h-4 text-red-600 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Subject"
        message="Are you sure you want to delete this subject?"
      />
    </div>
  );
};

export default Subject;
