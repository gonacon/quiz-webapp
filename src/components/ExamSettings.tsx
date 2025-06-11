import React from "react";
import SelectInput from "components/SelectInput";
import { EXAM_TYPE_OPTIONS, GRADE_OPTIONS, SEMESTER_OPTIONS, SUBJECT_OPTIONS } from "constants/options";

interface Props {
  grade: string;
  semester: string;
  examType: string;
  subject: string;
  setGrade: (v: string) => void;
  setSemester: (v: string) => void;
  setExamType: (v: string) => void;
  setSubject: (v: string) => void;
}

const ExamSettings: React.FC<Props> = ({
  grade,
  semester,
  examType,
  subject,
  setGrade,
  setSemester,
  setExamType,
  setSubject,
}) => {
  return (
    <div className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-2">
      <SelectInput
        label="학년"
        value={grade}
        onChange={setGrade}
        options={GRADE_OPTIONS}

      />
      <SelectInput
        label="학기"
        value={semester}
        onChange={setSemester}
        options={SEMESTER_OPTIONS}
      />
      <SelectInput
        label="시험 유형"
        value={examType}
        onChange={setExamType}
        options={EXAM_TYPE_OPTIONS}
      />
      <SelectInput
        label="과목"
        value={subject}
        onChange={setSubject}
        options={SUBJECT_OPTIONS}
      />
    </div>
  );
};

export default ExamSettings;