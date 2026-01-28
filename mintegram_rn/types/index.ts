// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  xp: number;
  level: number;
  diamonds: number;
  coins: number;
  profile_picture: string | null;
}

// Crossword Types
export interface Cell {
  row: number;
  col: number;
  is_block: boolean;
  number?: number;
  answer?: string;
  letter?: string;
}

export interface Clue {
  number: number;
  text: string;
  answer: string;
  direction: 'across' | 'down';
  start_row: number;
  start_col: number;
  length: number;
}

export interface Puzzle {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  rows: number;
  cols: number;
  cells: Cell[];
  clues: Clue[];
  description?: string;
  category?: string;
  cover?: string;
  size?: string;
  estimate?: number;
  tags?: string[];
  color?: string;
}

// Game State
export interface GameState {
  selectedCell: Cell | null;
  direction: 'across' | 'down';
  letters: Record<string, string>;
  highlightedCells: Cell[];
  completed: boolean;
}
