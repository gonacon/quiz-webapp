// File: src/components/Sidebar.tsx
import React from "react";
import SelectInput from "components/SelectInput";

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

                <SelectInput
                    className="mb-3"
                    label="학년"
                    value={grade}
                    onChange={onChangeGrade}
                    options={[
                        { value: "grade2", label: "중학교 2학년" },
                        { value: "grade3", label: "중학교 3학년" },
                        { value: "grade10", label: "고등학교 1학년" },
                        { value: "grade11", label: "고등학교 2학년" },
                        { value: "grade12", label: "고등학교 3학년" },
                    ]}
                />

                <SelectInput
                    className="mb-3"
                    label="학기"
                    value={semester}
                    onChange={onChangeSemester}
                    options={[
                        { value: "sem1", label: "1학기" },
                        { value: "sem2", label: "2학기" },
                    ]}
                />

                <SelectInput
                    className="mb-3"
                    label="시험 종류"
                    value={examType}
                    onChange={onChangeExamType}
                    options={[
                        { value: "mid", label: "중간고사" },
                        { value: "final", label: "기말고사" },
                    ]}
                />

                <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">과목</label>
                    <div className="flex flex-col gap-2">
                        {subjects.map((s) => (
                            <button
                                key={s}
                                onClick={() => onChangeSubject(s)}
                                className={`px-3 py-2 rounded text-sm font-medium text-center ${subject === s ? 'bg-blue-500 text-white' : 'bg-white border text-gray-700'
                                    }`}
                            >
                                {translateSubject(s)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 하단: 문제 만들기 버튼 + 문의사항 */}
            <div>
                {/* 사용 안내 문구 */}
                <div className="mb-4 p-3 bg-white border rounded text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {`📘 문제 등록 안내
1. 아래에서 문제 만들기로 시험 문제를 작성해 주세요.
2. 작성이 완료되면 “JSON 다운로드” 버튼을 눌러 파일을 저장하세요.
3. 저장한 파일을 아래 이메일로 보내 주세요.
4. 파일을 확인한 후, 문제는 자동으로 시스템에 등록되어 시험에 표시됩니다.`}
                </div>
                {/* 문제 만들기 버튼 */}
                <div className="mb-4">
                    <button
                        onClick={() => window.location.href = "/create"}
                        className="w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600"
                    >
                        문제 만들기
                    </button>
                </div>

                {/* 문의사항 */}
                <div className="text-center border-t pt-4">
                    <p className="text-sm text-gray-600">
                        <span className="mr-2">문의사항은</span>
                        <a href="mailto:gonacon@gmail.com" className="text-blue-500 underline">
                            이메일
                        </a>
                        <span>로 연락주세요</span>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
