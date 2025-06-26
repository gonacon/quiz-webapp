// File: src/components/QuestionPanel.tsx
import React from "react";
import { Question } from "types";

type Props = {
    questions: Question[];
    userAnswers: (string | number)[];
    setUserAnswers: (answers: (string | number)[]) => void;
    showResult: boolean;
    setShowResult: (show: boolean) => void;
};

const QuestionPanel = ({ questions, userAnswers, setUserAnswers, showResult, setShowResult }: Props) => {
    const handleChange = (index: number, value: string | number) => {
        if (showResult) return;
        const newAnswers = [...userAnswers];
        newAnswers[index] = value;
        setUserAnswers(newAnswers);
    };

    const correctCount = questions.reduce((acc, q, idx) => {
        return String(userAnswers[idx]) === String(q.answer) ? acc + 1 : acc;
    }, 0);

    const score100 = ((correctCount / questions.length) * 100).toFixed(0);

    return (
        <div>
            {showResult && (
                <div className="text-lg font-bold text-center text-red-600 mb-6">
                    총 점수: {score100}점 (정답 {correctCount}개 / 총 {questions.length}문항)
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((q, idx) => (
                    <div key={idx} className="border rounded p-4 shadow-sm bg-white flex flex-col gap-4">
                        {/* 지문 제목과 지문 내용 (문제 박스 안에 함께 렌더링) */}
                        {(q.passageTitle || q.passage) && (
                            <>
                                {q.passageTitle && (
                                    <div className="font-semibold text-gray-900 mb-1">
                                        📘 {q.passageTitle}
                                    </div>
                                )}
                                {q.passage && (
                                    <div className="border rounded p-3 bg-yellow-50 text-sm text-gray-800 whitespace-pre-line mb-2">
                                        {q.passage}
                                    </div>
                                )}
                            </>
                        )}

                        {/* 문제 본문 */}
                        <div className="font-semibold">
                            {idx + 1}. {q.question}
                        </div>

                        {/* 이미지가 있는 경우 표시 */}
                        {q.image && (
                            <div className="mb-4">
                                <img 
                                    src={q.image} 
                                    alt="문제 이미지" 
                                    className="max-w-full h-auto rounded"
                                />
                            </div>
                        )}

                        {/* 선택지 또는 주관식 입력 */}
                        {q.type === 'subjective' ? (
                            <div>
                                <input
                                    type="text"
                                    value={userAnswers[idx] as string || ''}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    disabled={showResult}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="답안을 입력하세요"
                                />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {q.choices && q.choices.map((option, cIdx) => (
                                    <label key={cIdx} className="block">
                                        <input
                                            type="radio"
                                            name={`q${idx}`}
                                            value={cIdx}
                                            checked={userAnswers[idx] === cIdx}
                                            onChange={() => handleChange(idx, cIdx)}
                                            disabled={showResult}
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        )}

                        {showResult && (
                            <div className="mt-3 text-sm">
                                {String(userAnswers[idx]) === String(q.answer) ? (
                                    <span className="text-green-600">✅ 정답입니다!</span>
                                ) : (
                                    <div className="text-red-500">❌ 오답입니다.</div>
                                )}
                                <div className="text-gray-700 mt-1">
                                    <strong>정답:</strong> {q.type === 'subjective' ? q.answer : q.choices?.[q.answer as number]}
                                </div>
                                {q.explanation && (
                                    <div className="text-gray-500 mt-1">
                                        <strong>설명:</strong> {q.explanation}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 정답 제출 버튼 */}
            {!showResult && questions.length > 0 && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setShowResult(true)}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-semibold"
                    >
                        정답 확인하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuestionPanel;
