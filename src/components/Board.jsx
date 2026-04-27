import { useRef } from "react";
import { GAME_STATE } from "../constants";
import { Cell } from "./Cell";

/**
 * Renders the full mine grid.
 *
 * Props:
 *   board      – 2-D array of cell objects
 *   cols       – number of columns (drives CSS grid)
 *   gameState  – current GAME_STATE value
 *   onReveal   – (r, c) => void
 *   onFlag     – (r, c) => void
 *   onChord    – (r, c) => void
 */
export function Board({ board, cols, gameState, onReveal, onFlag, onChord }) {
  const boardRef = useRef(null);

  const wrapperClass = [
    "board-wrapper",
    gameState === GAME_STATE.WON  ? "won"  : "",
    gameState === GAME_STATE.LOST ? "lost" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={wrapperClass}>
      <div
        ref={boardRef}
        className="board"
        style={{ gridTemplateColumns: `repeat(${cols}, 28px)` }}
      >
        {board.map(row =>
          row.map(cell => (
            <Cell
              key={`${cell.r}-${cell.c}`}
              cell={cell}
              gameState={gameState}
              onReveal={onReveal}
              onFlag={onFlag}
              onChord={onChord}
            />
          ))
        )}
      </div>
    </div>
  );
}
