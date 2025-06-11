import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    availableSets: { name: string; file: string }[];
}

export const CreateQuestionSection: React.FC<Props> = ({ availableSets }) => {
    const navigate = useNavigate();
    
    return (
        <div className="w-full max-w-4xl mx-auto text-center p-6 bg-gradient-to-b from-green-50 to-transparent rounded-lg border border-green-100">
            <div className="mb-4 text-gray-700">
                직접 문제를 만들어 다른 사람과 공유해보세요!
            </div>

            <button
                onClick={() => navigate('/create')}
                className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors duration-200 inline-flex items-center gap-2"
            >
                <span>✏️</span>
                <span>새로운 문제 만들기</span>
            </button>

            <div className="mt-4 mb-4 p-3 bg-white border rounded text-sm text-gray-700 leading-relaxed text-left">
                <strong>📘 문제 등록 안내</strong>
                <div>
                    <div>1. 아래에서 문제 만들기로 시험 문제를 작성해 주세요.</div>
                    <div>2. 작성이 완료되면 "JSON 다운로드" 버튼을 눌러 파일을 저장하세요.</div>
                    <div>3. 저장한 파일을 이메일로 보내 주세요.</div>
                    <div>4. 파일을 확인한 후, 문제는 자동으로 시스템에 등록되어 시험에 표시됩니다.</div>
                </div>
            </div>
        </div>
    );
}; 