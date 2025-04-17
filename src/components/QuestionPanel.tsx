// File: src/components/QuestionPanel.tsx
import React from "react";
import { Question } from '../App';

type Props = {
    questions: Question[];
    userAnswers: (string | number)[];
    setUserAnswers: (answers: (string | number)[]) => void;
    showResult: boolean;
};

const QuestionPanel = ({ questions, userAnswers, setUserAnswers, showResult }: Props) => {
    const handleChange = (index: number, value: string | number) => {
        if (showResult) return; // 정답 제출 후 입력 불가
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
                <div className="text-lg font-bold text-center text-green-600 mb-6">
                    총 점수: {score100}점 (정답 {correctCount}개 / 총 {questions.length}문항)
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((q, idx) => (
                    <div key={idx} className="border rounded p-4 shadow-sm bg-white">
                        <div className="font-semibold mb-2">
                            {idx + 1}. {q.question}
                        </div>
                        {q.type === 'objective' && q.choices && (
                            <div className="space-y-1">
                                {q.choices.map((choice, cIdx) => (
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
                                        {choice}
                                    </label>
                                ))}
                            </div>
                        )}

                        {q.type === 'subjective' && (
                            <input
                                type="text"
                                value={userAnswers[idx] as string}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                className="w-full border rounded p-2 mt-2"
                                placeholder="정답 입력"
                                disabled={showResult}
                            />
                        )}

                        {showResult && (
                            <div className="mt-2 text-sm">
                                {String(userAnswers[idx]) === String(q.answer) ? (
                                    <span className="text-green-600">✅ 정답입니다!</span>
                                ) : (
                                    <>
                                        <div className="text-red-500">❌ 오답입니다.</div>
                                        <div className="text-gray-700">정답: {q.type === 'objective' ? q.choices?.[q.answer as number] : q.answer}</div>
                                        <div className="text-gray-500 mt-1">설명: {q.explanation}</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionPanel;
