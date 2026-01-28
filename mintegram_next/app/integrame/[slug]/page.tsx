'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { Spinner } from '@/components/ui/Spinner';
import confetti from 'canvas-confetti';

interface Cell {
  row: number;
  col: number;
  is_block: boolean;
  number?: number;
  solution?: string;
}

interface Clue {
  number: number;
  text: string;
  direction: 'across' | 'down';
  start_row: number;
  start_col: number;
}

interface Puzzle {
  id: number;
  title: string;
  rows: number;
  cols: number;
  cells: Cell[];
  clues: Clue[];
}

export default function IntegramePlayPage() {
  const params = useParams();
  const puzzleId = params.slug as string;

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [letters, setLetters] = useState<Record<string, string>>({});
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>('across');
  const [showCompletion, setShowCompletion] = useState(false);
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch puzzle
  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        console.log('Fetching puzzle with ID:', puzzleId);
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
        const response = await api.get<Puzzle>(`/api/puzzles/${puzzleId}/`);
        console.log('Puzzle fetched successfully:', response.data);
        setPuzzle(response.data);
        // Initialize letters as empty (user starts with blank grid)
        const initialLetters: Record<string, string> = {};
        response.data.cells.forEach((c) => {
          if (!c.is_block) {
            initialLetters[`${c.row}-${c.col}`] = '';
          }
        });
        setLetters(initialLetters);
      } catch (err) {
        console.error('Error fetching puzzle:', err);
        setError('Failed to load puzzle');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzle();
  }, [puzzleId]);

  // Check completion
  useEffect(() => {
    if (!puzzle) return;

    let isComplete = true;
    let filledCells = 0;
    
    for (const cell of puzzle.cells) {
      if (!cell.is_block) {
        const userLetter = letters[`${cell.row}-${cell.col}`]?.toUpperCase();
        const correctLetter = cell.solution?.toUpperCase();
        
        if (userLetter) filledCells++;
        
        if (!userLetter || userLetter !== correctLetter) {
          isComplete = false;
          break;
        }
      }
    }

    console.log('Completion check:', { isComplete, filledCells, totalCells: puzzle.cells.filter(c => !c.is_block).length });

    if (isComplete && filledCells > 0 && !showCompletion) {
      console.log('Puzzle completed!');
      setShowCompletion(true);
      playConfetti();
    }
  }, [letters, puzzle, showCompletion]);

  const playConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    confettiIntervalRef.current = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        if (confettiIntervalRef.current) {
          clearInterval(confettiIntervalRef.current);
          confettiIntervalRef.current = null;
        }
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      } as Parameters<typeof confetti>[0]);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      } as Parameters<typeof confetti>[0]);
    }, 250);
  };


  const keyOf = (row: number, col: number) => `${row}-${col}`;

  const cellAt = (row: number, col: number): Cell | undefined => {
    return puzzle?.cells.find((c) => c.row === row && c.col === col);
  };

  const startOfWord = (
    row: number,
    col: number,
    dir: 'across' | 'down'
  ): { row: number; col: number } => {
    let r = row,
      c = col;
    if (dir === 'across') {
      while (c > 1) {
        const left = cellAt(r, c - 1);
        if (!left || left.is_block) break;
        c--;
      }
    } else {
      while (r > 1) {
        const up = cellAt(r - 1, c);
        if (!up || up.is_block) break;
        r--;
      }
    }
    return { row: r, col: c };
  };

  const cellsForClue = (clue: Clue): Cell[] => {
    if (!puzzle) return [];
    const cells: Cell[] = [];
    let row = clue.start_row;
    let col = clue.start_col;

    while (true) {
      const cell = cellAt(row, col);
      if (!cell || cell.is_block) break;
      cells.push(cell);
      if (clue.direction === 'across') col++;
      else row++;
    }
    return cells;
  };

  const clueForCellAndDir = (
    row: number,
    col: number,
    dir: 'across' | 'down'
  ): Clue | null => {
    if (!puzzle) return null;
    const start = startOfWord(row, col, dir);
    return (
      puzzle.clues.find(
        (cl) =>
          cl.direction === dir &&
          cl.start_row === start.row &&
          cl.start_col === start.col
      ) || null
    );
  };

  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedClue) return false;
    return cellsForClue(selectedClue).some((c) => c.row === row && c.col === col);
  };

  const isLetterCorrect = (row: number, col: number): boolean => {
    const cell = cellAt(row, col);
    if (!cell) return false;
    const userLetter = letters[keyOf(row, col)]?.toUpperCase();
    const correctLetter = cell.solution?.toUpperCase();
    return userLetter === correctLetter;
  };

  const handleCellFocus = (row: number, col: number) => {
    let clue = clueForCellAndDir(row, col, currentDirection);
    if (!clue) {
      clue = clueForCellAndDir(row, col, currentDirection === 'across' ? 'down' : 'across');
    }
    setSelectedClue(clue);
  };

  const moveToNextCell = (row: number, col: number) => {
    let nextRow = row;
    let nextCol = col;

    if (currentDirection === 'across') {
      nextCol += 1;
    } else {
      nextRow += 1;
    }

    const nextCell = cellAt(nextRow, nextCol);
    if (nextCell && !nextCell.is_block) {
      const el = document.querySelector<HTMLInputElement>(
        `[data-key="${keyOf(nextRow, nextCol)}"]`
      );
      el?.focus();
    }
  };

  const handleCellInput = (row: number, col: number, value: string) => {
    const upper = value.toUpperCase();
    setLetters((prev) => ({
      ...prev,
      [keyOf(row, col)]: upper,
    }));

    // Move to next cell in the current direction
    if (upper) {
      moveToNextCell(row, col);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Space') {
      e.preventDefault();
      const newDir = currentDirection === 'across' ? 'down' : 'across';
      setCurrentDirection(newDir);

      const el = e.currentTarget;
      const key = el.getAttribute('data-key');
      if (key) {
        const [rStr, cStr] = key.split('-');
        const row = parseInt(rStr);
        const col = parseInt(cStr);
        const clue = clueForCellAndDir(row, col, newDir);
        if (clue) setSelectedClue(clue);
      }
    }
  };

  const selectClue = (clue: Clue) => {
    setSelectedClue(clue);
    setCurrentDirection(clue.direction);
    const cells = cellsForClue(clue);
    if (cells.length > 0) {
      const el = document.querySelector<HTMLInputElement>(
        `[data-key="${keyOf(cells[0].row, cells[0].col)}"]`
      );
      el?.focus();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">{error || 'Puzzle not found'}</div>
      </div>
    );
  }

  const cluesAcross = puzzle.clues.filter((c) => c.direction === 'across');
  const cluesDown = puzzle.clues.filter((c) => c.direction === 'down');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{puzzle.title}</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Grid Section */}
        <div className="col-span-12 md:col-span-7">
          <div
            className="inline-grid bg-gray-300 p-0.5 rounded-lg"
            style={{
              display: 'inline-grid',
              gridTemplateRows: `repeat(${puzzle.rows}, 36px)`,
              gridTemplateColumns: `repeat(${puzzle.cols}, 36px)`,
              gap: '2px',
            } as React.CSSProperties}
          >
            {puzzle.cells.map((cell) => {
              const key = keyOf(cell.row, cell.col);
              const isSelected = isHighlighted(cell.row, cell.col);
              const hasError =
                !cell.is_block &&
                letters[key] &&
                !isLetterCorrect(cell.row, cell.col);

              return (
                <div
                  key={key}
                  className={`relative flex items-center justify-center font-bold text-sm transition-all ${
                    cell.is_block
                      ? 'bg-gray-900'
                      : isSelected
                        ? 'bg-yellow-300 outline outline-2 outline-yellow-500'
                        : hasError
                          ? 'bg-red-50'
                          : 'bg-white'
                  }`}
                  style={{
                    gridRow: cell.row,
                    gridColumn: cell.col,
                  } as React.CSSProperties}
                >
                  {!cell.is_block && (
                    <>
                      {cell.number && (
                        <span className="absolute top-0.5 left-1 text-[9px] font-bold text-gray-600 leading-none">
                          {cell.number}
                        </span>
                      )}
                      <input
                        type="text"
                        data-key={key}
                        maxLength={1}
                        value={letters[key] || ''}
                        onChange={(e) =>
                          handleCellInput(cell.row, cell.col, e.target.value)
                        }
                        onFocus={() => handleCellFocus(cell.row, cell.col)}
                        onKeyDown={handleKeyDown}
                        className={`w-full h-full text-center border-none outline-none bg-transparent font-bold text-base uppercase ${
                          hasError
                            ? 'text-red-700'
                            : 'text-black'
                        }`}
                        style={{ caretColor: 'transparent' }}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 md:col-span-5 space-y-6">
          {/* Current Clue */}
          {selectedClue && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="text-sm text-gray-600 font-semibold">
                {selectedClue.number}. {selectedClue.direction === 'across' ? 'ORIZONTAL' : 'VERTICAL'}
              </div>
              <div className="text-base text-gray-800 mt-1">{selectedClue.text}</div>
            </div>
          )}

          {/* Help Section */}
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">ℹ️</span>
                <h3 className="font-semibold text-blue-900">Ajutor Navigație</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• <strong>Click</strong> pe o celulă pentru a o selecta</li>
                <li>• <strong>Spațiu</strong> pentru a schimba direcția</li>
                <li>• <strong>Săgeți</strong> pentru a naviga între celule</li>
                <li>• <strong>Click indiciu</strong> pentru a selecta cuvântul</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📊</span>
                <h3 className="font-semibold text-amber-900">Progres</h3>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  Literele <span className="text-red-600 font-bold">roșii</span> sunt incorecte.
                </div>
                <div>Completează toate celulele corect pentru a finaliza!</div>
              </div>
            </div>
          </div>

          {/* Across Clues */}
          <div>
            <h3 className="font-bold text-lg mb-3">ORIZONTAL</h3>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              {cluesAcross.map((clue) => (
                <button
                  key={`a${clue.number}`}
                  onClick={() => selectClue(clue)}
                  className={`w-full text-left p-3 border-b last:border-b-0 transition-colors ${
                    selectedClue?.number === clue.number &&
                    selectedClue.direction === 'across'
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-600">
                    {clue.number}.
                  </div>
                  <div className="text-sm text-gray-800">{clue.text}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Down Clues */}
          <div>
            <h3 className="font-bold text-lg mb-3">VERTICAL</h3>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              {cluesDown.map((clue) => (
                <button
                  key={`d${clue.number}`}
                  onClick={() => selectClue(clue)}
                  className={`w-full text-left p-3 border-b last:border-b-0 transition-colors ${
                    selectedClue?.number === clue.number &&
                    selectedClue.direction === 'down'
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-600">
                    {clue.number}.
                  </div>
                  <div className="text-sm text-gray-800">{clue.text}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Dialog */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center max-w-md">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Felicitări!</h2>
            <p className="text-gray-700 mb-6">Ai completat integrama cu succes!</p>
            <button
              onClick={() => setShowCompletion(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
