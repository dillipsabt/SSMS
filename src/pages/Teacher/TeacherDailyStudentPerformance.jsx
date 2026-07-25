import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Select from "react-select";
import {
    fetchSubjects,
    fetchClasses,
    fetchStudentByRollNumber,
    createPerformanceThunk,
    updatePerformanceThunk,
    clearSuccess,
    clearStudentInfo
} from "../../features/teacher/studentPerformance/performanceSlice";

const ACADEMIC_OPTIONS = [
    "Excellent",
    "Very Good",
    "Good",
    "Average",
    "Below Average",
    "Poor",
];

const GRADE_OPTIONS = ["EXCELLENT", "VERY_GOOD", "GOOD", "AVERAGE", "BELOW_AVERAGE", "POOR"];

const OVERALL_PERFORMANCE_OPTIONS = [
    "Excellent",
    "Very Good",
    "Good",
    "Average",
    "Below Average",
    "Poor",
];

// Enum mappings for API
const ACADEMIC_ENUM_MAP = {
    "Excellent": "EXCELLENT",
    "Very Good": "VERY_GOOD",
    "Good": "GOOD",
    "Average": "AVERAGE",
    "Below Average": "BELOW_AVERAGE",
    "Poor": "POOR",
};

const BEHAVIOUR_TYPE_MAP = {
    "Behavior in class": "BEHAVIOR_IN_CLASS",
    "Neatness": "NEATNESS",
    "Punctuality": "PUNCTUALITY",
    "Discipline": "DISCIPLINE",
    "Interaction with Teachers": "INTERACTION_WITH_TEACHERS",
    "Speaking Skills": "SPEAKING_SKILLS",
    "Listening Skills": "LISTENING_SKILLS",
    "Writing Skills": "WRITING_SKILLS",
    "Self Awareness": "SELF_AWARENESS",
    "Problem Solving": "PROBLEM_SOLVING",
    "Decision Making": "DECISION_MAKING",
    "Critical Thinking": "CRITICAL_THINKING",
    "Sports": "SPORTS",
    "Interested In": "INTERESTED_IN",
};

const GRADE_ENUM_MAP = {
    "EXCELLENT": "Excellent",
    "VERY_GOOD": "Very Good",
    "GOOD": "Good",
    "AVERAGE": "Average",
    "BELOW_AVERAGE": "Below Average",
    "POOR": "Poor",
};

const DEFAULT_NON_ACADEMICS = [
    {
        particular: "Behavior in class",
        grade: "",
        remarks: "",
    },
    {
        particular: "Neatness",
        grade: "",
        remarks: "",
    },
    {
        particular: "Punctuality",
        grade: "",
        remarks: "",
    },
    {
        particular: "Discipline",
        grade: "",
        remarks: "",
    },
    {
        particular: "Interaction with Teachers",
        grade: "",
        remarks: "",
    },
    {
        particular: "Speaking Skills",
        grade: "",
        remarks: "",
    },
    {
        particular: "Listening Skills",
        grade: "",
        remarks: "",
    },
    {
        particular: "Writing Skills",
        grade: "",
        remarks: "",
    },
    {
        particular: "Self Awareness",
        grade: "",
        remarks: "",
    },
    {
        particular: "Problem Solving",
        grade: "",
        remarks: "",
    },
    {
        particular: "Decision Making",
        grade: "",
        remarks: "",
    },
    {
        particular: "Critical Thinking",
        grade: "",
        remarks: "",
    },
    {
        particular: "Sports",
        grade: "",
        remarks: "",
    },
    {
        particular: "Interested In",
        grade: "",
        remarks: "",
    },
];

