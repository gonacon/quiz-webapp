// src/pages/QuizPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from 'components/layout/Sidebar';
import { Question, RealmQuestionSet, AvailableSet } from 'types';
import QuestionSetSelector from "components/quiz/QuestionSelector";
import ScrollToTopButton from "components/layout/ScrollToTopButton";
import QuizHeader from "components/quiz/QuizHeader";
import QuizContent from "components/quiz/QuizContent";
import { getQuestionSets, findQuestions } from 'lib/realm';
import { INITIAL_FILTER_STATE } from 'constants/defaults';
import { ERROR_MESSAGES } from 'constants/messages';
import { SUBJECT_OPTIONS } from "constants/options";

// `subject` 속성을 포함하는 확장된 로컬 타입을 정의합니다.
type SetWithSubject = AvailableSet & { subject: string };

function QuizPage() {
    // 필터 상태
    const [grade, setGrade] = useState(INITIAL_FILTER_STATE.grade);
    const [semester, setSemester] = useState(INITIAL_FILTER_STATE.semester);
    const [examType, setExamType] = useState(INITIAL_FILTER_STATE.examType);
    const [subject, setSubject] = useState(INITIAL_FILTER_STATE.subject);

    // 문제 관련 상태
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<(string | number)[]>([]);
    const [showResult, setShowResult] = useState(false);

    // UI 상태
    const [allSets, setAllSets] = useState<SetWithSubject[]>([]);
    const [selectedSetName, setSelectedSetName] = useState<string>("");
    const [showFileSelector, setShowFileSelector] = useState(false);

    // 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // 문제 세트 로딩 함수
    const loadQuestionSets = useCallback(async () => {
        try {
            setIsLoading(true);
            setLoadError(false);
            setErrorMessage("");

            const promises = SUBJECT_OPTIONS.map(async (subjectOption) => {
                const questionSets = await getQuestionSets(grade, semester, examType, subjectOption.value);
                return questionSets.map((set: RealmQuestionSet) => ({
                    name: set.name,
                    file: set._id.toString(),
                    subject: subjectOption.value
                }));
            });

            const results = await Promise.all(promises);
            const flattenedSets = results.flat();
            
            setAllSets(flattenedSets);
        } catch (error) {
            console.error('문제 세트 목록 로딩 실패:', error);
            setAllSets([]);
            setLoadError(true);
            setErrorMessage(ERROR_MESSAGES.LOAD_QUESTION_SETS);
        } finally {
            setIsLoading(false);
        }
    }, [grade, semester, examType]);

    // 문제 선택 처리 함수
    const handleFileSelect = useCallback(async (name: string, setId: string) => {
        try {
            setIsLoadingQuestions(true);
            setLoadError(false);
            setErrorMessage("");

            setSelectedSetName(name);
            const questionsData = await findQuestions(setId);

            setQuestions(questionsData);
            setUserAnswers(Array(questionsData.length).fill(""));
            setShowResult(false);
        } catch (error) {
            console.error('문제 로딩 실패:', error);
            setQuestions([]);
            setUserAnswers([]);
            setShowResult(false);
            setLoadError(true);
            setErrorMessage(ERROR_MESSAGES.LOAD_QUESTIONS);
        } finally {
            setIsLoadingQuestions(false);
        }
    }, []);

    // 상태 초기화 함수
    const resetQuizState = useCallback(() => {
        setSelectedSetName("");
        setQuestions([]);
        setUserAnswers([]);
        setShowResult(false);
        setLoadError(false);
        setErrorMessage("");
    }, []);

    // 필터 변경 시 데이터 로딩
    useEffect(() => {
        const loadData = async () => {
            try {
                resetQuizState();
                await loadQuestionSets();
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                setLoadError(true);
                setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR);
            }
        };

        loadData();
    }, [loadQuestionSets, resetQuizState]);

    // 메모이제이션된 값들
    const availableSets = useMemo(() => {
        return allSets.filter(set => set.subject === subject);
    }, [allSets, subject]);

    const hasQuestions = useMemo(() => questions.length > 0, [questions.length]);

    // 문제 선택기 토글 함수
    const toggleFileSelector = useCallback(() => {
        setShowFileSelector(prev => !prev);
    }, []);

    // 문제 선택 처리 함수
    const handleQuestionSelect = useCallback((name: string, file: string) => {
        handleFileSelect(name, file);
        setShowFileSelector(false);
    }, [handleFileSelect]);

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
                onShowFileSelector={toggleFileSelector}
                availableSets={allSets}
                isLoading={isLoading}
                onReset={resetQuizState}
            />

            <div className="flex-1 p-6">
                {/* 문제 선택기 */}
                {showFileSelector && (
                    <QuestionSetSelector
                        availableSets={availableSets}
                        onSelect={handleQuestionSelect}
                        onClose={() => setShowFileSelector(false)}
                    />
                )}

                {/* 헤더 */}
                {hasQuestions && (
                    <QuizHeader
                        grade={grade}
                        semester={semester}
                        examType={examType}
                        subject={subject}
                        selectedSetName={selectedSetName}
                    />
                )}

                {/* 메인 콘텐츠 */}
                <QuizContent
                    questions={questions}
                    userAnswers={userAnswers}
                    setUserAnswers={setUserAnswers}
                    showResult={showResult}
                    setShowResult={setShowResult}
                    loadError={loadError}
                    availableSets={availableSets}
                    isLoadingQuestions={isLoadingQuestions}
                    errorMessage={errorMessage}
                />
            </div>
            <ScrollToTopButton />
        </div>
    );
}

export default QuizPage;