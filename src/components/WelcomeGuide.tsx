import React from 'react';

export const WelcomeGuide = () => {
    return (
        <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-700">
                📚 문제 풀이 연습을 시작해보세요!
            </h2>
            <p className="text-gray-600 max-w-2xl">
                왼쪽 메뉴에서 학년, 학기, 시험 유형, 과목을 선택한 후,<br/>
                '문제 선택' 버튼을 클릭하여 원하는 문제 세트를 선택해주세요.
            </p>
        </div>
    );
}; 