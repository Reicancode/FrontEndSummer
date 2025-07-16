import React, { useEffect, useState } from "react";
import questions from "../data/questions.json";
import EmojiDisplay from "./EmojiDisplay";
import AnswerButtons from "./AnswerButtons";
import ScoreBoard from "./ScoreBoard";
import WinnerModal from "./WinnerModal";

const getRandomQuestion = (usedIndexes) => {
  const available = questions
    .map((q, index) => ({ ...q, index }))
    .filter((q) => !usedIndexes.includes(q.index));

  if (available.length === 0) return null;

  const random = available[Math.floor(Math.random() * available.length)];
  return random;
};

export default function GameScreen() {
  const [usedIndexes, setUsedIndexes] = useState([]);
  const [question, setQuestion] = useState(getRandomQuestion([]));
  const [playerTurn, setPlayerTurn] = useState(null);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [answered, setAnswered] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleKeyDown = (e) => {
    if (answered || playerTurn !== null || winner) return;

    if (e.key === "a") setPlayerTurn(1);
    if (e.key === "l") setPlayerTurn(2);
  };

  const handleAnswer = (answer) => {
    if (!question) return;

    setAnswered(true);

    if (answer === question.answer || answer === question.correct) {
      const newScores = { ...scores };
      newScores[`p${playerTurn}`] += 1;
      setScores(newScores);

      if (newScores[`p${playerTurn}`] === 5) {
        setWinner(`Игрок ${playerTurn}`);
        return;
      }

      const newUsed = [...usedIndexes, question.index];
      const next = getRandomQuestion(newUsed);

      setTimeout(() => {
        setUsedIndexes(newUsed);
        setQuestion(next);
        setPlayerTurn(null);
        setAnswered(false);
      }, 1500);
    } else {
      setTimeout(() => {
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
        setAnswered(false);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answered, playerTurn, winner]);

  if (!question && !winner) {
    return (
      <div className="game-screen">
        <h2>❗ Все вопросы закончились!</h2>
        <p>Никто не набрал 5 очков вовремя.</p>
      </div>
    );
  }

  return (
    <div
      className={`game-screen ${
        playerTurn === 1
          ? "player1-active"
          : playerTurn === 2
          ? "player2-active"
          : ""
      }`}
    >
      <ScoreBoard scores={scores} />
      <div className="game-content">
        <div className="key-hint">A</div>
        <EmojiDisplay emoji={question?.emoji || "❓"} />
        <div className="key-hint">L</div>
      </div>
      {playerTurn && question && (
        <AnswerButtons
          options={question.options}
          onAnswer={handleAnswer}
          disabled={answered}
        />
      )}
      {winner && <WinnerModal winner={winner} />}
    </div>
  );
}
