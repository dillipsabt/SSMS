import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  createAnnouncementAsync,
  updateAnnouncementAsync,
  fetchAnnouncementById,
  fetchClasses,
  fetchStudents,
  fetchTeachers,
  fetchDepartments,
  fetchSubjects,
  fetchStudentGroups,
  clearSuccess,
  clearError,
} from '../../features/Admin/Announcements/announcementsSlice';
import useToastMessage from "../../utils/useToastMessage";

const AddAnnouncements = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const announcementId = searchParams.get('id');
  const isEditMode = !!announcementId;
  const hasCleared = useRef(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    targetAudience: '',
    deliveryType: '',
    priority: '',
    publishDate: '',
    publishedBy: '',
    status: '',
    description: '',
    acknowledgementRequired: false,
    audience: {
      classId: '',
      groupId: '',
      studentId: '',
      teacherId: '',
      departmentId: '',
      subjectId: '',
    },
  });

  const {
    classes,
    students,
    teachers,
    departments,
    subjects,
    studentGroups,
    currentAnnouncement,
    loading,
    error,
    success,
  } = useSelector((state) => state.announcements);

  const audience = formData.targetAudience;

  const showClass = ["ALL", "STUDENTS", "FACULTY"].includes(audience);
  const showStudent = ["ALL", "STUDENTS"].includes(audience);
  const showStudentGroup = ["ALL", "STUDENTS"].includes(audience);
  const showTeacher = ["ALL", "FACULTY"].includes(audience);
  const showDepartment = ["ALL", "FACULTY"].includes(audience);
  const showSubject = ["ALL", "FACULTY"].includes(audience);

  const showAudienceSection = false;

  // MUST be first - clear stale messages immediately on mount
  useEffect(() => {
    if (!hasCleared.current) {
      dispatch(clearSuccess());
      dispatch(clearError());
      hasCleared.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchAnnouncementById(announcementId));
    }
  }, [announcementId, isEditMode, dispatch]);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
    dispatch(fetchTeachers());
    dispatch(fetchDepartments());
    dispatch(fetchSubjects());
    dispatch(fetchStudentGroups());
  }, [dispatch]);

  useEffect(() => {
    if (currentAnnouncement && isEditMode) {
      setFormData({
        title: currentAnnouncement.title || '',
        category: currentAnnouncement.category || '',
        targetAudience: currentAnnouncement.targetAudience || '',
        deliveryType: currentAnnouncement.deliveryType || '',
        priority: currentAnnouncement.priority || '',
        publishDate: currentAnnouncement.publishDate || '',
        publishedBy: currentAnnouncement.publishedBy || '',
        status: currentAnnouncement.status || '',
        description: currentAnnouncement.description || '',
        acknowledgementRequired: currentAnnouncement.acknowledgementRequired || false,
        audience: currentAnnouncement.audience || {
          classId: '',
          groupId: '',
          studentId: '',
          teacherId: '',
          departmentId: '',
          subjectId: '',
        },
      });
    }
  }, [currentAnnouncement, isEditMode]);

  useToastMessage({
    success,
    error,
    successMessage: isEditMode ? 'Announcement updated successfully! ✅' : 'Announcement created successfully! ✅',
    clearSuccess,
    clearError,
    onSuccess: () => {
      setFormData({
        title: '',
        category: '',
        targetAudience: '',
        deliveryType: '',
        priority: '',
        publishDate: '',
        publishedBy: '',
        status: '',
        description: '',
        acknowledgementRequired: false,
        audience: {
          classId: '',
          groupId: '',
          studentId: '',
          teacherId: '',
          departmentId: '',
          subjectId: '',
        },
      });
      setTimeout(() => {
        navigate('/announcements-list');
      }, 500);
    },
    onError: (errorMsg) => {
      // Custom error handling if needed
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "targetAudience") {
      setFormData((prev) => ({
        ...prev,
        targetAudience: value,
        audience: {
          classId: '',
          groupId: '',
          studentId: '',
          teacherId: '',
          departmentId: '',
          subjectId: '',
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAudienceChange = (e) => {
    const { name, value } = e.target;

    if (name === 'classId') {
      const selectedClass = classes.find(cls => String(cls.id) === value);
      setFormData(prev => ({
        ...prev,
        audience: {
          ...prev.audience,
          classId: value ? parseInt(value) : '',
        },
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      audience: {
        ...prev.audience,
        [name]: value ? parseInt(value) || value : '',
      },
    }));
  };

  const handleEditorCommand = (command) => {
    const textarea = document.querySelector('textarea[name="description"]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.description;
    const selectedText = text.substring(start, end) || 'text';
    let before = '', after = '';

    switch (command) {
      case 'bold':
        before = '**';
        after = '**';
        break;
      case 'italic':
        before = '*';
        after = '*';
        break;
      case 'underline':
        before = '__';
        after = '__';
        break;
      case 'strikeThrough':
        before = '~~';
        after = '~~';
        break;
      case 'insertUnorderedList':
        before = '\n• ';
        break;
      default:
        break;
    }

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);

    setFormData(prev => ({
      ...prev,
      description: newText,
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  const handleTextSelection = (e) => {
    e.target.value = 'Normal text';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter announcement title');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.targetAudience) {
      toast.error('Please select target audience');
      return;
    }
    if (!formData.deliveryType) {
      toast.error('Please select delivery type');
      return;
    }
    if (!formData.priority) {
      toast.error('Please select priority');
      return;
    }
    if (!formData.publishDate) {
      toast.error('Please select publish date');
      return;
    }
    if (!formData.publishedBy) {
      toast.error('Please select published by');
      return;
    }
    if (!formData.status) {
      toast.error('Please select status');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter announcement description');
      return;
    }

    const payload = {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      category: formData.category,
      deliveryType: formData.deliveryType,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      publishDate: formData.publishDate,
      publishedBy: formData.publishedBy,
      status: formData.status,
      acknowledgementRequired: formData.acknowledgementRequired,
    };

    payload.audience = {
      classId: Number(formData.audience.classId) || 0,
      groupId: Number(formData.audience.groupId) || 0,
      studentId: Number(formData.audience.studentId) || 0,
      teacherId: Number(formData.audience.teacherId) || 0,
      departmentId: Number(formData.audience.departmentId) || 0,
      subjectId: Number(formData.audience.subjectId) || 0,
    };

    if (isEditMode) {
      dispatch(updateAnnouncementAsync({
        id: announcementId,
        data: payload,
      }));
    } else {
      dispatch(createAnnouncementAsync(payload));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">{isEditMode ? 'Edit Announcement' : 'Add Announcements'}</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Title, Category, Target Audience Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="MEETING">Meeting</option>
                <option value="EVENT">Event</option>
                <option value="ALERT">Alert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience <span className="text-red-600">*</span>
              </label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="ALL">All</option>
                <option value="STUDENTS">Students</option>
                <option value="FACULTY">Faculty</option>
                <option value="PARENTS">Parents</option>
              </select>
            </div>
          </div>

          {/* Delivery Type, Priority, Publish Date Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Type <span className="text-red-600">*</span>
              </label>
              <select
                name="deliveryType"
                value={formData.deliveryType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="IN_APP">In-App</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-600">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publish Date <span className="text-red-600">*</span>
              </label>
              <input
                type="datetime-local"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Published By and Status Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Published By <span className="text-red-600">*</span>
              </label>
              <select
                name="publishedBy"
                value={formData.publishedBy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="ADMIN">Admin</option>
                <option value="PRINCIPAL">Principal</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
              >
                <option value="">Select</option>
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              {/* Rich Text Toolbar */}
              <div className="bg-gray-50 border-b border-gray-300 p-3 flex gap-2 flex-wrap">
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Undo">↶</button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Redo">↷</button>
                <select onChange={handleTextSelection} className="px-2 py-1 border border-gray-300 rounded text-sm bg-white w-30">
                  <option>Normal text</option>
                </select>
                <button type="button" onClick={() => handleEditorCommand('insertUnorderedList')} className="p-1 hover:bg-gray-200 rounded" title="Format list">≡</button>
                <button type="button" className="px-2 py-1 text-sm font-bold bg-gray-800 text-white rounded">■</button>
                <button type="button" onClick={() => handleEditorCommand('bold')} className="px-2 py-1 text-sm font-bold hover:bg-gray-200">B</button>
                <button type="button" onClick={() => handleEditorCommand('italic')} className="px-2 py-1 text-sm italic hover:bg-gray-200">I</button>
                <button type="button" onClick={() => handleEditorCommand('underline')} className="px-2 py-1 text-sm underline hover:bg-gray-200">U</button>
                <button type="button" onClick={() => handleEditorCommand('strikeThrough')} className="px-2 py-1 text-sm line-through hover:bg-gray-200">S</button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded text-sm">&lt;&gt;</button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="List">◉</button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Link">🔗</button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Image">🖼</button>
                <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Quote">❝</button>
              </div>
              {/* Text Area */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-4 border-0 outline-none resize-none"
                rows="6"
                placeholder=""
              />
            </div>
          </div>

          {/* Audience Selection */}
          {showAudienceSection && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Audience Selection
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Class */}
                {showClass && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>

                    <select
                      name="classId"
                      value={formData.audience.classId}
                      onChange={handleAudienceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Class</option>

                      {classes?.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.classCode || cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Student */}
                {showStudent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student
                    </label>

                    <select
                      name="studentId"
                      value={formData.audience.studentId}
                      onChange={handleAudienceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Student</option>

                      {students?.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.fullName || student.firstName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Student Group */}
                {showStudentGroup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Group
                    </label>

                    <select
                      name="groupId"
                      value={formData.audience.groupId}
                      onChange={handleAudienceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Group</option>

                      {studentGroups?.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.groupName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Teacher */}
                {showTeacher && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher
                    </label>

                    <select
                      name="teacherId"
                      value={formData.audience.teacherId}
                      onChange={handleAudienceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Teacher</option>

                      {teachers?.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.fullName || teacher.firstName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Department */}
                {showDepartment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>

                    <select
                      name="departmentId"
                      value={formData.audience.departmentId}
                      onChange={handleAudienceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Department</option>

                      {departments?.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Subject */}
                {showSubject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>

                    <select
                      name="subjectId"
                      value={formData.audience.subjectId}
                      onChange={handleAudienceChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Subject</option>

                      {subjects?.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.subjectName || subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acknowledgement Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Acknowledgement Settings</h3>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="acknowledge"
                name="acknowledgementRequired"
                checked={formData.acknowledgementRequired}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:outline-none"
              />
              <label htmlFor="acknowledge" className="text-sm text-gray-700">
                Require acknowledgement from all
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAnnouncements;
