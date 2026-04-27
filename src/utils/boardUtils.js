/**
 * Creates a blank board with no mines placed.
 */
export function createBoard(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

/**
 * Returns a deep copy of the board with mines randomly placed,
 * guaranteeing a safe 3×3 zone around (safeR, safeC).
 * Also pre-computes adjacent mine counts for every cell.
 */
export function placeMines(board, rows, cols, mines, safeR, safeC) {
  const safeZone = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeR + dr;
      const nc = safeC + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        safeZone.add(`${nr},${nc}`);
      }
    }
  }

  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeZone.has(`${r},${c}`)) candidates.push([r, c]);
    }
  }

  // Fisher-Yates shuffle
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const next = board.map(row => row.map(cell => ({ ...cell })));
  candidates.slice(0, mines).forEach(([r, c]) => {
    next[r][c].mine = true;
  });

  // Compute adjacent counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && next[nr][nc].mine) {
            count++;
          }
        }
      }
      next[r][c].adjacent = count;
    }
  }

  return next;
}

/**
 * Flood-fills revealed cells starting from (r, c).
 * Stops at flagged cells, mines, and cells with adjacent > 0.
 */
export function floodReveal(board, rows, cols, r, c) {
  const next = board.map(row => row.map(cell => ({ ...cell })));
  const queue = [[r, c]];
  const visited = new Set([`${r},${c}`]);

  while (queue.length) {
    const [cr, cc] = queue.shift();
    next[cr][cc].revealed = true;

    if (next[cr][cc].adjacent === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr;
          const nc = cc + dc;
          const key = `${nr},${nc}`;
          if (
            nr >= 0 && nr < rows &&
            nc >= 0 && nc < cols &&
            !visited.has(key) &&
            !next[nr][nc].mine &&
            !next[nr][nc].flagged
          ) {
            visited.add(key);
            queue.push([nr, nc]);
          }
        }
      }
    }
  }

  return next;
}

/**
 * Reveals all mine cells (used on game over).
 */
export function revealAllMines(board) {
  return board.map(row =>
    row.map(cell => (cell.mine ? { ...cell, revealed: true } : { ...cell }))
  );
}

/**
 * Returns true when every non-mine cell has been revealed.
 */
export function checkWin(board) {
  return board.every(row =>
    row.every(cell => (cell.mine ? !cell.revealed : cell.revealed))
  );
}
