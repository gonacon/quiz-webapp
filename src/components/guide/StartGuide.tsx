import React from 'react';

export const StartGuide = () => {
    return (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 w-full">
            <h4 className="font-bold text-lg mb-2 text-blue-800">🚀 시작하기</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>왼쪽 사이드바에서 원하는 <strong>학년</strong>을 선택하세요.</li>
                <li><strong>학기</strong>와 <strong>시험 유형</strong>을 선택하세요.</li>
                <li>학습하고 싶은 <strong>과목</strong>을 선택하세요.</li>
                <li>'<strong>문제 선택</strong>' 버튼을 클릭하여 문제 세트를 선택하세요.</li>
                <li>문제를 풀고 '<strong>정답 제출</strong>' 버튼을 클릭하여 결과를 확인하세요.</li>
            </ol>
        </div>
    );
}; 