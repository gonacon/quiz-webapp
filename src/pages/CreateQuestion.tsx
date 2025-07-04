import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuestionForm from "components/create/QuestionForm";
import ExamSettings from "components/create/ExamSettings";
import ScrollToTopButton from "components/layout/ScrollToTopButton";
import { exportToJsonFile } from "utils/exportToJsonFile";
import { INITIAL_FILTER_STATE, DEFAULT_QUESTION_TEMPLATE, QUESTION_TYPES } from "constants/defaults";
import { UI_MESSAGES } from "constants/messages";
import { createQuestionSet, QuizPayload } from "lib/realm";

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
    const [questions, setQuestions] = useState<Question[]>([{ ...DEFAULT_QUESTION_TEMPLATE, type: QUESTION_TYPES.OBJECTIVE, },]);
    const [isUploading, setIsUploading] = useState(false); // ← 추가

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

    const handleChoiceChange = (qIndex: number, cIndex: number, value: string) => {
        const updatedQuestions = questions.map((q, i) => {
            if (i === qIndex) {
                const newChoices = [...q.choices];
                newChoices[cIndex] = value;
                return { ...q, choices: newChoices };
            }
            return q;
        });
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

    const uploadQuiz = async () => {
        if (!fileName.trim()) {
            alert(UI_MESSAGES.FILE_TITLE_REQUIRED);
            return;
        }
        setIsUploading(true);
        try {
            const payload: QuizPayload = {
                name: fileName,
                grade,
                semester,
                examType,
                subject,
                questions: questions.map(q => ({
                    ...q,
                    type: q.type || QUESTION_TYPES.OBJECTIVE,
                })),
            };
            const result = await createQuestionSet(payload);
            alert("퀴즈가 성공적으로 업로드되었습니다!");
            console.log("Upload result:", result);
            // 필요시 navigate('/quiz');
        } catch (error) {
            alert("퀴즈 업로드에 실패했습니다. 콘솔을 확인해주세요.");
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
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

                <div className="flex justify-between items-center mt-6 mb-7">
                    <button
                        onClick={addQuestion}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {UI_MESSAGES.ADD_QUESTION}
                    </button>

                    {/* JSON 다운로드 버튼은 숨김 처리 (기능은 유지) */}
                    <button
                        onClick={exportJson}
                        style={{ display: 'none' }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {UI_MESSAGES.DOWNLOAD_JSON}
                    </button>

                    <button
                        onClick={uploadQuiz}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400 ml-auto"
                        disabled={isUploading}
                        style={{ minWidth: 120 }}
                    >
                        {isUploading ? "업로드 중..." : "DB에 업로드"}
                    </button>
                </div>
            </div>
            {/* ScrollToTopButton이 겹치지 않도록 z-index와 위치 스타일 추가 */}
            <div style={{ position: 'relative', zIndex: 30 }}>
                <ScrollToTopButton />
            </div>
        </div>
    );
};

export default CreateQuestion;