import React from "react";
import { EXAM_TYPE_LABEL_MAP, GRADE_LABEL_MAP, SEMESTER_LABEL_MAP, SUBJECT_LABEL_MAP } from "constants/options";

interface QuizHeaderProps {
    grade: string;
    semester: string;
    examType: string;
    subject: string;
    selectedSetName?: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
    grade,
    semester,
    examType,
    subject,
    selectedSetName
}) => {
    const translateLabel = (value: string, type: 'grade' | 'semester' | 'examType' | 'subject') => {
        const maps: Record<string, Record<string, string>> = {
            grade: GRADE_LABEL_MAP,
            semester: SEMESTER_LABEL_MAP,
            examType: EXAM_TYPE_LABEL_MAP,
            subject: SUBJECT_LABEL_MAP
        };
        return maps[type][value] || value;
    };

    return (
        <div className="flex justify-between mb-4 items-center">
            <div>
                <h1 className="text-2xl font-bold mb-2">
                    {translateLabel(grade, "grade")}{" "}
                    {translateLabel(semester, "semester")}{" "}
                    {translateLabel(examType, "examType")}{" "}
                    {translateLabel(subject, "subject")} 시험
                </h1>
            </div>
            {selectedSetName && (
                <div className="text-lg font-medium text-blue-700 mb-2">
                    선택된 문제 세트: <span className="font-bold">{selectedSetName}</span>
                </div>
            )}
        </div>
    );
};

export default QuizHeader; 