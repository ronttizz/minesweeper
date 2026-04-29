import { DIFFICULTIES } from "../constants";

/**
 * Renders difficulty selector buttons and the "New Game" reset button.
 *
 * Props:
 *   difficulty         – currently active difficulty key
 *   onDifficultyChange – (diffKey: string) => void
 *   onReset            – () => void
 */
export function Controls({ difficulty, onDifficultyChange, onReset }) {
  return (
    <div className="controls">
      <div className="diff-group">
        {Object.keys(DIFFICULTIES).map(key => (
          <button
            key={key}
            className={`diff-btn ${difficulty === key ? "active" : ""}`}
            onClick={() => onDifficultyChange(key)}
          >
            {DIFFICULTIES[key].label}
          </button>
        ))}
      </div>

      <button
        className="reset-btn"
        // Call reset without passing the click event as the "diff" arg.
        // Passing the event breaks initGame's difficulty lookup.
        onClick={() => onReset()}
      >
        ↺ NEW GAME
      </button>
    </div>
  );
}
