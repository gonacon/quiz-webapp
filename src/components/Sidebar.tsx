// File: src/components/Sidebar.tsx
import React from "react";

type Props = {
    grade: string;
    semester: string;
    examType: string;
    subject: string;
    onChangeGrade: (v: string) => void;
    onChangeSemester: (v: string) => void;
    onChangeExamType: (v: string) => void;
    onChangeSubject: (v: string) => void;
};

const subjects = ['korean', 'math', 'english', 'science', 'social'];

const translateSubject = (s: string) => {
    switch (s) {
        case 'korean': return '국어';
        case 'math': return '수학';
        case 'english': return '영어';
        case 'science': return '과학';
        case 'social': return '사회';
        default: return s;
    }
};

const Sidebar = ({
                     grade,
                     semester,
                     examType,
                     subject,
                     onChangeGrade,
                     onChangeSemester,
                     onChangeExamType,
                     onChangeSubject,
                 }: Props) => {
    return (
        <div className="w-64 bg-gray-100 p-4 border-r flex flex-col h-screen justify-between">
            <div>
                <h2 className="text-lg font-bold mb-4">시험 설정</h2>

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">학년</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={grade}
                        onChange={(e) => onChangeGrade(e.target.value)}
                    >
                        <option value="grade2">중학교 2학년</option>
                        <option value="grade3">중학교 3학년</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">학기</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={semester}
                        onChange={(e) => onChangeSemester(e.target.value)}
                    >
                        <option value="sem1">1학기</option>
                        <option value="sem2">2학기</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">시험 종류</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={examType}
                        onChange={(e) => onChangeExamType(e.target.value)}
                    >
                        <option value="mid">중간고사</option>
                        <option value="final">기말고사</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">과목</label>
                    <div className="flex flex-col gap-2">
                        {subjects.map((s) => (
                            <button
                                key={s}
                                onClick={() => onChangeSubject(s)}
                                className={`px-3 py-2 rounded text-sm font-medium text-center ${
                                    subject === s ? 'bg-blue-500 text-white' : 'bg-white border text-gray-700'
                                }`}
                            >
                                {translateSubject(s)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 최하단 고정 이메일 문의 */}
            <div className="text-center border-t pt-4">
                <p className="text-sm text-gray-600">
                    <span className="mr-2">문의사항은</span>
                    <a href="mailto:your@email.com" className="text-blue-500 underline">
                        이메일
                    </a>
                    <span>로 연락주세요</span>
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
