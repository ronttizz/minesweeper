# 💣 Minesweeper

A browser-based classic Minesweeper game built with React. Features a retro military terminal aesthetic with CRT scanlines, phosphor green glow, and full gameplay mechanics including flood-fill reveal, flagging, and chording.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [How to Play](#how-to-play)
- [Architecture](#architecture)
  - [Constants](#constants)
  - [Utilities](#utilities)
  - [Hooks](#hooks)
  - [Components](#components)
- [Game States](#game-states)
- [Difficulty Levels](#difficulty-levels)

---

## Features

- Three difficulty levels: Beginner, Intermediate, and Expert
- Safe first click — mines are placed after the first click, guaranteeing a 3×3 mine-free zone around it
- Flood-fill reveal — clicking an empty cell cascades across all connected empty cells
- Right-click flagging with a live mines-remaining counter
- Chording — double-click a numbered cell to auto-clear its neighbors when the correct number of flags are placed
- Live elapsed timer that starts on first click and stops on win or loss
- Full win/loss detection with mine reveal and board glow feedback
- Wrong-flag indicators shown after a loss
- Retro CRT terminal aesthetic with scanlines and phosphor glow effects
- Responsive layout for mobile screens

---

## Project Structure

```
minesweeper/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                  # Root component — composes the full UI
│   ├── constants.js             # Shared constants: difficulties, game states, colors
│   ├── styles/
│   │   └── index.css            # All global styles
│   ├── utils/
│   │   └── boardUtils.js        # Pure board logic functions
│   ├── hooks/
│   │   ├── useTimer.js          # Elapsed-time counter hook
│   │   └── useGameState.js      # All game state and action handlers
│   └── components/
│       ├── Cell.jsx             # Single grid cell
│       ├── Board.jsx            # Full mine grid
│       ├── Header.jsx           # Title and system label
│       ├── Controls.jsx         # Difficulty selector and New Game button
│       ├── StatsBar.jsx         # Mines remaining, timer, and status message
│       └── Footer.jsx           # Keyboard/mouse control hints
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher (bundled with Node.js)

To verify your versions:

```bash
node --version
npm --version
```

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/minesweeper.git
cd minesweeper
```

2. **Scaffold a Vite + React project** (if starting from scratch rather than cloning):

```bash
npm create vite@latest minesweeper -- --template react
cd minesweeper
```

3. **Install dependencies:**

```bash
npm install
```

4. **Copy the source files** into `src/` following the [Project Structure](#project-structure) above, replacing the Vite boilerplate files.

### Running Locally

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default. The dev server supports hot module replacement — changes to any source file are reflected in the browser instantly without a full page reload.

### Building for Production

Compile and bundle the app for deployment:

```bash
npm run build
```

The optimised output is written to the `dist/` directory. To preview the production build locally before deploying:

```bash
npm run preview
```

---

## How to Play

| Action | Control |
|---|---|
| Reveal a cell | Left click |
| Place / remove a flag | Right click |
| Chord (auto-reveal neighbors) | Double click a revealed number |
| Start a new game | Click **↺ NEW GAME** |
| Change difficulty | Click **BEGINNER**, **INTERMEDIATE**, or **EXPERT** |

**Rules:**

- The board is filled with hidden mines. Your goal is to reveal every cell that does not contain a mine.
- Numbers indicate how many mines are adjacent to that cell (including diagonals).
- Flag cells you believe contain mines to keep track of them. The mines-remaining counter decrements with each flag placed.
- Revealing a mine ends the game immediately. All mines are shown and wrong flags are highlighted.
- Revealing every safe cell wins the game.

**Chording** is an advanced technique: if a revealed number cell already has the correct number of flags placed around it, double-clicking it will automatically reveal all remaining unrevealed, unflagged neighbors. If any of those neighbors is an unflagged mine, the game ends.

---

## Architecture

### Constants

**`src/constants.js`**

Centralises all magic values used across the project:

- `DIFFICULTIES` — grid dimensions and mine count for each level.
- `GAME_STATE` — the four possible states the game can be in: `IDLE`, `PLAYING`, `WON`, `LOST`.
- `CELL_NUM_COLORS` — maps adjacent mine counts (1–8) to their display colours.

### Utilities

**`src/utils/boardUtils.js`**

Contains pure functions with no side effects. Each function takes a board and returns a new board, making them easy to test in isolation.

| Function | Description |
|---|---|
| `createBoard(rows, cols)` | Returns a blank 2D array of cell objects with no mines placed. |
| `placeMines(board, rows, cols, mines, safeR, safeC)` | Returns a new board with mines randomly distributed, skipping a 3×3 safe zone around `(safeR, safeC)`. Also pre-computes `adjacent` counts for every cell. |
| `floodReveal(board, rows, cols, r, c)` | BFS flood-fill that reveals cells starting from `(r, c)`. Stops at flagged cells and cells with a non-zero adjacent count. |
| `revealAllMines(board)` | Returns a new board with every mine cell set to `revealed: true`. Used on game over. |
| `checkWin(board)` | Returns `true` when every non-mine cell is revealed. |

### Hooks

**`src/hooks/useTimer.js`**

Manages elapsed time in seconds. Accepts a `running` boolean and uses `setInterval` to increment a counter while active. Cleans up the interval on unmount or when `running` becomes false.

Returns `[elapsed, resetTimer]`.

**`src/hooks/useGameState.js`**

The single source of truth for all game state. Composes `useTimer` internally and exposes a clean interface to `App`. Keeps all game logic out of the component tree.

Returned values:

| Key | Type | Description |
|---|---|---|
| `difficulty` | `string` | Active difficulty key (`"BEGINNER"` etc.) |
| `gameState` | `string` | Current `GAME_STATE` value |
| `board` | `Cell[][]` | 2D array of cell objects |
| `minesLeft` | `number` | Total mines minus flags placed |
| `elapsed` | `number` | Seconds since the first click |
| `onReveal` | `(r, c) => void` | Reveal a cell; seeds mines on the very first call |
| `onFlag` | `(r, c) => void` | Toggle a flag on an unrevealed cell |
| `onChord` | `(r, c) => void` | Chord from a revealed numbered cell |
| `onReset` | `(diff?) => void` | Reset the board, optionally switching difficulty |
| `onDifficultyChange` | `(diff) => void` | Switch difficulty and reset |

### Components

All components are **presentational by design** — they receive data and callbacks via props and contain no game logic of their own.

**`Header`**

Renders the game title and system subtitle. No props.

**`Controls`**

Renders the difficulty selector and New Game button.

| Prop | Type | Description |
|---|---|---|
| `difficulty` | `string` | Currently active difficulty key |
| `onDifficultyChange` | `(diff) => void` | Called when a difficulty button is clicked |
| `onReset` | `() => void` | Called when New Game is clicked |

**`StatsBar`**

Displays mines remaining, elapsed time, and a status message that reflects the current game state.

| Prop | Type | Description |
|---|---|---|
| `minesLeft` | `number` | Unflagged mines remaining |
| `elapsed` | `number` | Seconds elapsed |
| `gameState` | `string` | Current `GAME_STATE` value |

**`Board`**

Renders the full mine grid using CSS Grid. Delegates individual cell rendering to `Cell`.

| Prop | Type | Description |
|---|---|---|
| `board` | `Cell[][]` | 2D array of cell objects |
| `cols` | `number` | Number of columns (used to set `grid-template-columns`) |
| `gameState` | `string` | Current `GAME_STATE` value |
| `onReveal` | `(r, c) => void` | Passed through to each `Cell` |
| `onFlag` | `(r, c) => void` | Passed through to each `Cell` |
| `onChord` | `(r, c) => void` | Passed through to each `Cell` |

**`Cell`**

Handles the three mouse interactions for a single cell (click, right-click, double-click) and derives its visual appearance via the private `resolveCellAppearance` helper. Manages a local `flash` state for the click animation.

| Prop | Type | Description |
|---|---|---|
| `cell` | `object` | `{ r, c, mine, revealed, flagged, adjacent }` |
| `gameState` | `string` | Current `GAME_STATE` value |
| `onReveal` | `(r, c) => void` | Called on left click |
| `onFlag` | `(r, c) => void` | Called on right click |
| `onChord` | `(r, c) => void` | Called on double click |

**`Footer`**

Renders the control hint bar. No props.

---

## Game States

The game moves through four states managed in `useGameState`:

```
IDLE ──(first click)──► PLAYING ──(mine hit)──► LOST
                              └──(all safe cells revealed)──► WON
```

- **`IDLE`** — board is freshly initialised, no mines placed yet. Clicking any cell transitions to `PLAYING` and plants mines.
- **`PLAYING`** — active game, timer running.
- **`WON`** — all non-mine cells revealed. Timer stops, board glows green.
- **`LOST`** — a mine was revealed. Timer stops, all mines shown, board glows red.

Resetting the game or changing difficulty always returns to `IDLE`.

---

## Difficulty Levels

| Level | Grid | Mines | Mine density |
|---|---|---|---|
| Beginner | 9 × 9 | 10 | ~12% |
| Intermediate | 16 × 16 | 40 | ~16% |
| Expert | 16 × 30 | 99 | ~21% |
