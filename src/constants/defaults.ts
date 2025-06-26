// 애플리케이션 기본값 상수

// 초기 필터 상태
export const INITIAL_FILTER_STATE = {
    grade: "grade3" as const,
    semester: "sem1" as const,
    examType: "mid" as const,
    subject: "korean" as const,
} as const;

// 문제 타입
export const QUESTION_TYPES = {
    OBJECTIVE: "objective" as const,
    SUBJECTIVE: "subjective" as const,
} as const;

// 기본 문제 템플릿
export const DEFAULT_QUESTION_TEMPLATE = {
    passageTitle: "",
    passage: "",
    question: "",
    choices: ["", "", "", ""], // string[]
    answer: 0,
    explanation: "",
    type: QUESTION_TYPES.OBJECTIVE,
    image: "",
};

// 기본 선택지 개수
export const DEFAULT_CHOICE_COUNT = 4;

// 최소 선택지 개수
export const MIN_CHOICE_COUNT = 1; 