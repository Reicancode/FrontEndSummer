import React from "react";

export default function AnswerButtons({ options, onAnswer, disabled }) {
  return (
    <div className="answer-buttons">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onAnswer(opt)}
          disabled={disabled}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
