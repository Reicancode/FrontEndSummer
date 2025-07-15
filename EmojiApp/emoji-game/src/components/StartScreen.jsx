import React from "react";

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>🧠 Угадай слово по Эмодзи</h1>
      <button onClick={onStart}>Начать игру</button>
    </div>
  );
}