export default function TeacherDailyStudentPerformance() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        subjects,
        classes,
        studentInfo,
        studentLoading,
        loading,
        error,
        success,
    } = useSelector(
        (state) => state.teacherPerformance
    );

    /* =========================
          STUDENT DETAILS
       ========================= */

    const [formData, setFormData] = useState({
        studentRollNo: "",
        studentName: "",
        classSection: "",
        subject: "",
        subjectId: null,
        date: new Date().toISOString().split("T")[0],
        teacherComments: "",
        overallPerformance: "",
    });

    /* =========================
          OVERALL PERFORMANCE CALCULATION
       ========================= */

    const calculateOverallPerformance = (academicsData, nonAcademicsData) => {
        const scoreMap = {
            "EXCELLENT": 5,
            "VERY_GOOD": 4,
            "GOOD": 3,
            "AVERAGE": 2,
            "BELOW_AVERAGE": 1,
            "POOR": 0,
        };

        let totalScore = 0;
        let totalCount = 0;

        // Calculate score from academics
        academicsData.forEach((item) => {
            if (item.handwriting) {
                totalScore += scoreMap[ACADEMIC_ENUM_MAP[item.handwriting]] || 0;
                totalCount++;
            }
            if (item.understanding) {
                totalScore += scoreMap[ACADEMIC_ENUM_MAP[item.understanding]] || 0;
                totalCount++;
            }
            if (item.responding) {
                totalScore += scoreMap[ACADEMIC_ENUM_MAP[item.responding]] || 0;
                totalCount++;
            }
            if (item.classworkHomework) {
                totalScore += scoreMap[ACADEMIC_ENUM_MAP[item.classworkHomework]] || 0;
                totalCount++;
            }
        });

        // Calculate score from non-academics
        nonAcademicsData.forEach((item) => {
            if (item.grade) {
                totalScore += scoreMap[item.grade] || 0;
                totalCount++;
            }
        });

        // Calculate average
        if (totalCount === 0) return "";

        const averageScore = totalScore / totalCount;

        // Map average score to performance level
        if (averageScore >= 4.5) return "Excellent";
        if (averageScore >= 3.5) return "Very Good";
        if (averageScore >= 2.5) return "Good";
        if (averageScore >= 1.5) return "Average";
        if (averageScore >= 0.5) return "Below Average";
        return "Poor";
    };

    const resetForm = () => {
        setFormData({
            studentRollNo: "",
            studentName: "",
            classSection: "",
            subject: "",
            subjectId: null,
            date: "",
            teacherComments: "",
            overallPerformance: "",
        });

        // Reset academics
        setAcademics(
            subjects.map((subject) => ({
                subject: subject.subjectName,
                subjectId: subject.id,
                handwriting: "",
                understanding: "",
                responding: "",
                classworkHomework: "",
            }))
        );

        // Reset non-academics
        setNonAcademics(
            DEFAULT_NON_ACADEMICS.map((item) => ({
                ...item,
            }))
        );
    };

    /* =========================
          ACADEMIC TABLE
       ========================= */

    const [academics, setAcademics] = useState([]);

    /* =========================
          NON-ACADEMIC TABLE
       ========================= */

    const [nonAcademics, setNonAcademics] = useState(
        DEFAULT_NON_ACADEMICS
    );

    useEffect(() => {
        dispatch(fetchSubjects());
        dispatch(fetchClasses());
    }, [dispatch]);

    // Generate academics array from fetched subjects
    useEffect(() => {
        if (subjects && subjects.length > 0) {
            const academicsArray = subjects.map((subject) => ({
                subject: subject.subjectName,
                subjectId: subject.id,
                handwriting: "",
                understanding: "",
                responding: "",
                classworkHomework: "",
            }));
            setAcademics(academicsArray);
        }
    }, [subjects]);

    useEffect(() => {
        if (studentInfo) {
            setFormData((prev) => ({
                ...prev,
                studentName: studentInfo.studentName || "",
                classSection: studentInfo.className || "",
            }));
        }
    }, [studentInfo]);

    useEffect(() => {
        if (!success) return;

        toast.success("Performance submitted successfully");

        resetForm();

        dispatch(clearStudentInfo());
        dispatch(clearSuccess());
    }, [success, dispatch, subjects]);

    useEffect(() => {
        if (error && error !== null) {
            const errorMsg = typeof error === "string" ? error : (error?.message || "Failed to submit");
            if (errorMsg) {
                toast.error(errorMsg);
            }
        }
    }, [error]);

    // Auto-calculate overall performance whenever academics or non-academics change
    useEffect(() => {
        const calculatedPerformance = calculateOverallPerformance(academics, nonAcademics);
        setFormData((prev) => ({
            ...prev,
            overallPerformance: calculatedPerformance,
        }));
    }, [academics, nonAcademics]);

    /* =========================
          INPUT HANDLER
       ========================= */

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =========================
          ACADEMICS HANDLER
       ========================= */

    const handleAcademicChange = (
        index,
        field,
        value
    ) => {
        const updatedAcademics = [...academics];

        updatedAcademics[index] = {
            ...updatedAcademics[index],
            [field]: value,
        };

        setAcademics(updatedAcademics);
    };

    /* =========================
         NON-ACADEMICS HANDLER
       ========================= */

    const handleNonAcademicChange = (
        index,
        field,
        value
    ) => {
        const updatedNonAcademics = [...nonAcademics];

        updatedNonAcademics[index] = {
            ...updatedNonAcademics[index],
            [field]: value,
        };

        setNonAcademics(updatedNonAcademics);
    };

    /* =========================
            VALIDATION
       ========================= */

    const validateForm = () => {
        if (!formData.studentRollNo.trim()) {
            toast.error("Student Roll No is required");
            return false;
        }

        if (!formData.studentName.trim()) {
            toast.error("Student Name is required");
            return false;
        }

        if (!formData.classSection) {
            toast.error("Class/Section is required");
            return false;
        }

        if (!formData.subject) {
            toast.error("Subject is required");
            return false;
        }

        if (!formData.date) {
            toast.error("Date is required");
            return false;
        }

        if (!formData.overallPerformance) {
            toast.error("Overall Performance is required");
            return false;
        }

        return true;
    };

    /* =========================
            SUBMIT
       ========================= */

    const handleSubmit = () => {
        if (!validateForm()) return;

        // Build academics array - only include entries with at least one filled field
        const academicsArray = academics
            .filter((item) => item.handwriting || item.understanding || item.responding || item.classworkHomework)
            .map((item) => ({
                subjectId: item.subjectId,
                ...(item.handwriting && { handwriting: ACADEMIC_ENUM_MAP[item.handwriting] }),
                ...(item.understanding && { understanding: ACADEMIC_ENUM_MAP[item.understanding] }),
                ...(item.responding && { responding: ACADEMIC_ENUM_MAP[item.responding] }),
                ...(item.classworkHomework && { classworkHomework: ACADEMIC_ENUM_MAP[item.classworkHomework] }),
            }));

        // Build behaviours array - only include filled entries
        const behavioursArray = nonAcademics
            .filter((item) => item.grade || item.remarks)
            .map((item) => ({
                behaviourType: BEHAVIOUR_TYPE_MAP[item.particular] || item.particular,
                ...(item.grade && { grade: item.grade }),
                ...(item.remarks && { remarks: item.remarks }),
            }));

        const payload = {
            rollNo: formData.studentRollNo.trim(),
            subjectId: formData.subjectId,
            date: formData.date,
            ...(formData.teacherComments && { teacherComments: formData.teacherComments.trim() }),
            overallPerformance: ACADEMIC_ENUM_MAP[formData.overallPerformance],
            academics: academicsArray,
            behaviours: behavioursArray,
        };

        dispatch(createPerformanceThunk(payload));
    };

    return (
        <div className="min-h-screen bg-white p-4 md:p-6">
            {/* Page Header */}
            <div className="mb-5">
                <h1 className="text-[22px] font-semibold">
                    Daily Student Performance
                </h1>

                <p className="text-sm text-[#64748B] mt-1">
                    Teacher / Daily Student Performance
                </p>
            </div>

            {/* Student Details Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">

                {/* Header */}
                <div className="px-4 py-4 border-b border-gray-300">
                    <h2 className="text-[16px] font-semibold text-[#334155]">
                        Student Details
                    </h2>
                </div>

                {/* Body */}
                <div className="p-4 md:p-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        {/* Roll Number */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-2">
                                Student Roll No
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                name="studentRollNo"
                                value={formData.studentRollNo}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setFormData((prev) => ({
                                        ...prev,
                                        studentRollNo: value,
                                    }));

                                    if (value.trim()) {
                                        dispatch(
                                            fetchStudentByRollNumber(value.trim())
                                        );
                                    }
                                }}
                                placeholder="Enter Roll Number"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </div>

                        {/* Student Name */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-2">
                                Student Name
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            <input
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleInputChange}
                                readOnly
                                placeholder="Student Name"
                                className="w-full h-11 px-3 rounded-md border border-gray-300 text-sm "
                            />
                        </div>

                        {/* Class Section */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-2">
                                Class / Section
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            <Select
                                isDisabled={true}
                                className="w-full"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                                options={[
                                    { value: "", label: "Select" },
                                    ...(classes?.map((cls) => ({
                                        value: cls.classCode,
                                        label: cls.classCode,
                                    })) || []),
                                ]}
                                value={[
                                    { value: "", label: "Select" },
                                    ...(classes?.map((cls) => ({
                                        value: cls.classCode,
                                        label: cls.classCode,
                                    })) || []),
                                ].find((item) => item.value === formData.classSection)}
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        classSection: selected?.value || "",
                                    })
                                }
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-2">
                                Date
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        date: e.target.value,
                                    })
                                }
                                max={new Date().toISOString().split("T")[0]}
                                className="w-full h-11 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2"
                            />
                        </div>

                    </div>

                    {/* Subject Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-2">
                                Subject
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            <Select
                                className="w-full"
                                menuPortalTarget={document.body}
                                menuPlacement="auto"
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                                options={[
                                    { value: "", subjectId: null, label: "Select Subject" },
                                    ...(subjects?.map((subject) => ({
                                        value: subject.subjectName,
                                        subjectId: subject.id,
                                        label: subject.subjectName,
                                    })) || []),
                                ]}
                                value={[
                                    { value: "", subjectId: null, label: "Select Subject" },
                                    ...(subjects?.map((subject) => ({
                                        value: subject.subjectName,
                                        subjectId: subject.id,
                                        label: subject.subjectName,
                                    })) || []),
                                ].find((item) => item.value === formData.subject)}
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        subject: selected?.value || "",
                                        subjectId: selected?.subjectId || null,
                                    })
                                }
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Academics Heading */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-300">
                    <h2 className="text-[16px] px-4 py-2 font-semibold text-[#334155]">
                        Academics
                    </h2>
                </div>
                {/* Academics Table */}
                <div className="px-4 py-2">
                    <div className="overflow-x-auto rounded border border-gray-200">
                        <table className="w-full min-w-[1100px] border-collapse">
                            <thead>
                                <tr className="bg-indigo-50">
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-[#334155]">
                                        S.No.
                                    </th>

                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-[#334155]">
                                        Subject
                                    </th>

                                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-[#334155]">
                                        Handwriting
                                    </th>

                                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-[#334155]">
                                        Understanding
                                    </th>

                                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-[#334155]">
                                        Responding
                                    </th>

                                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-[#334155]">
                                        Classwork &amp; Homework
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {academics
                                    .map((row, originalIndex) => ({ row, originalIndex }))
                                    .filter(({ row }) => !formData.subject || row.subject === formData.subject)
                                    .map(({ row, originalIndex }, displayIndex) => (
                                    <tr
                                        key={row.subject}
                                        className="transition-colors"
                                    >
                                        {/* S.No */}
                                        <td className="border border-gray-300 px-4 py-3 text-sm text-[#475569]">
                                            {displayIndex + 1}
                                        </td>

                                        {/* Subject */}
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-[#334155]">
                                            {row.subject}
                                        </td>

                                        {/* Handwriting */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <Select
                                                className="w-full min-w-[180px]"
                                                menuPortalTarget={document.body}
                                                menuPlacement="auto"
                                                menuShouldBlockScroll
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                options={[
                                                    { value: "", label: "Select" },
                                                    ...ACADEMIC_OPTIONS.map((option) => ({
                                                        value: option,
                                                        label: option,
                                                    })),
                                                ]}
                                                value={[
                                                    { value: "", label: "Select" },
                                                    ...ACADEMIC_OPTIONS.map((option) => ({
                                                        value: option,
                                                        label: option,
                                                    })),
                                                ].find((item) => item.value === row.handwriting)}
                                                onChange={(selected) =>
                                                    handleAcademicChange(
                                                        originalIndex,
                                                        "handwriting",
                                                        selected?.value || ""
                                                    )
                                                }
                                            />
                                        </td>

                                        {/* Understanding */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <Select
                                                className="w-full min-w-[180px]"
                                                menuPortalTarget={document.body}
                                                menuPlacement="auto"
                                                menuShouldBlockScroll
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                options={[
                                                    { value: "", label: "Select" },
                                                    ...ACADEMIC_OPTIONS.map((option) => ({
                                                        value: option,
                                                        label: option,
                                                    })),
                                                ]}
                                                value={[
                                                    { value: "", label: "Select" },
                                                    ...ACADEMIC_OPTIONS.map((option) => ({
                                                        value: option,
                                                        label: option,
                                                    })),
                                                ].find((item) => item.value === row.understanding)}
                                                onChange={(selected) =>
                                                    handleAcademicChange(
                                                        originalIndex,
                                                        "understanding",
                                                        selected?.value || ""
                                                    )
                                                }
                                            />
                                        </td>

                                        {/* Responding */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <Select
                                                className="w-full min-w-[180px]"
                                                menuPortalTarget={document.body}
                                                menuPlacement="auto"
                                                menuShouldBlockScroll
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                options={[
                                                    { value: "", label: "Select" },
                                                    ...ACADEMIC_OPTIONS.map((option) => ({
                                                        value: option,
                                                        label: option,
                                                    })),
                                                ]}
                                                value={[
                                                    { value: "", label: "Select" },
                                                    ...ACADEMIC_OPTIONS.map((option) => ({
                                                        value: option,
                                                        label: option,
                                                    })),
                                                ].find((item) => item.value === row.responding)}
                                                onChange={(selected) =>
                                                    handleAcademicChange(
                                                        originalIndex,
                                                        "responding",
                                                        selected?.value || ""
                                                    )
                                                }
                                            />
                                        </td>

                                        {/* Classwork & Homework */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <Select
                                                className="w-full min-w-[180px]"
                                                menuPortalTarget={document.body}
                                                menuPlacement="auto"
                                                menuShouldBlockScroll
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                options={[
                                                    { value: "", label: "Select" },
                                                    ...ACADEMIC_OPTIONS.map((option) => ({
                                                        value: option,
                                                        label: option,
                                                    })),
                                                ]}
                                                value={[
                                                    { value: "", label: "Select" },
                                                    ...ACADEMIC_OPTIONS.map((option) => ({
                                                        value: option,
                                                        label: option,
                                                    })),
                                                ].find((item) => item.value === row.classworkHomework)}
                                                onChange={(selected) =>
                                                    handleAcademicChange(
                                                        originalIndex,
                                                        "classworkHomework",
                                                        selected?.value || ""
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Non Academics Heading */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                <div className="px-4 py-2 border-b border-gray-300">
                    <h2 className="text-[16px] font-semibold text-[#334155]">
                        Non-Academics
                    </h2>
                </div>
                {/* Non-Academics Table */}
                <div className="px-4 py-2">
                    <div className="overflow-x-auto rounded border border-gray-200">
                        <table className="w-full min-w-[900px] border-collapse">
                            <thead>
                                <tr className="bg-indigo-50">
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-[#334155] w-20">
                                        S.No.
                                    </th>

                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-[#334155]">
                                        Particulars
                                    </th>

                                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-[#334155] w-48">
                                        Grade
                                    </th>

                                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-[#334155]">
                                        Remarks
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {nonAcademics.map((row, index) => (
                                    <tr
                                        key={row.particular}
                                        className="transition-colors"
                                    >
                                        {/* S.No */}
                                        <td className="border border-gray-300 px-4 py-3 text-sm text-[#475569]">
                                            {index + 1}
                                        </td>

                                        {/* Particular */}
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-[#334155]">
                                            {row.particular}
                                        </td>

                                        {/* Grade */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <Select
                                                className="w-full min-w-[160px]"
                                                menuPortalTarget={document.body}
                                                menuPlacement="auto"
                                                menuShouldBlockScroll
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                options={[
                                                    { value: "", label: "Select Grade" },
                                                    ...GRADE_OPTIONS.map((grade) => ({
                                                        value: grade,
                                                        label: GRADE_ENUM_MAP[grade] || grade,
                                                    })),
                                                ]}
                                                value={[
                                                    { value: "", label: "Select Grade" },
                                                    ...GRADE_OPTIONS.map((grade) => ({
                                                        value: grade,
                                                        label: GRADE_ENUM_MAP[grade] || grade,
                                                    })),
                                                ].find((item) => item.value === row.grade)}
                                                onChange={(selected) =>
                                                    handleNonAcademicChange(
                                                        index,
                                                        "grade",
                                                        selected?.value || ""
                                                    )
                                                }
                                            />
                                        </td>

                                        {/* Remarks */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <input
                                                type="text"
                                                value={row.remarks}
                                                placeholder="Enter remarks"
                                                onChange={(e) =>
                                                    handleNonAcademicChange(
                                                        index,
                                                        "remarks",
                                                        e.target.value
                                                    )
                                                }
                                                className="
                          w-full
                          h-10
                          rounded-lg
                          border border-gray-300
                          px-3
                          text-sm
                          focus:outline-none
                          focus:ring-2
                        "
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Teacher Comments Section */}
            <div className="px-4 py-2">
                <h2 className="text-[16px] font-semibold text-[#334155] mb-4">
                    Teacher Comments
                </h2>

                {/* Teacher Comments */}
                <textarea
                    name="teacherComments"
                    value={formData.teacherComments}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter teacher comments..."
                    className="
                w-full
                rounded-xl
                border border-gray-300
                px-4
                py-3
                text-sm
                resize-none
                focus:outline-none
                focus:ring-2
              "
                />

                {/* Overall Performance */}
                <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-end gap-4">
                    <label className="block text-sm font-medium text-[#334155] mb-2">
                        Overall Performance
                        <span className="text-red-500 ml-1">*</span>
                    </label>

                    <Select
                        isDisabled={true}
                        className="w-full md:w-[300px]"
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        options={[
                            { value: "", label: "Select Performance" },
                            ...OVERALL_PERFORMANCE_OPTIONS.map((option) => ({
                                value: option,
                                label: option,
                            })),
                        ]}
                        value={[
                            { value: "", label: "Select Performance" },
                            ...OVERALL_PERFORMANCE_OPTIONS.map((option) => ({
                                value: option,
                                label: option,
                            })),
                        ].find(
                            (item) => item.value === formData.overallPerformance
                        )}
                        onChange={(selected) =>
                            setFormData({
                                ...formData,
                                overallPerformance: selected?.value || "",
                            })
                        }
                    />
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="
                  bg-indigo-600
                  text-white
                  font-medium
                  text-sm
                  px-8
                  py-3
                  rounded-lg
                  shadow-sm
                  transition-colors
                "
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
