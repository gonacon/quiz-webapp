import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuestionForm from "components/create/QuestionForm";
import ExamSettings from "components/create/ExamSettings";
import ScrollToTopButton from "components/layout/ScrollToTopButton";
import { exportToJsonFile } from "utils/exportToJsonFile";
import { INITIAL_FILTER_STATE, DEFAULT_QUESTION_TEMPLATE, QUESTION_TYPES } from "constants/defaults";
import { UI_MESSAGES } from "constants/messages";

interface Question {
    passageTitle: string;
    passage: string;
    question: string;
    choices: string[];
    answer: number;
    explanation: string;
    type: string;
    image: string;
}

const CreateQuestion: React.FC = () => {
    const navigate = useNavigate();
    const [grade, setGrade] = useState(INITIAL_FILTER_STATE.grade);
    const [semester, setSemester] = useState(INITIAL_FILTER_STATE.semester);
    const [examType, setExamType] = useState(INITIAL_FILTER_STATE.examType);
    const [subject, setSubject] = useState(INITIAL_FILTER_STATE.subject);
    const [fileName, setFileName] = useState("");
    const [questions, setQuestions] = useState<Question[]>([
        {
            ...DEFAULT_QUESTION_TEMPLATE,
            type: QUESTION_TYPES.OBJECTIVE,
        },
    ]);

    const questionRefs = useRef<HTMLDivElement[]>([]);

    const handleChange = (
        index: number,
        field: keyof Question,
        value: string | number
    ) => {
        const updatedQuestions = [...questions];
        if (field === "answer") {
            updatedQuestions[index][field] = Number(value);
        } else {
            updatedQuestions[index][field] = value as string;
        }
        setQuestions(updatedQuestions);
    };

    const handleChoiceChange = (
        qIndex: number,
        cIndex: number,
        value: string
    ) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].choices[cIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addChoice = (qIndex: number) => {
        const updated = [...questions];
        updated[qIndex].choices.push("");
        setQuestions(updated);
    };

    const removeChoice = (qIndex: number, cIndex: number) => {
        const updated = [...questions];
        if (updated[qIndex].choices.length > 1) {
            updated[qIndex].choices.splice(cIndex, 1);
            if (updated[qIndex].answer >= updated[qIndex].choices.length) {
                updated[qIndex].answer = 0; // 정답 인덱스 보정
            }
            setQuestions(updated);
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                ...DEFAULT_QUESTION_TEMPLATE,
                type: QUESTION_TYPES.OBJECTIVE,
            },
        ]);

        // 약간의 delay 후 스크롤 이동
        setTimeout(() => {
            const lastIndex = questionRefs.current.length - 1;
            questionRefs.current[lastIndex]?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const exportJson = () => {
        const result = {
            title: fileName,
            list: questions.map((q) => ({
                passageTitle: q.passageTitle,
                passage: q.passage,
                question: q.question,
                choices: q.choices,
                answer: q.answer,
                explanation: q.explanation,
                type: QUESTION_TYPES.OBJECTIVE,
                image: q.image
            })),
        };

        const filename = `${grade}_${semester}_${examType}_${subject}_set.json`;
        exportToJsonFile(result, filename);
    };

    return (
        <div className="p-4 mt-14" >
            {/* Navigation Buttons */}
            <div className="fixed top-0 left-0 right-0 bg-gray-100 z-50 p-4 shadow-md flex flex-col gap-4">
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-500 text-white px-4 mt-4 mb-4 rounded hover:bg-blue-600"
                    >
                        {UI_MESSAGES.HOME}
                    </button>
                    {/* 파일 생성 옵션 */}
                    <ExamSettings
                        grade={grade} setGrade={setGrade}
                        semester={semester} setSemester={setSemester}
                        examType={examType} setExamType={setExamType}
                        subject={subject} setSubject={setSubject}
                    />
                </div>
            </div>

            <div className="p-6 mt-14">
                <div className="mb-4">
                    <label className="block font-semibold mb-1">{UI_MESSAGES.FILE_TITLE_LABEL}</label>
                    <input
                        type="text"
                        className="w-full p-2 border"
                        placeholder={UI_MESSAGES.FILE_TITLE_PLACEHOLDER}
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </div>
                <h1 className="text-2xl font-bold mb-4">{UI_MESSAGES.CREATE_QUESTION_TITLE}</h1>

                {/* 문제 생성 폼 */}
                {questions.map((q, i) => (
                    <QuestionForm
                        key={i}
                        ref={(el) => (questionRefs.current[i] = el!)}
                        index={i}
                        question={q}
                        onChange={handleChange}
                        onChoiceChange={handleChoiceChange}
                        onRemove={removeQuestion}
                        onAddChoice={addChoice}
                        onRemoveChoice={removeChoice}
                    />
                ))}

                <div className="flex gap-4">
                    <button
                        onClick={addQuestion}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {UI_MESSAGES.ADD_QUESTION}
                    </button>

                    <button
                        onClick={exportJson}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {UI_MESSAGES.DOWNLOAD_JSON}
                    </button>
                </div>
            </div>
            <ScrollToTopButton />
        </div>
    );
};

export default CreateQuestion;