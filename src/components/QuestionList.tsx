import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Question } from '../types/Question';
import { getQuestionsCollection } from '../lib/realm';

const QuestionList: React.FC = () => {
    const { grade, semester, examType, subject, setName } = useParams<{
        grade: string;
        semester: string;
        examType: string;
        subject: string;
        setName: string;
    }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const questionsCollection = await getQuestionsCollection();
                
                // MongoDB에서 문제 세트에 해당하는 문제들 조회
                const questionsData = await questionsCollection.find({
                    grade,
                    semester,
                    examType,
                    subject,
                    setName
                });

                setQuestions(questionsData);
                setError(null);
            } catch (err) {
                console.error('문제 목록을 불러오는 중 오류 발생:', err);
                setError('문제 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (grade && semester && examType && subject && setName) {
            fetchQuestions();
        }
    }, [grade, semester, examType, subject, setName]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>에러: {error}</div>;
    }

    return (
        <div>
            <h2>문제 목록</h2>
            <div>
                {questions.map((question, index) => (
                    <div key={index} className="question-item">
                        <h3>문제 {index + 1}</h3>
                        <p>{question.content}</p>
                        {question.image && (
                            <img src={question.image} alt={`문제 ${index + 1}`} />
                        )}
                        <div className="options">
                            {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="option">
                                    {option}
                                </div>
                            ))}
                        </div>
                        <div className="answer">
                            <p>정답: {question.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionList; 