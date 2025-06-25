import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QuestionSet } from 'types/QuestionSet';
import { getQuestionSetsCollection } from 'lib/realm';

const QuestionSetList: React.FC = () => {
    const { grade, semester, examType, subject } = useParams<{
        grade: string;
        semester: string;
        examType: string;
        subject: string;
    }>();
    const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestionSets = async () => {
            try {
                setLoading(true);
                const questionSetsCollection = await getQuestionSetsCollection();
                
                // MongoDB에서 해당 조건의 문제 세트들 조회
                const questionSetsData = await questionSetsCollection.find({
                    grade,
                    semester,
                    examType,
                    subject
                });


                setQuestionSets(questionSetsData);
                setError(null);
            } catch (err) {
                console.error('문제 세트 목록을 불러오는 중 오류 발생:', err);
                setError('문제 세트 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (grade && semester && examType && subject) {
            fetchQuestionSets();
        }
    }, [grade, semester, examType, subject]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>에러: {error}</div>;
    }

    return (
        <div>
            <h2>문제 세트 목록</h2>
            <div className="question-set-list">
                {questionSets.map((set, index) => (
                    <Link
                        key={index}
                        to={`/questions/${grade}/${semester}/${examType}/${subject}/${set.name}`}
                        className="question-set-item"
                    >
                        <h3>{set.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuestionSetList; 