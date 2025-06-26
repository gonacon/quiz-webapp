// src/pages/QuizPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from 'components/Sidebar';
import QuestionPanel from 'components/QuestionPanel';
import { Question } from 'types/Question';
import QuestionSetSelector from "components/QuestionSelector";
import ScrollToTopButton from "components/ScrollToTopButton";
import { EXAM_TYPE_LABEL_MAP, GRADE_LABEL_MAP, SEMESTER_LABEL_MAP, SUBJECT_LABEL_MAP } from "constants/options";
import { WelcomeGuide } from 'components/WelcomeGuide';
import { FeatureCards } from 'components/FeatureCards';
import { StartGuide } from 'components/StartGuide';
import { CreateQuestionSection } from 'components/CreateQuestionSection';
import { getQuestionSets, findQuestions } from 'lib/realm';

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

    const loadQuestionSets = useCallback(async () => {
        try {
            const questionSets = await getQuestionSets(grade, semester, examType, subject);
            setAvailableSets(questionSets.map((set: any) => ({
                name: set.name,
                file: set._id.toString()
            })));
        } catch (error) {
            console.error('문제 세트 목록 로딩 실패:', error);
            setAvailableSets([]);
            setLoadError(true);
        }
    }, [grade, semester, examType, subject]);

    const handleFileSelect = async (name: string, setId: string) => {
        try {
            setSelectedSetName(name);
            const questionsData = await findQuestions(setId);

            setQuestions(questionsData);
            setUserAnswers(Array(questionsData.length).fill(""));
            setShowResult(false);
            setLoadError(false);
        } catch (error) {
            console.error('문제 로딩 실패:', error);
            setQuestions([]);
            setUserAnswers([]);
            setShowResult(false);
            setLoadError(true);
        }
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

    // 문제 세트 목록 불러오기
    useEffect(() => {
        const loadData = async () => {
            try {
                await loadQuestionSets();
                setSelectedSetName("");
                setQuestions([]);
                setUserAnswers([]);
                setShowResult(false);
                setLoadError(false);
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                setLoadError(true);
            }
        };

        loadData();
    }, [grade, semester, examType, subject]);

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

                {questions.length > 0 && (
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
                )}


                {/* 문제가 선택되지 않은 초기 화면 */}
                {questions?.length === 0 && !loadError && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                        <WelcomeGuide />
                        <FeatureCards />
                        <div className="w-full max-w-4xl flex flex-col items-center gap-6">
                            <StartGuide />
                            <CreateQuestionSection availableSets={availableSets} />
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