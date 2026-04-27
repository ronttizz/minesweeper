import { useState } from "react";
import { GAME_STATE, CELL_NUM_COLORS } from "../constants";

/**
 * Renders a single minesweeper cell.
 *
 * Props:
 *   cell       – cell data object { r, c, mine, revealed, flagged, adjacent }
 *   gameState  – current GAME_STATE value
 *   onReveal   – (r, c) => void
 *   onFlag     – (r, c) => void
 *   onChord    – (r, c) => void
 */
export function Cell({ cell, gameState, onReveal, onFlag, onChord }) {
  const [flash, setFlash] = useState(false);

  const isActive =
    gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.IDLE;

  const handleClick = (e) => {
    e.preventDefault();
    if (!isActive || cell.flagged || cell.revealed) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    onReveal(cell.r, cell.c);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isActive || cell.revealed) return;
    onFlag(cell.r, cell.c);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (!cell.revealed || cell.adjacent === 0) return;
    onChord(cell.r, cell.c);
  };

  const { classNames, content } = resolveCellAppearance(cell, gameState, flash);

  return (
    <div
      className={classNames}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      {content}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Derives CSS class string and rendered content for a cell
 * based on its current state and the overall game state.
 */
function resolveCellAppearance(cell, gameState, flash) {
  const classes = ["cell"];
  let content = null;

  if (cell.revealed) {
    classes.push("revealed");

    if (cell.mine) {
      classes.push("mine");
      content = <span className="mine-icon">✕</span>;
    } else if (cell.adjacent > 0) {
      content = (
        <span className="num" style={{ color: CELL_NUM_COLORS[cell.adjacent] }}>
          {cell.adjacent}
        </span>
      );
    }
  } else {
    classes.push("hidden");

    if (cell.flagged) {
      classes.push("flagged");
      content = <span className="flag-icon">⚑</span>;
    }

    if (flash) classes.push("flash");
  }

  // Post-loss overrides
  if (gameState === GAME_STATE.LOST) {
    if (cell.mine && !cell.revealed && !cell.flagged) {
      classes.push("revealed", "mine", "miss");
      content = <span className="mine-icon dim">✕</span>;
    }
    if (cell.flagged && !cell.mine) {
      classes.push("wrong-flag");
    }
  }

  return { classNames: classes.join(" "), content };
}
