// components/QuestionSetSelector.tsx
import React from 'react';

interface Props {
    availableSets: { name: string; file: string }[];
    onSelect: (name: string, file: string) => void;
    onClose: () => void;
}

export default function QuestionSetSelector({ availableSets, onSelect, onClose }: Props) {
    return (
        // 반투명 오버레이 배경
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* 모달 컨테이너 */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                {/* 헤더 */}
                <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">문제 선택</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* 문제 목록 */}
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    {availableSets.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            사용 가능한 문제 세트가 없습니다.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {availableSets.map(({ name, file }) => (
                                <button
                                    key={file}
                                    onClick={() => onSelect(name, file)}
                                    className="w-full text-left px-4 py-3 rounded bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
