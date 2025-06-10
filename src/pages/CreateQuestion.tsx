import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SelectInput from "components/SelectInput";
import ScrollToTopButton from "components/ScrollToTopButton";

interface Question {
    passageTitle: string;
    passage: string;
    question: string;
    choices: string[];
    answer: number;
    explanation: string;
    type: string;
}

const CreateQuestion: React.FC = () => {
    const navigate = useNavigate();
    const [grade, setGrade] = useState("grade3");
    const [semester, setSemester] = useState("sem1");
    const [examType, setExamType] = useState("mid");
    const [subject, setSubject] = useState("korean");
    const [fileName, setFileName] = useState("");
    const [questions, setQuestions] = useState<Question[]>([
        {
            passageTitle: "",
            passage: "",
            question: "",
            choices: ["", "", "", ""],
            answer: 0,
            explanation: "",
            type: "objective",
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
                passageTitle: "",
                passage: "",
                question: "",
                choices: ["", "", "", ""],
                answer: 0,
                explanation: "",
                type: "objective",
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
                passageTitle: "",
                passage: "",
                question: q.question,
                choices: q.choices,
                answer: q.answer,
                explanation: "",
                type: "objective"
            })),
        };

        const json = JSON.stringify(result, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const filename = `${grade}_${semester}_${examType}_${subject}_set.json`;

        a.download = filename;
        a.click();
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
                        홈으로
                    </button>
                    <button
                        onClick={() => navigate("/quiz")}
                        className="bg-green-500 text-white px-4 mt-4 mb-4 rounded hover:bg-green-600"
                    >
                        문제 풀러가기
                    </button>
                    <div className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                        <SelectInput
                            label="학년"
                            value={grade}
                            onChange={setGrade}
                            options={[
                                { value: "grade2", label: "중학교 2학년" },
                                { value: "grade3", label: "중학교 3학년" },
                                { value: "grade10", label: "고등학교 1학년" },
                                { value: "grade11", label: "고등학교 2학년" },
                                { value: "grade12", label: "고등학교 3학년" },
                            ]}
                        />
                        <SelectInput
                            label="학기"
                            value={semester}
                            onChange={setSemester}
                            options={[
                                { value: "sem1", label: "1학기" },
                                { value: "sem2", label: "2학기" },
                            ]}
                        />
                        <SelectInput
                            label="시험 유형"
                            value={examType}
                            onChange={setExamType}
                            options={[
                                { value: "mid", label: "중간고사" },
                                { value: "final", label: "기말고사" },
                            ]}
                        />
                        <SelectInput
                            label="과목"
                            value={subject}
                            onChange={setSubject}
                            options={[
                                { value: "korean", label: "국어" },
                                { value: "math", label: "수학" },
                                { value: "english", label: "영어" },
                                { value: "science", label: "과학" },
                                { value: "social", label: "사회" },
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 mt-14">
                <div className="mb-4">
                    <label className="block font-semibold mb-1">파일 제목 (확장자 제외)</label>
                    <input
                        type="text"
                        className="w-full p-2 border"
                        placeholder="예: 중3_국어_1학기_중간"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </div>
                <h1 className="text-2xl font-bold mb-4">문제 생성</h1>

                {/* 문제 생성 폼 */}
                {questions.map((q, i) => (
                    <div
                        key={i}
                        ref={(el) => (questionRefs.current[i] = el)}
                        className="relative border p-4 mb-6 rounded bg-gray-50"
                    >
                        {/* 삭제 버튼 */}
                        <button
                            onClick={() => removeQuestion(i)}
                            className="absolute top-2 right-2 bg-orange-500 text-yellow-300 text-[15px] px-2 py-1 rounded hover:bg-red-600 leading-tight">
                            삭 제
                        </button>
                        {/* 문제 입력 */}
                        <label className="block font-semibold mb-2">문제 {i + 1}</label>
                        <label className="block mb-1">지문 제목</label>
                        <input
                            type="text"
                            className="w-full p-2 border mb-3"
                            value={q.passageTitle}
                            onChange={(e) => handleChange(i, "passageTitle", e.target.value)}
                        />

                        <label className="block mb-1">지문 내용</label>
                        <textarea
                            className="w-full p-2 border mb-3 h-40"
                            value={q.passage}
                            onChange={(e) => handleChange(i, "passage", e.target.value)}
                        />

                        <label className="block mb-1">문제</label>
                        <input
                            type="text"
                            className="w-full p-2 border mb-3"
                            value={q.question}
                            onChange={(e) => handleChange(i, "question", e.target.value)}
                        />

                        <label className="block mb-1">선택지</label>
                        {q.choices.map((opt, j) => (
                            <div key={j} className="flex items-center gap-2 mb-2">
                                <span>{j + 1}. </span>
                                <input
                                    type="radio"
                                    name={`answer-${i}`}
                                    className="mr-2"
                                    checked={q.answer === j}
                                    onChange={() => handleChange(i, "answer", j)}
                                />
                                <input
                                    type="text"
                                    className="flex-1 p-2 border rounded"
                                    value={opt}
                                    onChange={(e) => handleChoiceChange(i, j, e.target.value)}
                                />
                                {q.choices.length > 1 && (
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 whitespace-nowrap"
                                        onClick={() => removeChoice(i, j)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="mt-2">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-blue-800 px-3 py-1 rounded text-sm"
                                onClick={() => addChoice(i)}
                            >
                                선택지 추가
                            </button>
                        </div>

                        <label className="block mb-1">해설</label>
                        <textarea
                            className="w-full p-2 border mb-3"
                            value={q.explanation}
                            onChange={(e) => handleChange(i, "explanation", e.target.value)}
                        />
                    </div>
                ))}


                <div className="flex gap-4">
                    <button
                        onClick={addQuestion}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        문제 추가
                    </button>

                    <button
                        onClick={exportJson}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        JSON 다운로드
                    </button>
                </div>
            </div>
            <ScrollToTopButton />
        </div>
    );
};

export default CreateQuestion;