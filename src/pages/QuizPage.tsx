// src/pages/QuizPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from 'components/Sidebar';
import QuestionPanel from 'components/QuestionPanel';
import { Question, QuestionSet } from 'types';
import QuestionSetSelector from "components/QuestionSelector";
import ScrollToTopButton from "components/ScrollToTopButton";
import { EXAM_TYPE_LABEL_MAP, GRADE_LABEL_MAP, SEMESTER_LABEL_MAP, SUBJECT_LABEL_MAP } from "constants/options";

function QuizPage() {
    const [grade, setGrade] = useState("grade3");
    const [semester, setSemester] = useState("sem1");
    const [examType, setExamType] = useState("mid");
    const [subject, setSubject] = useState("korean");

    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<(string | number)[]>([]);
    const [showResult, setShowResult] = useState(false); // 🔳 정답 제출 버튼
    const [loadError, setLoadError] = useState(false);

    const [availableSets, setAvailableSets] = useState<{ name: string; file: string }[]>([]);
    const [selectedSetName, setSelectedSetName] = useState<string>("");
    const [showFileSelector, setShowFileSelector] = useState(false); // 🔳 문제 선택 버튼 토글용

    const getIndexFilePath = () => `/data/${grade}_${semester}_${examType}_${subject}/index.json`;

    const generateBalancedQuestions = (data: { list: Question[] }): Question[] => {
        // data.list가 이미 Question[] 배열이므로 그대로 반환
        return data.list;
    };

    const loadIndexFile = useCallback(() => {
        fetch(getIndexFilePath())
            .then((res) => {
                // console.log(' loadIndexFile() res=', res);
                if (!res.ok) {
                    throw new Error("index.json 파일 없음");
                }
                return res.json();
            })
            .then((list: { name: string; file: string }[]) => {
                setAvailableSets(list);
            })
            .catch(() => {
                setAvailableSets([]);
            });
    }, [grade, semester, examType, subject]);

    const handleFileSelect = (name: string, filename: string) => {
        setSelectedSetName(name);

        const fullPath = `/data/${grade}_${semester}_${examType}_${subject}/${filename}`;
        fetch(fullPath)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("문제 파일 없음");
                }
                return res.json();
            })
            .then((data: { list: Question[] }) => {  // 타입을 { list: Question[] }로 수정
                const selected = generateBalancedQuestions(data);
                console.log('selected=', selected);
                setQuestions(selected);
                setUserAnswers(Array(selected.length).fill(""));
                setShowResult(false);
                setLoadError(false);
            })
            .catch(() => {
                setQuestions([]);
                setUserAnswers([]);
                setShowResult(false);
                setLoadError(true);
            });
    };

    const submitAnswers = () => {
        setShowResult(true);
    };

    const translateLabel = (value: string, type: 'grade' | 'semester' | 'examType' | 'subject') => {
        const maps: Record<string, Record<string, string>> = {
            grade: GRADE_LABEL_MAP,
            semester: SEMESTER_LABEL_MAP,
            examType: EXAM_TYPE_LABEL_MAP,
            subject: SUBJECT_LABEL_MAP
        };
        return maps[type][value] || value;
    };

    // index.json 불러오기
    useEffect(() => {
        loadIndexFile();
        setSelectedSetName("");
        setQuestions([]);
        setUserAnswers([]);
        setShowResult(false);
        setLoadError(false);
    }, [grade, semester, examType, subject, loadIndexFile]);


    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                grade={grade}
                semester={semester}
                examType={examType}
                subject={subject}
                onChangeGrade={setGrade}
                onChangeSemester={setSemester}
                onChangeExamType={setExamType}
                onChangeSubject={setSubject}
                onShowFileSelector={() => setShowFileSelector(true)}
                availableSets={availableSets}
            />

            <div className="flex-1 p-6">
                {/* 문제 선택기 추가 */}
                {showFileSelector && (
                    <QuestionSetSelector
                        availableSets={availableSets}
                        onSelect={(name, file) => {
                            handleFileSelect(name, file);
                            setShowFileSelector(false);
                        }}
                        onClose={() => setShowFileSelector(false)}
                    />
                )}

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

                {/* 문제가 선택되지 않은 초기 화면 */}
                {questions.length === 0 && !loadError && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                        {/* 환영 메시지 및 사용 가이드 */}
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold text-gray-700">
                                📚 문제 풀이 연습을 시작해보세요!
                            </h2>
                            <p className="text-gray-600 max-w-2xl">
                                왼쪽 메뉴에서 학년, 학기, 시험 유형, 과목을 선택한 후,<br/>
                                '문제 선택' 버튼을 클릭하여 원하는 문제 세트를 선택해주세요.
                            </p>
                        </div>

                        {/* 주요 기능 설명 카드들 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="text-2xl mb-3">🎯</div>
                                <h3 className="font-bold text-lg mb-2">맞춤형 학습</h3>
                                <p className="text-gray-600">
                                    다양한 과목과 난이도의 문제들을 선택하여 학습할 수 있습니다.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="text-2xl mb-3">✍️</div>
                                <h3 className="font-bold text-lg mb-2">즉각적인 피드백</h3>
                                <p className="text-gray-600">
                                    문제 풀이 후 바로 정답과 해설을 확인할 수 있습니다.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="text-2xl mb-3">📊</div>
                                <h3 className="font-bold text-lg mb-2">성적 확인</h3>
                                <p className="text-gray-600">
                                    문제 풀이 후 바로 점수와 정답률을 확인할 수 있습니다.
                                </p>
                            </div>
                        </div>

                        {/* 시작 가이드 */}
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 max-w-2xl w-full">
                            <h3 className="font-bold text-lg mb-3 text-blue-800">🚀 시작하기</h3>
                            <ol className="list-decimal list-inside space-y-2 text-blue-700">
                                <li>왼쪽 사이드바에서 원하는 <strong>학년</strong>을 선택하세요.</li>
                                <li><strong>학기</strong>와 <strong>시험 유형</strong>을 선택하세요.</li>
                                <li>학습하고 싶은 <strong>과목</strong>을 선택하세요.</li>
                                <li>'<strong>문제 선택</strong>' 버튼을 클릭하여 문제 세트를 선택하세요.</li>
                                <li>문제를 풀고 '<strong>정답 제출</strong>' 버튼을 클릭하여 결과를 확인하세요.</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* 에러 메시지 */}
                {loadError && (
                    <div className="text-red-500 text-lg text-center mt-10">
                        해당 시험 문제는 아직 준비되지 않았습니다.
                    </div>
                )}

                {/* 문제 패널 */}
                {questions.length > 0 && (
                    <QuestionPanel
                        questions={questions}
                        userAnswers={userAnswers}
                        setUserAnswers={setUserAnswers}
                        showResult={showResult}
                        setShowResult={setShowResult}
                    />
                )}
            </div>
            <ScrollToTopButton />
        </div>
    );
}

export default QuizPage;