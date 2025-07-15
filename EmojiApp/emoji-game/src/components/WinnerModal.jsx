import React from "react";

export default function WinnerModal({ winner }) {
  return (
    <div className="winner-modal">
      <h2>{winner} победил! 🎉</h2>
      <p>Обновите страницу, чтобы сыграть снова.</p>
    </div>
  );
}
