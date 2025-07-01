// File: src/components/layout/Sidebar.tsx
import React from "react";
import SelectInput from "components/common/SelectInput";
import { EXAM_TYPE_OPTIONS, GRADE_OPTIONS, SEMESTER_OPTIONS, SUBJECT_OPTIONS } from "constants/options";
import { AvailableSet } from "types";
import { SUBJECT_TRANSLATIONS, UI_MESSAGES, LOADING_MESSAGES } from "constants/messages";

// `subject` 속성을 포함할 수 있도록 Prop 타입을 확장합니다.
type SetWithSubject = AvailableSet & { subject?: string };

interface Props {
    grade: string;
    semester: string;
    examType: string;
    subject: string;
    onChangeGrade: (value: string) => void;
    onChangeSemester: (value: string) => void;
    onChangeExamType: (value: string) => void;
    onChangeSubject: (value: string) => void;
    onShowFileSelector: () => void;
    availableSets: SetWithSubject[];
    isLoading?: boolean;
    onReset: () => void;
}

const subjects = SUBJECT_OPTIONS.map(option => option.value);

const translateSubject = (s: string) => {
    return SUBJECT_TRANSLATIONS[s as keyof typeof SUBJECT_TRANSLATIONS] || s;
};

const Sidebar: React.FC<Props> = ({
    grade,
    semester,
    examType,
    subject,
    onChangeGrade,
    onChangeSemester,
    onChangeExamType,
    onChangeSubject,
    onShowFileSelector,
    availableSets,
    isLoading = false,
    onReset
}) => {
    const subjectCounts = React.useMemo(() => {
        const counts: { [key: string]: number } = {};
        subjects.forEach(s => {
            counts[s] = 0;
        });
        availableSets.forEach(set => {
            if (set.subject && counts[set.subject] !== undefined) {
                counts[set.subject]++;
            }
        });
        return counts;
    }, [availableSets]);

    return (
        <div className="w-64 bg-gray-100 p-4 border-r flex flex-col h-screen justify-between">
            <div>
                <h2 
                    className="text-lg font-bold mb-4 cursor-pointer hover:text-blue-500 transition-colors"
                    onClick={onReset}
                >
                    시험 설정
                </h2>

                <SelectInput
                    className="mb-3"
                    label="학년"
                    value={grade}
                    onChange={onChangeGrade}
                    options={GRADE_OPTIONS}
                />

                <SelectInput
                    className="mb-3"
                    label="학기"
                    value={semester}
                    onChange={onChangeSemester}
                    options={SEMESTER_OPTIONS}
                />

                <SelectInput
                    className="mb-3"
                    label="시험 종류"
                    value={examType}
                    onChange={onChangeExamType}
                    options={EXAM_TYPE_OPTIONS}
                />

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">과목</label>
                    <div className="flex flex-col gap-2">
                        {subjects.map((s) => (
                            <button
                                key={s}
                                onClick={() => onChangeSubject(s)}
                                className={`px-3 py-2 rounded text-sm font-medium text-center flex justify-between items-center transition-colors ${
                                    subject === s 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span>{translateSubject(s)}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    subject === s ? 'bg-white text-blue-500' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {subjectCounts[s]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 하단: 문제 만들기 버튼 + 문의사항 */}
            <div>

                {/* 문제 선택 버튼 */}
                <div className="text-center border-t pt-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-500 rounded">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                            <span className="text-sm">{LOADING_MESSAGES.LOADING}</span>
                        </div>
                    ) : (
                        <button
                            onClick={onShowFileSelector}
                            disabled={availableSets.filter(s => s.subject === subject).length === 0}
                            className={`w-full px-4 py-2 rounded font-medium transition-colors duration-200 ${availableSets.filter(s => s.subject === subject).length > 0
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {UI_MESSAGES.SELECT_QUESTION}
                        </button>
                    )}
                </div>
            </div>

            {/* 문의사항 */}
            <div className="space-y-3 pt-4 border-t">
                <p className="text-sm text-gray-600">
                    <span className="mr-2">문의사항은</span>
                    <a href="mailto:gonacon@gmail.com" className="text-blue-500 underline">
                        이메일
                    </a>
                    <span>로 연락주세요</span>
                </p>
            </div>

        </div>
    );
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;
