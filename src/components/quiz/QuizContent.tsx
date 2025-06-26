import React from "react";
import { Question, AvailableSet } from "types";
import QuestionPanel from "components/quiz/QuestionPanel";
import { WelcomeGuide } from 'components/guide/WelcomeGuide';
import { FeatureCards } from 'components/common/FeatureCards';
import { StartGuide } from 'components/guide/StartGuide';
import { CreateQuestionSection } from 'components/create/CreateQuestionSection';
import { ERROR_MESSAGES, LOADING_MESSAGES, UI_MESSAGES } from "constants/messages";

interface QuizContentProps {
    questions: Question[];
    userAnswers: (string | number)[];
    setUserAnswers: (answers: (string | number)[]) => void;
    showResult: boolean;
    setShowResult: (show: boolean) => void;
    loadError: boolean;
    availableSets: AvailableSet[];
    isLoadingQuestions?: boolean;
    errorMessage?: string;
}

const QuizContent: React.FC<QuizContentProps> = React.memo(({
    questions,
    userAnswers,
    setUserAnswers,
    showResult,
    setShowResult,
    loadError,
    availableSets,
    isLoadingQuestions = false,
    errorMessage = ""
}) => {
    return (
        <>
            {/* 문제 로딩 중 인디케이터 */}
            {isLoadingQuestions && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    <span className="ml-2 text-gray-600">{LOADING_MESSAGES.LOADING_QUESTIONS}</span>
                </div>
            )}

            {/* 문제가 선택되지 않은 초기 화면 */}
            {questions?.length === 0 && !loadError && !isLoadingQuestions && (
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
                <div className="text-center mt-10">
                    <div className="text-red-500 text-lg mb-2">
                        {errorMessage || ERROR_MESSAGES.DEFAULT_ERROR}
                    </div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        {UI_MESSAGES.RETRY}
                    </button>
                </div>
            )}

            {/* 문제 패널 */}
            {questions.length > 0 && !isLoadingQuestions && (
                <QuestionPanel
                    questions={questions}
                    userAnswers={userAnswers}
                    setUserAnswers={setUserAnswers}
                    showResult={showResult}
                    setShowResult={setShowResult}
                />
            )}
        </>
    );
});

QuizContent.displayName = 'QuizContent';

export default QuizContent; 