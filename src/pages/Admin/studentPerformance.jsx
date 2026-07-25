import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAvailableDates,
    fetchTeachersByDate,
    fetchClassesByDateAndTeacher,
    fetchStudentPerformanceList,
    fetchStudentPerformanceDetails,
} from "../../features/Admin/StudentPerformance/studentPerformanceSlice";
import Pagination from "../../components/common/Pagination";
import { toast } from "sonner";

const StudentPerformance = () => {
    const dispatch = useDispatch();
    const {
        performanceListData,
        performanceData,
        dates,
        allDates,
        teachers,
        classesFromAPI,
        loading,
        error
    } = useSelector(
        (state) => state.studentPerformance
    );

    // State for drill-down flow
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [searchStudent, setSearchStudent] = useState("");
    const [selectedPerformance, setSelectedPerformance] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [teacherList, setTeacherList] = useState([]);
    const [classList, setClassList] = useState([]);

    // ============================
    // FETCH AVAILABLE DATES ON MOUNT
    // ============================
    useEffect(() => {
        dispatch(fetchAvailableDates());
    }, [dispatch]);

    // ============================
    // FETCH TEACHERS WHEN DATE SELECTED
    // ============================
    useEffect(() => {
        if (selectedDate) {
            dispatch(fetchTeachersByDate(selectedDate));
            // Reset dependent selections
            setSelectedTeacher(null);
            setSelectedClass(null);
            setTeacherList([]);
            setClassList([]);
            setCurrentPage(1);
        }
    }, [selectedDate, dispatch]);

    // Update teacher list from API
    useEffect(() => {
        if (selectedDate && teachers?.length > 0 && !selectedTeacher) {
            setTeacherList(teachers);
        }
    }, [teachers, selectedDate, selectedTeacher]);

    // ============================
    // FETCH CLASSES WHEN TEACHER SELECTED
    // ============================
    useEffect(() => {
        if (selectedDate && selectedTeacher) {
            dispatch(fetchClassesByDateAndTeacher({ date: selectedDate, teacherId: selectedTeacher }));
            // Reset dependent selections
            setSelectedClass(null);
            setClassList([]);
            setCurrentPage(1);
        }
    }, [selectedDate, selectedTeacher, dispatch]);

    // Update class list from API
    useEffect(() => {
        if (selectedTeacher && classesFromAPI?.length > 0 && !selectedClass) {
            setClassList(classesFromAPI);
        }
    }, [classesFromAPI, selectedTeacher, selectedClass]);

    // ============================
    // FETCH STUDENT PERFORMANCE LIST
    // ============================
    useEffect(() => {
        if (!selectedDate || !selectedTeacher || !selectedClass) return;

        const params = {
            page: currentPage - 1,
            size: rowsPerPage,
            date: selectedDate,
            teacherId: selectedTeacher,
        };

        // Get classId and subjectId from selected class
        const selectedClassObj = apiClasses.find(
            (c) => c.id === selectedClass
        );
        if (selectedClassObj) {
            params.classId = selectedClassObj.classId;
            if (selectedClassObj.subjectId) {
                params.subjectId = selectedClassObj.subjectId;
            }
        }

        if (searchStudent) params.search = searchStudent;
        if (selectedPerformance !== "All") {
            // Map UI values to API values
            const performanceMap = {
                "Good": "PASS",
                "Very Good": "PASS",
                "Average": "PASS",
                "Below Average": "PASS",
                "Poor": "FAIL"
            };
            params.performance = performanceMap[selectedPerformance] || selectedPerformance;
        }

        dispatch(fetchStudentPerformanceList(params));
    }, [dispatch, selectedDate, selectedTeacher, selectedClass, searchStudent, selectedPerformance, currentPage, rowsPerPage]);

    // ============================
    // FETCH PERFORMANCE DETAILS ON MODAL OPEN
    // ============================
    useEffect(() => {
        if (showModal && modalData && modalData.id) {
            dispatch(fetchStudentPerformanceDetails(modalData.id));
        }
    }, [showModal, modalData, dispatch]);

    // ============================
    // ERROR HANDLING
    // ============================
    useEffect(() => {
        if (error) {
            toast.error(error?.message || "Failed to load performance data");
        }
    }, [error]);

    // Format dates from API
    const formattedDates = (allDates || []).map((dateStr) => {
        const date = new Date(dateStr);
        return {
            id: dateStr,
            date: date.toLocaleDateString("en-GB"),
        };
    });

    // Transform teachers from API
    const apiTeachers = (teacherList || []).map((teacher) => ({
        id: teacher.teacherId,
        name: teacher.teacherName,
    }));

    // Transform classes from API
    const apiClasses = (classList || []).map((cls) => ({
        id: `${cls.classId}_${cls.subjectId}`,
        class: cls.className,
        subject: cls.subjectName,
        classId: cls.classId,
        subjectId: cls.subjectId,
    }));

    // Transform students from API
    const apiStudents = (performanceListData?.content ?? []).map(
        (student, idx) => ({
            id: student.performanceId,
            sNo: (currentPage - 1) * rowsPerPage + idx + 1,
            rollNo: student.rollNo ?? "-",
            name: student.studentName ?? "-",
            grade: student.grade ?? "-",
            comments: student.teacherComments ?? "-",
            performance: student.overallPerformance || "-",
            percentage: student.percentage ?? 0,
            examDate: student.examDate ?? "",
            academics: student.academics || [],
            nonAcademics: student.nonAcademics || [],
        })
    );

    // Display teachers from API (API filters them based on selected date)
    const displayTeachers = apiTeachers;

    // Display classes from API (API filters them based on selected teacher)
    const displayClasses = apiClasses;

    // Students from API (already filtered by API based on selected filters)
    const filteredStudents = apiStudents;
    const totalPages = performanceListData?.totalPages ?? 1;

    const getPerformanceColor = (perf) => {
        const colors = {
            "PASS": "text-green-600",
            "FAIL": "text-red-600",
            "Good": "text-blue-600",
            "Very Good": "text-green-600",
            "Average": "text-orange-600",
            "Below Average": "text-red-600",
            "Poor": "text-red-800"
        };
        return colors[perf] || "text-gray-600";
    };

    return (
        <div>
            {/* Header */}
            <h2 className="text-[18px] font-semibold text-[#333333]">Student Performance Lists</h2>
            <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">Home/ Student Performance / Daily Student Performance</p>

            {/* Three Column Filter Section with Headers */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr] gap-4 mb-6">
                {/* Date Wise Column */}
                <div className="card p-0 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Date Wise</h4>
                    </div>
                    <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        className="w-full px-4 py-2 border-0 border-b border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    />
                    <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-gray-700 px-4 py-2 bg-blue-50 border-b border-gray-200 grid grid-cols-2">
                            <span>S.No.</span>
                            <span>Date</span>
                        </div>
                        <div className="max-h-56 overflow-y-auto">
                            {formattedDates.map((date, idx) => (
                                <div
                                    key={date.id}
                                    onClick={() => {
                                        setSelectedDate(date.id);

                                        setSelectedTeacher(null);
                                        setSelectedClass(null);

                                        setTeacherList([]);
                                        setClassList([]);

                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 text-xs cursor-pointer border-b border-gray-200 grid grid-cols-2 transition ${selectedDate === date.id
                                        ? "bg-blue-500 text-white font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <span>{idx + 1}</span>
                                    <span>{date.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Teacher Wise Column */}
                <div className="card p-0 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Teacher Wise</h4>
                    </div>
                    <input
                        type="text"
                        placeholder="Search Teacher"
                        className="w-full px-4 py-2 border-0 border-b border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    />
                    <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-gray-700 px-4 py-2 bg-blue-50 border-b border-gray-200 grid grid-cols-2">
                            <span>S.No.</span>
                            <span>Teacher Name</span>
                        </div>
                        <div className="max-h-56 overflow-y-auto">
                            {selectedDate ? (
                                displayTeachers.length > 0 ? (
                                    displayTeachers.map((teacher, idx) => (
                                        <div
                                            key={teacher.id}
                                            onClick={() => {
                                                setSelectedTeacher(teacher.id);

                                                setSelectedClass(null);

                                                setClassList([]);

                                                setCurrentPage(1);
                                            }}
                                            className={`px-4 py-2 text-xs cursor-pointer border-b border-gray-200 grid grid-cols-2 transition ${selectedTeacher === teacher.id
                                                ? "bg-blue-500 text-white font-medium"
                                                : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span>{idx + 1}</span>
                                            <span>{teacher.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-center text-gray-500 text-xs">
                                        No Data Found
                                    </div>
                                )
                            ) : (
                                <div className="px-4 py-3 text-center text-gray-500 text-xs">
                                    No Data Found
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Class Wise Column */}
                <div className="card p-0 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800">Class Wise</h4>
                    </div>
                    <input
                        type="text"
                        placeholder="Search Class"
                        className="w-full px-4 py-2 border-0 border-b border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    />
                    <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-gray-700 px-4 py-2 bg-blue-50 border-b border-gray-200 grid grid-cols-[50px_1fr_1fr]">
                            <span>S.No.</span>
                            <span>Class / Section</span>
                            <span>Subject</span>
                        </div>
                        <div className="max-h-56 overflow-y-auto">
                            {selectedTeacher ? (
                                displayClasses.length > 0 ? (
                                    displayClasses.map((cls, idx) => (
                                        <div
                                            key={cls.id}
                                            onClick={() => {
                                                setSelectedClass(cls.id);
                                                setCurrentPage(1);
                                            }}
                                            className={`px-4 py-2 text-xs cursor-pointer border-b border-gray-200 grid grid-cols-[50px_1fr_1fr] transition ${selectedClass === cls.id
                                                ? "bg-blue-500 text-white font-medium"
                                                : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <span>{idx + 1}</span>
                                            <span>{cls.class}</span>
                                            <span>{cls.subject}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-center text-gray-500 text-xs">
                                        No Data Found
                                    </div>
                                )
                            ) : (
                                <div className="px-4 py-3 text-center text-gray-500 text-xs">
                                    No Data Found
                                </div>
                            )}
                        </div>
                        <div className="text-xs font-semibold text-gray-700 px-4 py-2 bg-blue-50 border-b border-gray-200 grid grid-cols-2"></div>
                    </div>
                </div>
            </div>

            {/* Student Wise Table Section */}
            <div className="card p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">Student Wise</h4>

                {/* Display selected filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="text-xs">
                        <span className="font-semibold text-gray-700">Date</span>
                        <div className="text-gray-600">{selectedDate ? formattedDates.find(d => d.id === selectedDate)?.date : "-"}</div>
                    </div>
                    <div className="text-xs">
                        <span className="font-semibold text-gray-700">Class</span>
                        <div className="text-gray-600">{selectedClass ? apiClasses.find(c => c.id === selectedClass)?.class : "-"}</div>
                    </div>
                    <div className="text-xs">
                        <span className="font-semibold text-gray-700">Teacher Name</span>
                        <div className="text-gray-600">{selectedTeacher ? apiTeachers.find(t => t.id === selectedTeacher)?.name : "-"}</div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="Search Student / Roll Number"
                        value={searchStudent}
                        onChange={(e) => {
                            setSearchStudent(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <select
                        value={selectedPerformance}
                        onChange={(e) => setSelectedPerformance(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="All">Select Performance</option>
                        <option value="Good">Good</option>
                        <option value="Very Good">Very Good</option>
                        <option value="Average">Average</option>
                        <option value="Below Average">Below Average</option>
                        <option value="Poor">Poor</option>
                    </select>
                </div>

                {/* Table */}
                <div className="border border-gray-300 rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border border-gray-200">
                            <thead className="bg-gray-50 border-b border-gray-300">
                                <tr>
                                    <th className="px-3 py-3 text-left font-semibold text-gray-700">S.No.</th>
                                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Roll No.</th>
                                    <th className="px-3 py-3  font-semibold text-gray-700">Student Name</th>
                                    <th className="px-3 py-3  font-semibold text-gray-700">Academics & Non- Academics</th>
                                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Teacher Comments</th>
                                    <th className="px-3 py-3 text-left font-semibold text-gray-700">Overall Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!selectedClass ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">
                                            Please select class
                                        </td>
                                    </tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">
                                            No students found
                                        </td>
                                    </tr>
                                ) : filteredStudents.map((student) => (
                                    <tr key={student.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-3 py-3 text-gray-800">{student.sNo}</td>
                                        <td className="px-3 py-3 text-gray-800">{student.rollNo}</td>
                                        <td className="px-3 py-3 text-gray-800 text-center">{student.name}</td>
                                        <td className="px-3 py-3 text-gray-800 text-center">
                                            <button
                                                onClick={() => {
                                                    setModalData(student);
                                                    setShowModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                        <td className="px-3 py-3 text-gray-700 text-xs">{student.comments}</td>
                                        <td className={`px-3 py-3 font-medium text-sm ${getPerformanceColor(student.performance)}`}>
                                            {student.performance}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    setCurrentPage={setCurrentPage}
                    setRowsPerPage={() => { }}
                />
            </div>

            {/* Modal */}
            {showModal && modalData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Academics & Non-Academics</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="hover:bg-blue-700 p-1 rounded transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Academics */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Academics</h4>
                                        <div className="border border-gray-200 rounded-md overflow-hidden">
                                            <table className="w-full text-[12px]">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">S.No.</th>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Subject</th>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Handwriting</th>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Understanding</th>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Responding</th>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Classwork & Homework</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {performanceData?.academics?.length > 0 ? (
                                                        performanceData?.academics?.map((subject, idx) => (
                                                            <tr key={idx} className="border-t border-gray-200">
                                                                <td className="px-3 py-2 text-gray-800 border-r border-gray-200">{idx + 1}</td>
                                                                <td className="px-3 py-2 text-gray-800 border-r border-gray-200">{subject.subjectName || "-"}</td>
                                                                <td className="px-3 py-2 text-gray-800 border-r border-gray-200">{subject.handwriting || "-"}</td>
                                                                <td className="px-3 py-2 text-gray-800 border-r border-gray-200">{subject.understanding || "-"}</td>
                                                                <td className="px-3 py-2 text-gray-800 border-r border-gray-200">{subject.responding || "-"}</td>
                                                                <td className="px-3 py-2 text-gray-800">{subject.classworkHomework || "-"}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className="px-3 py-2 text-center text-gray-500">No academic data</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Non-Academics */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Non-Academics</h4>
                                        <div className="border border-gray-200 rounded-md overflow-hidden">
                                            <table className="w-full text-[12px]">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">S.No.</th>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Particulars</th>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700 border-r border-gray-200">Grade</th>
                                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {performanceData?.behaviours?.length > 0 ? (
                                                        performanceData?.behaviours?.map((item, idx) => (
                                                            <tr key={idx} className="border-t border-gray-200">
                                                                <td className="px-3 py-2 text-gray-800 border-r border-gray-200">{idx + 1}</td>
                                                                <td className="px-3 py-2 text-gray-800 border-r border-gray-200">{item.behaviourType || "-"}</td>
                                                                <td className="px-3 py-2 text-gray-800 border-r border-gray-200">{item.grade || "-"}</td>
                                                                <td className="px-3 py-2 text-gray-800">{item.remarks || "-"}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="px-3 py-2 text-center text-gray-500">No non-academic data</td>
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

export default StudentPerformance;
