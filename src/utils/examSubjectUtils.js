const getSubjectName = (subject) => {
  if (typeof subject === "string") return subject;
  if (typeof subject?.subject === "string") return subject.subject;
  if (subject?.subject && typeof subject.subject === "object") {
    return subject.subject.subjectName || subject.subject.name || subject.subject.title || "";
  }
  return subject?.subjectName || subject?.name || subject?.title || "";
};

export const isAdditionalExamSubject = (subject) => {
  const normalizedName = getSubjectName(subject)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  return /\b(gk|g k|general knowledge|islamic|islamiyat)\b/.test(normalizedName);
};

export const getCalculatedExamSubjects = (subjects) =>
  (Array.isArray(subjects) ? subjects : []).filter(
    (subject) => !isAdditionalExamSubject(subject),
  );

const subjectCollectionKeys = [
  "subjects",
  "examResults",
  "results",
  "subjectResults",
  "subjectResult",
  "subjectPerformance",
  "subjectWiseResults",
  "marks",
];

export const getExamResultSubjects = (result) => {
  for (const key of subjectCollectionKeys) {
    if (Array.isArray(result?.[key])) return result[key];
  }
  return null;
};

const getNumericSubjectValue = (subject, keys) => {
  const value = keys.map((key) => subject?.[key]).find((item) => item != null && item !== "");
  if (value == null) return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

export const getExamSubjectObtainedMarks = (subject) =>
  getNumericSubjectValue(subject, ["obtainedMarks", "marksObtained", "obtained", "marks"]);

export const getExamSubjectTotalMarks = (subject) =>
  getNumericSubjectValue(subject, ["totalMarks", "maxMarks", "maximumMarks", "max"]);
