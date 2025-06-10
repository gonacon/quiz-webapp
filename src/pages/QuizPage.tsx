// src/pages/QuizPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from 'components/Sidebar';
import QuestionPanel from 'components/QuestionPanel';
import { Question, QuestionSet } from 'types';
import QuestionSetSelector from "components/QuestionSelector";
import ScrollToTopButton from "components/ScrollToTopButton";

function QuizPage() {
    const [ grade, setGrade ] = useState("grade3");
    const [ semester, setSemester ] = useState("sem1");
    const [ examType, setExamType ] = useState("mid");
    const [ subject, setSubject ] = useState("korean");

    const [ questions, setQuestions ] = useState<Question[]>([]);
    const [ userAnswers, setUserAnswers ] = useState<(string | number)[]>([]);
    const [ showResult, setShowResult ] = useState(false); // 🔳 정답 제출 버튼
    const [ loadError, setLoadError ] = useState(false);

    const [ availableSets, setAvailableSets ] = useState<{ name: string; file: string }[]>([]);
    const [ selectedSetName, setSelectedSetName ] = useState<string>("");
    const [ showFileSelector, setShowFileSelector ] = useState(false); // 🔳 문제 선택 버튼 토글용

    const getIndexFilePath = () => `/data/${ grade }_${ semester }_${ examType }_${ subject }/index.json`;

    const generateBalancedQuestions = (data: QuestionSet): Question[] => {
        const categories = Object.keys(data);
        const result: Question[] = [];

        for (const category of categories) {
            const pool = data[category];
            if (!pool || pool.length === 0) {
                continue;
            }
            const shuffled = [ ...pool ].sort(() => Math.random() - 0.5);
            result.push(...shuffled);
        }

        return result;
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
    }, [ grade, semester, examType, subject ]);

    const handleFileSelect = (name: string, filename: string) => {
        setSelectedSetName(name);
        // setSelectedFile(filename);

        const fullPath = `/data/${ grade }_${ semester }_${ examType }_${ subject }/${ filename }`;
        fetch(fullPath)
        .then((res) => {
            // console.log('res=', res);
            if (!res.ok) {
                throw new Error("문제 파일 없음");
            }
            return res.json();
        })
        .then((data: QuestionSet) => {
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
            grade: {
                grade2: '중학교 2학년',
                grade3: '중학교 3학년',
                grade10: '고등학교 1학년',
                grade11: '고등학교 2학년',
                grade12: '고등학교 3학년',
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

    // index.json 불러오기
    useEffect(() => {
        loadIndexFile();
        setSelectedSetName("");
        setQuestions([]);
        setUserAnswers([]);
        setShowResult(false);
        setLoadError(false);
    }, [ grade, semester, examType, subject, loadIndexFile ]);


    return (
        <div className="flex min-h-screen">
            <Sidebar
                grade={ grade }
                semester={ semester }
                examType={ examType }
                subject={ subject }
                onChangeGrade={ setGrade }
                onChangeSemester={ setSemester }
                onChangeExamType={ setExamType }
                onChangeSubject={ setSubject }
            />
            <div className="flex-1 p-6">
                <div className="flex justify-between mb-4 items-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            { translateLabel(grade, "grade") }{ " " }
                            { translateLabel(semester, "semester") }{ " " }
                            { translateLabel(examType, "examType") }{ " " }
                            { translateLabel(subject, "subject") } 시험
                        </h1>

                        {/* 문제 세트 선택 팝업 (오버레이로 띄우기) */ }
                        { showFileSelector && availableSets.length > 0 && (
                            <QuestionSetSelector
                                availableSets={ availableSets }
                                onSelect={ (name, file) => {
                                    handleFileSelect(name, file);
                                    setShowFileSelector(false);
                                } }
                                onClose={ () => setShowFileSelector(false) }
                            />
                        ) }
                    </div>

                    { selectedSetName && (
                        <div className="text-lg font-medium text-blue-700 mb-2">
                            선택된 문제 세트: <span className="font-bold">{ selectedSetName }</span>
                        </div>
                    ) }
                    <div className="space-x-2">
                        <button
                            className="bg-pink-600 text-white px-4 py-2 rounded"
                            onClick={ () => setShowFileSelector(prev => !prev) }
                        >
                            문제 선택
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={ () => {
                                if (selectedSetName) {
                                    const fileObj = availableSets.find(
                                        (item) => item.name === selectedSetName
                                    );
                                    if (fileObj) {
                                        handleFileSelect(fileObj.name, fileObj.file);
                                    }
                                }
                            } }
                        >
                            문제 재배치
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={ submitAnswers }
                        >
                            정답 제출
                        </button>
                    </div>
                </div>

                { loadError || (availableSets.length === 0) ? (
                    <div className="text-red-500 text-lg text-center mt-10">
                        해당 시험 문제는 아직 준비되지 않았습니다.
                    </div>
                ) : (
                    <QuestionPanel
                        questions={ questions }
                        userAnswers={ userAnswers }
                        setUserAnswers={ setUserAnswers }
                        showResult={ showResult }
                    />
                ) }
            </div>
        <ScrollToTopButton />
        </div>
    );
}

export default QuizPage;