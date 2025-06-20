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
