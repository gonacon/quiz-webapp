// 학년
export const GRADE_OPTIONS = [
  { value: "grade2", label: "중학교 2학년" },
  { value: "grade3", label: "중학교 3학년" },
  { value: "grade10", label: "고등학교 1학년" },
  { value: "grade11", label: "고등학교 2학년" },
  { value: "grade12", label: "고등학교 3학년" },
];
export const GRADE_LABEL_MAP = Object.fromEntries(GRADE_OPTIONS.map(({ value, label }) => [value, label]));

// 학기
export const SEMESTER_OPTIONS = [
  { value: "sem1", label: "1학기" },
  { value: "sem2", label: "2학기" },
];
export const SEMESTER_LABEL_MAP = Object.fromEntries(SEMESTER_OPTIONS.map(({ value, label }) => [value, label]));

// 시험 종류
export const EXAM_TYPE_OPTIONS = [
  { value: "mid", label: "중간고사" },
  { value: "final", label: "기말고사" },
];
export const EXAM_TYPE_LABEL_MAP = Object.fromEntries(EXAM_TYPE_OPTIONS.map(({ value, label }) => [value, label]));

// 과목
export const SUBJECT_OPTIONS = [
  { value: "korean", label: "국어" },
  { value: "math", label: "수학" },
  { value: "english", label: "영어" },
  { value: "science", label: "과학" },
  { value: "social", label: "사회" },
];
export const SUBJECT_LABEL_MAP = Object.fromEntries(SUBJECT_OPTIONS.map(({ value, label }) => [value, label]));