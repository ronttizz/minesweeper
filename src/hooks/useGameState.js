import { useState, useCallback, useRef } from "react";
import { DIFFICULTIES, GAME_STATE } from "../constants";
import {
  createBoard,
  placeMines,
  floodReveal,
  revealAllMines,
  checkWin,
} from "../utils/boardUtils";
import { useTimer } from "./useTimer";

/**
 * Encapsulates all Minesweeper game state and action handlers.
 */
export function useGameState() {
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);
  const [board, setBoard] = useState(() => {
    const { rows, cols } = DIFFICULTIES.BEGINNER;
    return createBoard(rows, cols);
  });
  const [flagCount, setFlagCount] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, resetTimer] = useTimer(timerRunning);

  // Always holds the latest difficulty without causing stale closures.
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  // ── Actions ─────────────────────────────────────────────────────────────────

  const initGame = useCallback((diff) => {
    // Fall back to the current difficulty via ref — never stale.
    const key = diff ?? difficultyRef.current;
    const d = DIFFICULTIES[key];
    setBoard(createBoard(d.rows, d.cols));
    setGameState(GAME_STATE.IDLE);
    setFlagCount(0);
    setTimerRunning(false);
    resetTimer();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDifficultyChange = useCallback((diff) => {
    setDifficulty(diff);
    const d = DIFFICULTIES[diff];
    setBoard(createBoard(d.rows, d.cols));
    setGameState(GAME_STATE.IDLE);
    setFlagCount(0);
    setTimerRunning(false);
    resetTimer();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReveal = useCallback((r, c) => {
    setBoard(prev => {
      let next = prev;

      // First click: plant mines around the safe zone
      if (gameState === GAME_STATE.IDLE) {
        next = placeMines(prev, rows, cols, mines, r, c);
        setGameState(GAME_STATE.PLAYING);
        setTimerRunning(true);
      }

      if (next[r][c].mine) {
        setGameState(GAME_STATE.LOST);
        setTimerRunning(false);
        return revealAllMines(next);
      }

      const revealed = floodReveal(next, rows, cols, r, c);

      if (checkWin(revealed)) {
        setGameState(GAME_STATE.WON);
        setTimerRunning(false);
      }

      return revealed;
    });
  }, [gameState, rows, cols, mines]);

  const handleFlag = useCallback((r, c) => {
    if (gameState === GAME_STATE.IDLE) return;

    setBoard(prev => {
      const next = prev.map(row => row.map(cell => ({ ...cell })));
      const cell = next[r][c];

      if (cell.flagged) {
        cell.flagged = false;
        setFlagCount(f => f - 1);
      } else {
        cell.flagged = true;
        setFlagCount(f => f + 1);
      }

      return next;
    });
  }, [gameState]);

  const handleChord = useCallback((r, c) => {
    if (gameState !== GAME_STATE.PLAYING) return;

    setBoard(prev => {
      const cell = prev[r][c];

      const flagsAround = countFlagsAround(prev, rows, cols, r, c);
      if (flagsAround !== cell.adjacent) return prev;

      let next = prev.map(row => row.map(c2 => ({ ...c2 })));
      let hitMine = false;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = next[nr][nc];
            if (!neighbor.revealed && !neighbor.flagged) {
              if (neighbor.mine) {
                hitMine = true;
              } else {
                next = floodReveal(next, rows, cols, nr, nc);
              }
            }
          }
        }
      }

      if (hitMine) {
        setGameState(GAME_STATE.LOST);
        setTimerRunning(false);
        return revealAllMines(next);
      }

      if (checkWin(next)) {
        setGameState(GAME_STATE.WON);
        setTimerRunning(false);
      }

      return next;
    });
  }, [gameState, rows, cols]);

  // ── Derived values ───────────────────────────────────────────────────────────

  const minesLeft = mines - flagCount;

  return {
    difficulty,
    gameState,
    board,
    minesLeft,
    elapsed,
    onReveal: handleReveal,
    onFlag: handleFlag,
    onChord: handleChord,
    onReset: initGame,
    onDifficultyChange: handleDifficultyChange,
  };
}

// ── Private helpers ────────────────────────────────────────────────────────────

function countFlagsAround(board, rows, cols, r, c) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].flagged) {
        count++;
      }
    }
  }
  return count;
}
