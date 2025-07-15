import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import "./styles/Game.css";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="App">
      {started ? (
        <GameScreen />
      ) : (
        <StartScreen onStart={() => setStarted(true)} />
      )}
    </div>
  );
}

export default App;
