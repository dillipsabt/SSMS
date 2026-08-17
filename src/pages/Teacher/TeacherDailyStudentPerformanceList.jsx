import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    fetchPerformanceList,
    fetchAvailableDates,
    fetchClassesByDate,
    getPerformanceByIdThunk,
} from "../../features/teacher/studentPerformance/performanceSlice";
import Pagination from "../../components/common/Pagination";

const PERFORMANCE_OPTIONS = [
    "All",
    "Excellent",
    "Very Good",
    "Good",
    "Average",
    "Poor",
];

const formatDateInputValue = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}-${month}-${day}`;
};

const formatDisplayDate = (dateValue) => {
    const [year, month, day] = String(dateValue).slice(0, 10).split("-");

    return year && month && day ? `${day}/${month}/${year}` : dateValue;
};

const TeacherStudentPerformanceList = () => {
    const dispatch = useDispatch();
    const {
        performanceListData,
        availableDates,
        classesFromAPI,
        loading,
        error,
        currentPerformance,
    } = useSelector((state) => state.teacherPerformance);

    // State for filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [searchStudent, setSearchStudent] = useState("");
    const [selectedPerformance, setSelectedPerformance] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Handle date click to fetch classes
    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        dispatch(fetchClassesByDate({ startDate: dateStr, endDate: dateStr }));
        setSelectedClass(null);
        setSelectedSubject(null);
        setCurrentPage(1);
    };

    const resetDateFilters = () => {
        setSelectedClass(null);
        setSelectedSubject(null);
        setCurrentPage(1);
        setSearchStudent("");
        setSelectedPerformance("All");
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        resetDateFilters();
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        resetDateFilters();
    };

    // Fetch dates when date range is entered
    useEffect(() => {
        if (startDate && endDate) {
            dispatch(fetchAvailableDates({ startDate, endDate }));
        }
    }, [startDate, endDate, dispatch]);

    // Fetch performance list when filters change
    useEffect(() => {
        if (!selectedDate || !selectedClass) return;

        const params = {
            page: currentPage - 1,
            size: rowsPerPage,
            date: selectedDate,
            classId: selectedClass,
        };

        if (selectedSubject) params.subjectId = selectedSubject;
        if (searchStudent) params.search = searchStudent;
        if (selectedPerformance !== "All") {
            params.performance = selectedPerformance;
        }

        dispatch(fetchPerformanceList(params));
    }, [
        dispatch,
        selectedDate,
        selectedClass,
        selectedSubject,
        searchStudent,
        selectedPerformance,
        currentPage,
        rowsPerPage,
    ]);

    useEffect(() => {
        if (error) {
            toast.error(error?.message || "Failed to load performance data");
        }
    }, [error]);

    // Fetch detailed performance data when modal opens
    useEffect(() => {
        if (showModal && modalData && modalData.id) {
            dispatch(getPerformanceByIdThunk(modalData.id));
        }
    }, [showModal, modalData, dispatch]);

    // Convert behaviour type enum to readable format
    const formatBehaviourType = (behaviourType) => {
        if (!behaviourType) return "-";
        return behaviourType
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    // Filter dates based on date range
    const filterDatesByRange = () => {
        if (!startDate || !endDate) return availableDates || [];

        const start = new Date(startDate);
        const end = new Date(endDate);

        return (availableDates || []).filter((dateStr) => {
            const current = new Date(dateStr);
            return current >= start && current <= end;
        });
    };

    // Format dates from API and remove duplicates
    const filteredDatesList = filterDatesByRange();
    const uniqueDateMap = new Map();
    filteredDatesList.forEach((dateStr) => {
        if (!uniqueDateMap.has(dateStr)) {
            uniqueDateMap.set(dateStr, true);
        }
    });
    const uniqueDates = Array.from(uniqueDateMap.keys());
    const formattedDates = uniqueDates.map((dateStr) => ({
        id: dateStr,
        date: formatDisplayDate(dateStr),
        raw: dateStr,
    }));

    // Transform students from API
    // Handle multiple possible response structures
    const studentsList = performanceListData?.content ||
                         performanceListData?.students ||
                         (Array.isArray(performanceListData) ? performanceListData : []);

    const apiStudents = (studentsList ?? []).map(
        (student, idx) => ({
            id: student.performanceId || student.id || student.studentId,
            sNo: (currentPage - 1) * rowsPerPage + idx + 1,
            rollNo: student.rollNo ?? "-",
            name: student.studentName ?? "-",
            comments: student.teacherComments ?? "-",
            performance: student.overallPerformance || "-",
            academics: student.academics || [],
            nonAcademics: student.nonAcademics || [],
        })
    );

    const filteredStudents = apiStudents;
    const totalPages = performanceListData?.totalPages || performanceListData?.totalPagesCount || 1;

    const getPerformanceColor = (perf) => {
        const colors = {
            Excellent: "text-green-600",
            "Very Good": "text-blue-600",
            Good: "text-indigo-600",
            Average: "text-orange-600",
            Poor: "text-red-600",
        };
        return colors[perf] || "text-gray-600";
    };

    const getPerformanceBg = (perf) => {
        const bgColors = {
            Excellent: "bg-green-50",
            "Very Good": "bg-blue-50",
            Good: "bg-indigo-50",
            Average: "bg-orange-50",
            Poor: "bg-red-50",
        };
        return bgColors[perf] || "bg-gray-50";
    };

    // Calculate date limits for validation
    const getTodayDate = () => formatDateInputValue(new Date());

    const get30DaysAgoDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return formatDateInputValue(date);
    };

    // Requirement 1: Single Date Selection - if one date is selected and it's today, only today is allowed
    const getStartDateMinDate = () => {
        const today = getTodayDate();
        // If endDate is selected and it's today, allow 30 days back
        if (endDate === today) {
            return get30DaysAgoDate();
        }
        // If endDate is selected but not today, allow from 30 days back to endDate
        if (endDate) {
            const endDateObj = new Date(endDate);
            const minDate = new Date(endDateObj);
            minDate.setDate(minDate.getDate() - 30);
            return formatDateInputValue(minDate);
        }
        return undefined;
    };

    const getStartDateMaxDate = () => {
        // Start date cannot be after end date
        if (endDate) {
            return endDate;
        }
        return undefined;
    };

    const getEndDateMinDate = () => {
        // End date cannot be before start date
        if (startDate) {
            return startDate;
        }
        return undefined;
    };

    const getEndDateMaxDate = () => {
        const today = getTodayDate();
        // End date cannot be in future, maximum is today
        return today;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Student Performance Lists
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    Home / Student Performance / Daily Student Performance
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Date and Class/Subject Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Date Wise Column */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800 text-sm">
                                Date Wise
                            </h3>
                        </div>
                        <div className="p-3 border-b border-gray-200">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="form-label">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        min={getStartDateMinDate()}
                                        max={getStartDateMaxDate()}
                                        className="form-input text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        min={getEndDateMinDate()}
                                        max={getEndDateMaxDate()}
                                        className="form-input text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                        {startDate && endDate && formattedDates.length > 0 && (
                            <div className="overflow-y-auto max-h-64">
                                <div className="grid grid-cols-[60px_1fr] divide-x divide-y divide-gray-200 text-xs">
                                    <div className="bg-blue-50 px-2 py-2 font-semibold text-gray-700">
                                        S.No.
                                    </div>
                                    <div className="bg-blue-50 px-2 py-2 font-semibold text-gray-700">
                                        Date
                                    </div>
                                    {formattedDates.map((date, idx) => (
                                        <React.Fragment key={date.id}>
                                            <div className="px-2 py-2 text-gray-600">
                                                {idx + 1}
                                            </div>
                                            <button
                                                onClick={() => handleDateClick(date.raw)}
                                                className={`px-2 py-2 text-left font-medium transition ${
                                                    selectedDate === date.raw
                                                        ? "bg-blue-600 text-white"
                                                        : "text-blue-600 hover:bg-blue-50"
                                                }`}
                                            >
                                                {date.date}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                        {startDate && endDate && formattedDates.length === 0 && (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No dates available in this range
                            </div>
                        )}
                    </div>

                    {/* Class & Subject Wise Column */}
                    <div className="lg:col-span-2 border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800 text-sm">
                                Class & Subject Wise
                            </h3>
                        </div>
                        {!selectedDate && (
                            <div className="p-4 text-center text-sm text-gray-500">
                                Please select a date first
                            </div>
                        )}
                        {selectedDate && classesFromAPI && classesFromAPI.length > 0 && (
                            <>
                                <div className="px-4 py-3 bg-blue-50 grid grid-cols-[80px_1fr_1fr] gap-4 text-xs font-semibold text-gray-700 border-b border-gray-200">
                                    <div>S.No.</div>
                                    <div>Class / Section</div>
                                    <div>Subject</div>
                                </div>
                                <div className="divide-y divide-gray-200 text-xs max-h-64 overflow-y-auto">
                                    {classesFromAPI.map((cls, idx) => (
                                        <button
                                            key={`${cls.classId}-${cls.subjectId}`}
                                            onClick={() => {
                                                setSelectedClass(cls.classId);
                                                setSelectedSubject(cls.subjectId);
                                                setCurrentPage(1);
                                            }}
                                            className={`w-full grid grid-cols-[80px_1fr_1fr] gap-4 px-4 py-3 text-left transition ${
                                                selectedClass === cls.classId && selectedSubject === cls.subjectId
                                                    ? "bg-blue-600 text-white font-medium"
                                                    : "text-gray-700 hover:bg-blue-50"
                                            }`}
                                        >
                                            <div>{idx + 1}</div>
                                            <div>{cls.classCode}</div>
                                            <div>{cls.subjectName}</div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                        {selectedDate && classesFromAPI && classesFromAPI.length === 0 && (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No classes available for this date
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Wise Section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Student Wise</h3>
                    </div>

                    {/* Filters */}
                    {selectedDate && selectedClass && (
                        <div className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Search Student / Roll Number"
                                value={searchStudent}
                                onChange={(e) => {
                                    setSearchStudent(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="form-input"
                            />
                            <select
                                value={selectedPerformance}
                                onChange={(e) => {
                                    setSelectedPerformance(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="form-select"
                            >
                                {PERFORMANCE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option === "All"
                                            ? "Select Performance"
                                            : option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                        S.No.
                                    </th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                        Roll No.
                                    </th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">
                                        Academics &amp; Non-Academics
                                    </th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                        Teacher Comments
                                    </th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">
                                        Overall Performance
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : !selectedDate || !selectedClass ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            Please select a Date and Class/Subject to view students
                                        </td>
                                    </tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            No students found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="border-b border-gray-200 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-3 text-gray-700">
                                                {student.sNo}
                                            </td>
                                            <td className="px-6 py-3 text-gray-700">
                                                {student.rollNo}
                                            </td>
                                            <td className="px-6 py-3 text-gray-700 font-medium">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button
                                                    onClick={() => {
                                                        setModalData(student);
                                                        setShowModal(true);
                                                    }}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded text-blue-600 hover:bg-blue-50 transition"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-3 text-gray-600 text-xs max-w-xs truncate">
                                                {student.comments}
                                            </td>
                                            <td
                                                className={`px-6 py-3 font-medium text-sm ${getPerformanceColor(
                                                    student.performance
                                                )}`}
                                            >
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPerformanceBg(
                                                        student.performance
                                                    )} ${getPerformanceColor(student.performance)}`}
                                                >
                                                    {student.performance}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {selectedDate && selectedClass && filteredStudents.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                rowsPerPage={rowsPerPage}
                                setCurrentPage={setCurrentPage}
                                setRowsPerPage={setRowsPerPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && modalData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Academics &amp; Non-Academics
                                </h3>
                                <p className="text-blue-100 text-sm mt-1">
                                    {currentPerformance?.studentName || modalData.name} ({currentPerformance?.rollNo || modalData.rollNo})
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="hover:bg-blue-700 p-1 rounded transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Academics */}
                                    <div className="mb-8">
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                                            Academics
                                        </h4>
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-blue-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            S.No.
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            Subject
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            Handwriting
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            Understanding
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            Responding
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            Classwork &amp; Homework
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentPerformance?.academics && currentPerformance?.academics.length > 0 ? (
                                                        currentPerformance?.academics.map((item, idx) => (
                                                            <tr
                                                                key={idx}
                                                                className="border-b border-gray-200 hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {idx + 1}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {item.subjectName || item.subject || "-"}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {item.handwriting || "-"}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {item.understanding || "-"}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {item.responding || "-"}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {item.classworkHomework || "-"}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className="px-4 py-3 text-center text-gray-500 text-sm">
                                                                No academic data
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Non-Academics */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                                            Non-Academics
                                        </h4>
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-blue-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            S.No.
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            Particulars
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            Grade
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs">
                                                            Remarks
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentPerformance?.behaviours && currentPerformance?.behaviours.length > 0 ? (
                                                        currentPerformance?.behaviours.map((item, idx) => (
                                                            <tr
                                                                key={idx}
                                                                className="border-b border-gray-200 hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {idx + 1}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {formatBehaviourType(item.behaviourType)}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {item.grade || "-"}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 text-sm">
                                                                    {item.remarks || "-"}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="px-4 py-3 text-center text-gray-500 text-sm">
                                                                No non-academic data
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherStudentPerformanceList;
