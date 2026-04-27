import { GAME_STATE } from "../constants";

const STATUS_MESSAGES = {
  [GAME_STATE.WON]:     "// FIELD CLEARED — MISSION COMPLETE",
  [GAME_STATE.LOST]:    "// DETONATION EVENT — MISSION FAILED",
  [GAME_STATE.IDLE]:    "// AWAITING FIRST INPUT...",
  [GAME_STATE.PLAYING]: "// SWEEP IN PROGRESS...",
};

/**
 * Displays mines remaining, elapsed time, and current game status.
 *
 * Props:
 *   minesLeft – number of unflagged mines remaining
 *   elapsed   – seconds elapsed since game start
 *   gameState – current GAME_STATE value
 */
export function StatsBar({ minesLeft, elapsed, gameState }) {
  const statusClass = [
    "status-text",
    gameState === GAME_STATE.WON  ? "won"  : "",
    gameState === GAME_STATE.LOST ? "lost" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-label">MINES REMAINING</div>
        <div className={`stat-value ${minesLeft < 0 ? "danger" : ""}`}>
          {String(minesLeft).padStart(3, "0")}
        </div>
      </div>

      <div className="stat">
        <div className="stat-label">ELAPSED (SEC)</div>
        <div className="stat-value">
          {String(Math.min(elapsed, 999)).padStart(3, "0")}
        </div>
      </div>

      <div className={statusClass}>
        {STATUS_MESSAGES[gameState]}
      </div>
    </div>
  );
}
