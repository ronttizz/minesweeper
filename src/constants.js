export const DIFFICULTIES = {
  BEGINNER:     { rows: 9,  cols: 9,  mines: 10, label: "BEGINNER" },
  INTERMEDIATE: { rows: 16, cols: 16, mines: 40, label: "INTERMEDIATE" },
  EXPERT:       { rows: 16, cols: 30, mines: 99, label: "EXPERT" },
};

export const GAME_STATE = {
  IDLE:    "IDLE",
  PLAYING: "PLAYING",
  WON:     "WON",
  LOST:    "LOST",
};

export const CELL_NUM_COLORS = [
  "",
  "#4ade80", // 1 – green
  "#60a5fa", // 2 – blue
  "#f87171", // 3 – red
  "#c084fc", // 4 – purple
  "#fb923c", // 5 – orange
  "#22d3ee", // 6 – cyan
  "#f472b6", // 7 – pink
  "#a3e635", // 8 – lime
];
