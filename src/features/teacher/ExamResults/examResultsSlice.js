import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getAllExamResultsAPI,
  getTeacherExamResultsAPI,
  getStudentResultsAPI,
  getExamResultsByClassAPI,
  createExamResultAPI,
  updateExamResultAPI,
  deleteExamResultAPI,
  getAcademicYearsAPI,
  getClassesAPI,
  getSubjectsAPI,
  getExaminationTypesAPI,
  getStudentsByClassAPI,
} from "./examResultsAPI";
import {
  handlePending,
  handleRejected,
  handleSuccess,
} from "../../../utils/reducerHelpers";
import { commonState } from "../../../utils/commonState";

export const fetchAllExamResults = createAppAsyncThunk(
  "examResults/fetchAll",
  () => getAllExamResultsAPI()
);

export const fetchTeacherExamResults = createAppAsyncThunk(
  "examResults/fetchTeacher",
  (filters = {}) => getTeacherExamResultsAPI(filters)
);

export const fetchStudentResults = createAppAsyncThunk(
  "examResults/fetchStudentResults",
  ({ academicYearId, classId, subjectId, examinationTypeId }) =>
    getStudentResultsAPI(academicYearId, classId, subjectId, examinationTypeId)
);

export const fetchExamResultsByClass = createAppAsyncThunk(
  "examResults/fetchByClass",
  (classId) => getExamResultsByClassAPI(classId)
);

export const createExamResult = createAppAsyncThunk(
  "examResults/create",
  (examData) => createExamResultAPI(examData)
);

export const updateExamResult = createAppAsyncThunk(
  "examResults/update",
  ({ id, examData }) => updateExamResultAPI(id, examData)
);

export const deleteExamResult = createAppAsyncThunk(
  "examResults/delete",
  (id) => deleteExamResultAPI(id)
);

export const fetchAcademicYears = createAppAsyncThunk(
  "examResults/fetchAcademicYears",
  () => getAcademicYearsAPI()
);

export const fetchClasses = createAppAsyncThunk(
  "examResults/fetchClasses",
  () => getClassesAPI()
);

export const fetchSubjects = createAppAsyncThunk(
  "examResults/fetchSubjects",
  () => getSubjectsAPI()
);

export const fetchExaminationTypes = createAppAsyncThunk(
  "examResults/fetchExaminationTypes",
  () => getExaminationTypesAPI()
);

export const fetchStudentsByClass = createAppAsyncThunk(
  "examResults/fetchStudentsByClass",
  (classRoomId) => getStudentsByClassAPI(classRoomId)
);

const initialState = {
  examResults: [],
  teacherExamResults: [],
  studentResults: [],
  studentResultsDetails: null,
  academicYears: [],
  classes: [],
  subjects: [],
  examinationTypes: [],
  studentsByClass: [],
  ...commonState,
};

const examResultsSlice = createSlice({
  name: "examResults",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // Fetch all exam results
    builder
      .addCase(fetchAllExamResults.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchAllExamResults.fulfilled, (state, action) => {
        state.loading = false;
        state.examResults = action.payload;
      })

      .addCase(fetchAllExamResults.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Fetch teacher exam results
    builder
      .addCase(fetchTeacherExamResults.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchTeacherExamResults.fulfilled, (state, action) => {
        state.loading = false;

        state.teacherExamResults = action.payload?.dtoList || [];

        state.studentResultsDetails = action.payload;
      })

      .addCase(fetchTeacherExamResults.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Fetch student results
    builder
      .addCase(fetchStudentResults.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchStudentResults.fulfilled, (state, action) => {
        state.loading = false;

        state.studentResultsDetails = action.payload;

        state.studentResults = action.payload?.dtoList || [];
      })

      .addCase(fetchStudentResults.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Fetch exam results by class
    builder
      .addCase(fetchExamResultsByClass.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchExamResultsByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.examResults = action.payload;
      })

      .addCase(fetchExamResultsByClass.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Create exam result
    builder
      .addCase(createExamResult.pending, (state) => {
        handlePending(state);
      })

      .addCase(createExamResult.fulfilled, (state, action) => {
        handleSuccess(state);
        state.examResults.push(action.payload);
      })

      .addCase(createExamResult.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Update exam result
    builder
      .addCase(updateExamResult.pending, (state) => {
        handlePending(state);
      })

      .addCase(updateExamResult.fulfilled, (state, action) => {
        handleSuccess(state);

        const index = state.examResults.findIndex(
          (r) => r.id === action.payload.id
        );

        if (index > -1) {
          state.examResults[index] = action.payload;
        }
      })

      .addCase(updateExamResult.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Delete exam result
    builder
      .addCase(deleteExamResult.pending, (state) => {
        handlePending(state);
      })

      .addCase(deleteExamResult.fulfilled, (state, action) => {
        handleSuccess(state);

        state.examResults = state.examResults.filter(
          (r) => r.id !== action.meta.arg
        );
      })

      .addCase(deleteExamResult.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Fetch academic years
    builder
      .addCase(fetchAcademicYears.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.loading = false;
        state.academicYears = action.payload;
      })

      .addCase(fetchAcademicYears.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Fetch classes
    builder
      .addCase(fetchClasses.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })

      .addCase(fetchClasses.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Fetch subjects
    builder
      .addCase(fetchSubjects.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })

      .addCase(fetchSubjects.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Fetch examination types
    builder
      .addCase(fetchExaminationTypes.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchExaminationTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.examinationTypes = action.payload;
      })

      .addCase(fetchExaminationTypes.rejected, (state, action) => {
        handleRejected(state, action);
      });

    // Fetch students by class
    builder
      .addCase(fetchStudentsByClass.pending, (state) => {
        handlePending(state);
      })

      .addCase(fetchStudentsByClass.fulfilled, (state, action) => {
        state.loading = false;

        const students = action.payload.data || action.payload;

        state.studentsByClass = Array.isArray(students)
          ? students
          : [];
      })

      .addCase(fetchStudentsByClass.rejected, (state, action) => {
        handleRejected(state, action);
        state.studentsByClass = [];
      });
  },
});

export const { clearError, clearSuccess } =
  examResultsSlice.actions;

export default examResultsSlice.reducer;
