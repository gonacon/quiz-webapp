export type Question = {
    passageTitle: string;
    passage: string;
    question: string;
    choices?: string[];
    answer: number | string;
    explanation: string;
    type?: "objective" | "subjective";
    image?: string;
};

export type IndexItem = {
    name: string;
    file: string;
};

export type QuestionSet = {
    title: string;
    list: Question[];
};

// Realm에서 오는 문제 세트 데이터 타입
export type RealmQuestionSet = {
    _id: string;
    name: string;
    grade: string;
    semester: string;
    examType: string;
    subject: string;
    createdAt: Date;
};

// UI에서 사용하는 문제 세트 타입
export type AvailableSet = {
    name: string;
    file: string;
};
