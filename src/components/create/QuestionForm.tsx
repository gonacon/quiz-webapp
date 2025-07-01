import React, { forwardRef, useState } from "react";

interface Question {
  passageTitle: string;
  passage: string;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  type: string;
  image?: string;
}

interface Props {
  index: number;
  question: Question;
  onChange: (index: number, field: keyof Question, value: string | number) => void;
  onChoiceChange: (qIndex: number, cIndex: number, value: string) => void;
  onRemove: (index: number) => void;
  onAddChoice: (qIndex: number) => void;
  onRemoveChoice: (qIndex: number, cIndex: number) => void;
}

const QuestionForm = forwardRef<HTMLDivElement, Props>(
  ({ index, question, onChange, onChoiceChange, onRemove, onAddChoice, onRemoveChoice }, ref) => {
    const [isPasteFocus, setIsPasteFocus] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // 파일을 Base64로 변환
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(index, "image", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      onChange(index, "image", "");
    };

    return (
      <div ref={ref} className="relative border p-4 mb-6 rounded bg-gray-50">
        <button
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 bg-orange-500 text-yellow-300 text-[15px] px-2 py-1 rounded hover:bg-red-600 leading-tight"
        >
          삭제
        </button>

        <label className="block font-semibold mb-2">문제 {index + 1}</label>
        <label className="block mb-1">지문 제목</label>
        <input
          type="text"
          className="w-full p-2 border mb-3"
          value={question.passageTitle}
          onChange={(e) => onChange(index, "passageTitle", e.target.value)}
        />

        <label className="block mb-1">지문 내용</label>
        <textarea
          className="w-full p-2 border mb-3 h-20"
          value={question.passage}
          onChange={(e) => onChange(index, "passage", e.target.value)}
        />

        <label className="block mb-1">문제  {index + 1}</label>
        <input
          type="text"
          className="w-full p-2 border mb-3"
          value={question.question}
          onChange={(e) => onChange(index, "question", e.target.value)}
        />

        <label className="block mb-1">선택지</label>
        {question.choices.map((opt, j) => (
          <div key={j} className="flex items-center gap-2 mb-2">
            <span>{j + 1}. </span>
            <input
              type="radio"
              name={`answer-${index}`}
              className="mr-2"
              checked={question.answer === j}
              onChange={() => onChange(index, "answer", j)}
            />
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              value={opt}
              onChange={(e) => onChoiceChange(index, j, e.target.value)}
            />
            {question.choices.length > 1 && (
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 whitespace-nowrap"
                onClick={() => onRemoveChoice(index, j)}
              >
                삭제
              </button>
            )}
          </div>
        ))}

        <div className="mt-2">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-blue-800 px-3 py-1 rounded text-sm"
            onClick={() => onAddChoice(index)}
          >
            선택지 추가
          </button>
        </div>

        <label className="block mb-1">해설</label>
        <textarea
          className="w-full p-2 border mb-3 h-20"
          value={question.explanation}
          onChange={(e) => onChange(index, "explanation", e.target.value)}
        />

        <label className="block mb-1">이미지 첨부</label>
        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-2"
          />
          {/* 스크린샷(클립보드 이미지) 붙여넣기 지원 */}
          <div
            tabIndex={0}
            onFocus={() => setIsPasteFocus(true)}
            onBlur={() => setIsPasteFocus(false)}
            onPaste={e => {
              const items = e.clipboardData?.items;
              if (items) {
                for (let i = 0; i < items.length; i++) {
                  if (items[i].type.indexOf("image") !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onChange(index, "image", reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }
              }
            }}
            className="border border-dashed border-gray-400 rounded p-2 text-gray-500 text-sm cursor-pointer focus:outline-none relative"
            style={{ minHeight: 40 }}
            title="여기에 스크린샷을 붙여넣으세요"
          >
            여기에 스크린샷(이미지)을 붙여넣을 수 있습니다.
            {isPasteFocus && (
              <div className="absolute left-1 top-full mt-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 shadow z-10">
                Ctrl+V(윈도우) 또는 Command+V(맥)로 이미지를 붙여넣으세요
              </div>
            )}
          </div>
          {question.image && (
            <div className="relative">
              <img 
                src={question.image} 
                alt="문제 이미지" 
                className="max-w-full h-auto mb-2"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                이미지 삭제
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default QuestionForm;