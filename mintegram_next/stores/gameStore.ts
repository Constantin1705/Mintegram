import { create } from 'zustand';
import { Cell, Clue, Puzzle } from '@/types';

interface GameState {
  puzzle: Puzzle | null;
  letters: Record<string, string>;
  selectedCell: Cell | null;
  direction: 'across' | 'down';
  highlightedCells: Cell[];
  selectedClue: Clue | null;
  isComplete: boolean;
  timer: number;
  
  // Actions
  setPuzzle: (puzzle: Puzzle) => void;
  setLetter: (key: string, letter: string) => void;
  selectCell: (cell: Cell) => void;
  toggleDirection: () => void;
  setDirection: (direction: 'across' | 'down') => void;
  setHighlightedCells: (cells: Cell[]) => void;
  setSelectedClue: (clue: Clue) => void;
  checkComplete: () => boolean;
  resetGame: () => void;
  incrementTimer: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  puzzle: null,
  letters: {},
  selectedCell: null,
  direction: 'across',
  highlightedCells: [],
  selectedClue: null,
  isComplete: false,
  timer: 0,

  setPuzzle: (puzzle: Puzzle) => {
    const letters: Record<string, string> = {};
    puzzle.cells.forEach(cell => {
      if (!cell.is_block) {
        letters[`${cell.row}-${cell.col}`] = '';
      }
    });
    set({ puzzle, letters, isComplete: false, timer: 0 });
  },

  setLetter: (key: string, letter: string) => {
    set(state => ({
      letters: {
        ...state.letters,
        [key]: letter.toUpperCase(),
      },
    }));
  },

  selectCell: (cell: Cell) => {
    set({ selectedCell: cell });
  },

  toggleDirection: () => {
    set(state => ({
      direction: state.direction === 'across' ? 'down' : 'across',
    }));
  },

  setDirection: (direction: 'across' | 'down') => {
    set({ direction });
  },

  setHighlightedCells: (cells: Cell[]) => {
    set({ highlightedCells: cells });
  },

  setSelectedClue: (clue: Clue) => {
    set({ selectedClue: clue, direction: clue.direction });
  },

  checkComplete: () => {
    const { puzzle, letters } = get();
    if (!puzzle) return false;

    const allCorrect = puzzle.cells
      .filter(cell => !cell.is_block)
      .every(cell => {
        const key = `${cell.row}-${cell.col}`;
        return letters[key]?.toUpperCase() === cell.answer?.toUpperCase();
      });

    set({ isComplete: allCorrect });
    return allCorrect;
  },

  resetGame: () => {
    const { puzzle } = get();
    if (!puzzle) return;

    const letters: Record<string, string> = {};
    puzzle.cells.forEach(cell => {
      if (!cell.is_block) {
        letters[`${cell.row}-${cell.col}`] = '';
      }
    });

    set({
      letters,
      selectedCell: null,
      highlightedCells: [],
      selectedClue: null,
      isComplete: false,
      timer: 0,
    });
  },

  incrementTimer: () => {
    set(state => ({ timer: state.timer + 1 }));
  },
}));
