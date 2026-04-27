import "./styles/index.css";

import { DIFFICULTIES } from "./constants";
import { useGameState } from "./hooks/useGameState";

import { Header }   from "./components/Header";
import { Controls } from "./components/Controls";
import { StatsBar } from "./components/StatsBar";
import { Board }    from "./components/Board";
import { Footer }   from "./components/Footer";

export default function App() {
  const {
    difficulty,
    gameState,
    board,
    minesLeft,
    elapsed,
    onReveal,
    onFlag,
    onChord,
    onReset,
    onDifficultyChange,
  } = useGameState();

  const { cols } = DIFFICULTIES[difficulty];

  return (
    <div className="app">
      <Header />

      <Controls
        difficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
        onReset={onReset}
      />

      <StatsBar
        minesLeft={minesLeft}
        elapsed={elapsed}
        gameState={gameState}
      />

      <Board
        board={board}
        cols={cols}
        gameState={gameState}
        onReveal={onReveal}
        onFlag={onFlag}
        onChord={onChord}
      />

      <Footer />
    </div>
  );
}
