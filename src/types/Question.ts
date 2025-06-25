export interface Question {
    question: string;
    choices: string[];
    answer: string | number;
    image?: string;
    grade: string;
    semester: string;
    examType: string;
    subject: string;
    setName: string;
    passageTitle?: string;
    passage?: string;
    explanation?: string;
    type?: "objective" | "subjective";
} 