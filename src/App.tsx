import React, { useState, useEffect, useCallback } from "react";
import Sidebar from './components/Sidebar';
import QuestionPanel from './components/QuestionPanel';

export type Question = {
  question: string;
  choices?: string[];
  answer: number | string;
  explanation: string;
  type?: "objective" | "subjective";
};

export type QuestionSet = Record<string, Question[]>;

function App() {
  const [grade, setGrade] = useState("grade3");
  const [semester, setSemester] = useState("sem1");
  const [examType, setExamType] = useState("mid");
  const [subject, setSubject] = useState("korean");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | number)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const getFileName = () => `${grade}_${semester}_${examType}_${subject}.json`;

  const generateBalancedQuestions = (data: QuestionSet, count = 20): Question[] => {
    const categories = Object.keys(data);
    const result: Question[] = [];

    while (result.length < count) {
      for (const category of categories) {
        const pool = data[category];
        if (!pool || pool.length === 0) continue;

        const remaining = count - result.length;
        const questionCount = Math.min(1, pool.length, remaining);

        const selected = pool.sort(() => Math.random() - 0.5).slice(0, questionCount);
        result.push(...selected);

        if (result.length >= count) break;
      }
    }

    return result;
  };

  const generateQuestions = useCallback(() => {
    fetch(`/data/${getFileName()}`)
    .then(res => {
      if (!res.ok) throw new Error("파일 없음");
      return res.json();
    })
    .then((data: QuestionSet) => {
      const selected = generateBalancedQuestions(data);
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
  }, [grade, semester, examType, subject]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const submitAnswers = () => {
    setShowResult(true);
  };

  const translateLabel = (value: string, type: 'grade' | 'semester' | 'examType' | 'subject') => {
    const maps: Record<string, Record<string, string>> = {
      grade: {
        grade2: '중학교 2학년',
        grade3: '중학교 3학년'
      },
      semester: {
        sem1: '1학기',
        sem2: '2학기'
      },
      examType: {
        mid: '중간고사',
        final: '기말고사'
      },
      subject: {
        korean: '국어',
        math: '수학',
        english: '영어',
        science: '과학',
        social: '사회'
      }
    };
    return maps[type][value] || value;
  };

  return (
      <div className="flex min-h-screen">
        <Sidebar
            grade={grade}
            semester={semester}
            examType={examType}
            subject={subject}
            onChangeGrade={setGrade}
            onChangeSemester={setSemester}
            onChangeExamType={setExamType}
            onChangeSubject={setSubject}
        />
        <div className="flex-1 p-6">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {translateLabel(grade, 'grade')} {translateLabel(semester, 'semester')} {translateLabel(examType, 'examType')} {translateLabel(subject, 'subject')} 시험
            </h1>
            <div className="space-x-2">
              <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={generateQuestions}
              >
                문제 생성
              </button>
              <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={submitAnswers}
              >
                정답 제출
              </button>
            </div>
          </div>

          {loadError ? (
              <div className="text-red-500 text-lg text-center mt-10">
                해당 시험 문제는 아직 준비되지 않았습니다.
              </div>
          ) : (
              <QuestionPanel
                  questions={questions}
                  userAnswers={userAnswers}
                  setUserAnswers={setUserAnswers}
                  showResult={showResult}
              />
          )}
        </div>
      </div>
  );
}

export default App;
