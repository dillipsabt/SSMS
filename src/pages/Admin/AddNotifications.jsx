import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import useToastMessage from '../../utils/useToastMessage';
import {
  createNotificationAsync,
  fetchClasses,
  fetchStudents,
  fetchTeachers,
  fetchDepartments,
  fetchSubjects,
  fetchStudentGroups,
  clearSuccess,
  clearError,
} from '../../features/Admin/Notifications/notificationSlice';

const AddNotifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasCleared = useRef(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    targetAudience: '',
    deliveryType: '',
    priority: '',
    expiryDateTime: '',
    description: '',
    reminderEnabled: false,
    reminder: {
      reminderType: '',
      reminderTiming: '',
      frequency: '',
      reminderTime: {
        hour: 0,
        minute: 0,
        second: 0,
        nano: 0,
      },
      active: true,
    },
    audience: {
      classId: '',
      section: '',
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
    loading,
    error,
    success,
  } = useSelector((state) => state.notification);

  const audience = formData.targetAudience;

  const showClass =
    ["ALL", "ALL_STUDENTS", "CLASS", "SECTION"].includes(audience);

  const showSection =
    ["ALL", "ALL_STUDENTS", "CLASS", "SECTION"].includes(audience);

  const showStudent =
    ["ALL", "ALL_STUDENTS", "STUDENT", "STUDENTS_AND_TEACHERS"].includes(audience);

  const showStudentGroup =
    ["ALL", "ALL_STUDENTS", "STUDENT_GROUP"].includes(audience);

  const showTeacher =
    ["ALL", "ALL_TEACHERS", "TEACHER", "STUDENTS_AND_TEACHERS"].includes(audience);

  const showDepartment =
    ["ALL", "ALL_TEACHERS", "TEACHER_DEPARTMENT"].includes(audience);

  const showSubject =
    ["ALL", "ALL_TEACHERS", "SUBJECT_TEACHERS"].includes(audience);

  const showAudienceSection =
    audience !== "";

  // MUST be first - clear stale messages immediately on mount
  useEffect(() => {
    if (!hasCleared.current) {
      dispatch(clearSuccess());
      dispatch(clearError());
      hasCleared.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
    dispatch(fetchTeachers());
    dispatch(fetchDepartments());
    dispatch(fetchSubjects());
    dispatch(fetchStudentGroups());
  }, [dispatch]);

  useToastMessage({
    success,
    error,
    successMessage: 'Notification created successfully! ✅',
    clearSuccess,
    clearError,
    onSuccess: () => {
      setFormData({
        title: '',
        category: '',
        targetAudience: '',
        deliveryType: '',
        priority: '',
        expiryDateTime: '',
        description: '',
        reminderEnabled: false,
        reminder: {
          reminderType: '',
          reminderTiming: '',
          frequency: '',
          reminderTime: {
            hour: 0,
            minute: 0,
            second: 0,
            nano: 0,
          },
          active: true,
        },
        audience: {
          classId: '',
          section: '',
          groupId: '',
          studentId: '',
          teacherId: '',
          departmentId: '',
          subjectId: '',
        },
      });
      setTimeout(() => {
        navigate('/notifications-list');
      }, 500);
    },
  });

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to create notification';
      toast.error(`Error: ${errorMessage} ❌`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "targetAudience") {
      setFormData((prev) => ({
        ...prev,
        targetAudience: value,

        audience: {
          classId: "",
          section: "",
          groupId: "",
          studentId: "",
          teacherId: "",
          departmentId: "",
          subjectId: "",
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
          section: selectedClass?.section || '',
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

  const handleReminderChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name.replace('reminder_', '');

    if (fieldName === 'enabled') {
      setFormData(prev => ({
        ...prev,
        reminderEnabled: checked,
      }));
    } else if (fieldName.startsWith('reminderTime_')) {
      const timePart = fieldName.split('_')[1];
      setFormData(prev => ({
        ...prev,
        reminder: {
          ...prev.reminder,
          reminderTime: {
            ...prev.reminder.reminderTime,
            [timePart]: parseInt(value) || 0,
          },
        },
      }));
    } else if (fieldName === 'active') {
      setFormData(prev => ({
        ...prev,
        reminder: {
          ...prev.reminder,
          active: checked,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        reminder: {
          ...prev.reminder,
          [fieldName]: value,
        },
      }));
    }
  };

  const insertFormattedText = (before, after = '') => {
    const textarea = document.querySelector('textarea[name="description"]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.description;
    const selectedText = text.substring(start, end) || 'text';
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

  const handleEditorCommand = (command) => {
    switch (command) {
      case 'bold':
        insertFormattedText('**', '**');
        break;
      case 'italic':
        insertFormattedText('*', '*');
        break;
      case 'underline':
        insertFormattedText('__', '__');
        break;
      case 'strikeThrough':
        insertFormattedText('~~', '~~');
        break;
      case 'insertUnorderedList':
        insertFormattedText('\n• ');
        break;
      default:
        break;
    }
  };

  const handleTextSelection = (e) => {
    e.target.value = 'Normal text';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter notification title');
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
    if (!formData.expiryDateTime) {
      toast.error('Please select expiry date and time');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter notification description');
      return;
    }

    if (formData.reminderEnabled) {
      if (!formData.reminder.reminderType) {
        toast.error('Please select reminder type');
        return;
      }
      if (!formData.reminder.reminderTiming) {
        toast.error('Please select reminder timing');
        return;
      }
      if (!formData.reminder.frequency) {
        toast.error('Please select reminder frequency');
        return;
      }
    }

    const payload = {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      category: formData.category,
      deliveryType: formData.deliveryType,
      priority: formData.priority,
      targetAudience: formData.targetAudience,

      expiryDateTime: formData.expiryDateTime
        ? `${formData.expiryDateTime}:00`
        : null,

      reminderEnabled: formData.reminderEnabled,
    };

    payload.audience = {
      classId: Number(formData.audience.classId) || 0,
      section: formData.audience.section || "",
      groupId: Number(formData.audience.groupId) || 0,
      studentId: Number(formData.audience.studentId) || 0,
      teacherId: Number(formData.audience.teacherId) || 0,
      departmentId: Number(formData.audience.departmentId) || 0,
      subjectId: Number(formData.audience.subjectId) || 0,
    };

    if (formData.reminderEnabled) {
      payload.reminder = {
        reminderType: formData.reminder.reminderType,
        reminderTiming: formData.reminder.reminderTiming,
        frequency: formData.reminder.frequency,

        reminderTime: `${String(
          formData.reminder.reminderTime.hour
        ).padStart(2, "0")}:${String(
          formData.reminder.reminderTime.minute
        ).padStart(2, "0")}`,

        active: formData.reminder.active,
      };
    }

    dispatch(createNotificationAsync(payload));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Notifications & Alerts</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Title, Category, Target Audience Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Title <span className="text-red-600">*</span>
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
                <option value="NOTIFICATION">Notification</option>
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
                <option value="ALL_STUDENTS">All Students</option>
                <option value="STUDENT">Student</option>
                <option value="CLASS">Class</option>
                <option value="SECTION">Section</option>
                <option value="STUDENT_GROUP">Student Group</option>
                <option value="ALL_TEACHERS">All Teachers</option>
                <option value="TEACHER">Teacher</option>
                <option value="TEACHER_DEPARTMENT">Teacher Department</option>
                <option value="SUBJECT_TEACHERS">Subject Teachers</option>
                <option value="STUDENTS_AND_TEACHERS">Students & Teachers</option>
              </select>
            </div>
          </div>

          {/* Delivery Type, Priority, Expire Date Row */}
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
                <option value="PORTAL">Portal</option>
                <option value="BOTH">Both</option>
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
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expire Date & Time <span className="text-red-600">*</span>
              </label>
              <input
                type="datetime-local"
                name="expiryDateTime"
                value={formData.expiryDateTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
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
                <button type="button" onClick={() => handleEditorCommand('undo')} className="p-1 hover:bg-gray-200 rounded" title="Undo">↶</button>
                <button type="button" onClick={() => handleEditorCommand('redo')} className="p-1 hover:bg-gray-200 rounded" title="Redo">↷</button>
                <select onChange={handleTextSelection} className="px-2 py-1 border border-gray-300 rounded text-sm bg-white w-30">
                  <option>Normal text</option>
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
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

                {/* Section */}

                {showSection && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section
                    </label>

                    <input
                      type="text"
                      value={formData.audience.section}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
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

          {/* Reminder Settings */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Reminder Settings</h3>
              <div className="flex items-center gap-2">
                <label htmlFor="reminder_enabled" className="text-sm text-gray-700">Enable Reminders</label>
                <input
                  type="checkbox"
                  id="reminder_enabled"
                  name="reminder_enabled"
                  checked={formData.reminderEnabled}
                  onChange={handleReminderChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {formData.reminderEnabled && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="reminder_reminderType"
                      value={formData.reminder.reminderType}
                      onChange={handleReminderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
                    >
                      <option value="">Select reminder type</option>
                      <option value="PUNCH_IN">Punch In</option>
                      <option value="PUNCH_OUT">Punch Out</option>
                      <option value="GENERAL">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Timing <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="reminder_reminderTiming"
                      value={formData.reminder.reminderTiming}
                      onChange={handleReminderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
                    >
                      <option value="">Select timing</option>
                      <option value="MIN_15">15 Minutes Before</option>
                      <option value="MIN_30">30 Minutes Before</option>
                      <option value="MIN_45">45 Minutes Before</option>
                      <option value="HOUR_1">1 Hour Before</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="reminder_frequency"
                      value={formData.reminder.frequency}
                      onChange={handleReminderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white pr-8"
                    >
                      <option value="">Select Frequency</option>
                      <option value="ONE_TIME">Once</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hour</label>
                    <input
                      type="number"
                      name="reminder_reminderTime_hour"
                      min="0"
                      max="23"
                      value={formData.reminder.reminderTime.hour}
                      onChange={handleReminderChange}
                      placeholder="00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
                    <input
                      type="number"
                      name="reminder_reminderTime_minute"
                      min="0"
                      max="59"
                      value={formData.reminder.reminderTime.minute}
                      onChange={handleReminderChange}
                      placeholder="00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Second</label>
                    <input
                      type="number"
                      name="reminder_reminderTime_second"
                      min="0"
                      max="59"
                      value={formData.reminder.reminderTime.second}
                      onChange={handleReminderChange}
                      placeholder="00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="reminder_active"
                          checked={formData.reminder.active}
                          onChange={handleReminderChange}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNotifications;
