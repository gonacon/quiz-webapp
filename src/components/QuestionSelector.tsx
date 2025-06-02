// components/QuestionSetSelector.tsx
import React from 'react';

interface Props {
    availableSets: { name: string; file: string }[];
    onSelect: (name: string, file: string) => void;
    onClose: () => void;
}

export default function QuestionSetSelector({ availableSets, onSelect, onClose }: Props) {
    return (
        <div className="fixed top-20 right-6 z-50 bg-white border border-gray-300 shadow-lg rounded p-4 w-80">
            <div className="mb-2 font-semibold">문제 선택:</div>
            <div className="grid grid-cols-1 gap-2">
                {availableSets.map(({ name, file }) => (
                    <button
                        key={file}
                        className="bg-gray-100 hover:bg-gray-200 text-sm px-2 py-1 rounded text-left"
                        onClick={() => onSelect(name, file)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div className="text-right mt-3">
                <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
        </div>
    );
}
