import React from "react";

export default function ScoreBoard({ scores }) {
  return (
    <div className="scoreboard">
      <div className="score p1">Игрок 1: {scores.p1}</div>
      <div className="score p2">Игрок 2: {scores.p2}</div>
    </div>
  );
}
