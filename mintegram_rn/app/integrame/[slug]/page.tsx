'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Lightbulb, Trophy, Timer, Heart, Gem, Crown } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useEconomyStore } from '@/stores/economyStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Cell, Clue, Puzzle } from '@/types';

export default function CrosswordPlay() {
  const params = useParams();
  const router = useRouter();
  const gameStore = useGameStore();
  const setPuzzle = useGameStore((s) => s.setPuzzle);
  const economy = useEconomyStore();
  const consumedRef = useRef(false);

  // Mock puzzle data - replace with API call
  useEffect(() => {
    const mockPuzzle: Puzzle = {
      id: 1,
      title: 'Orașele României',
      slug: 'orasele-romaniei',
      difficulty: 'Mediu',
      rows: 10,
      cols: 10,
      cells: generateMockCells(10, 10),
      clues: generateMockClues(),
    };

    setPuzzle(mockPuzzle);
  }, [params.slug, setPuzzle]);

  // Consume a heart when entering a puzzle (once per mount)
  const outOfHearts = !economy.isSubscriber && economy.hearts <= 0;

  useEffect(() => {
    if (gameStore.puzzle && !consumedRef.current && !outOfHearts) {
      consumedRef.current = true;
      economy.consumeHeart();
    }
  }, [gameStore.puzzle, outOfHearts, economy]);

  const handleCellClick = (cell: Cell) => {
    if (cell.is_block) return;
    gameStore.selectCell(cell);
    updateHighlight(cell);
  };

  const handleCellInput = (cell: Cell, value: string) => {
    const key = `${cell.row}-${cell.col}`;
    gameStore.setLetter(key, value);
    
    // Move to next cell
    if (value && gameStore.direction === 'across') {
      const nextCell = gameStore.puzzle?.cells.find(
        c => c.row === cell.row && c.col === cell.col + 1 && !c.is_block
      );
      if (nextCell) handleCellClick(nextCell);
    } else if (value && gameStore.direction === 'down') {
      const nextCell = gameStore.puzzle?.cells.find(
        c => c.row === cell.row + 1 && c.col === cell.col && !c.is_block
      );
      if (nextCell) handleCellClick(nextCell);
    }

    // Check if complete
    gameStore.checkComplete();
  };

  const handleKeyDown = (e: React.KeyboardEvent, cell: Cell) => {
    if (e.key === ' ') {
      e.preventDefault();
      gameStore.toggleDirection();
      updateHighlight(cell);
    } else if (e.key === 'Backspace') {
      const key = `${cell.row}-${cell.col}`;
      if (!gameStore.letters[key]) {
        // Move to previous cell
        if (gameStore.direction === 'across') {
          const prevCell = gameStore.puzzle?.cells.find(
            c => c.row === cell.row && c.col === cell.col - 1 && !c.is_block
          );
          if (prevCell) handleCellClick(prevCell);
        } else {
          const prevCell = gameStore.puzzle?.cells.find(
            c => c.row === cell.row - 1 && c.col === cell.col && !c.is_block
          );
          if (prevCell) handleCellClick(prevCell);
        }
      }
    }
  };

  const updateHighlight = (cell: Cell) => {
    if (!gameStore.puzzle) return;
    
    const highlighted: Cell[] = [];
    
    if (gameStore.direction === 'across') {
      gameStore.puzzle.cells.forEach(c => {
        if (c.row === cell.row && !c.is_block) {
          highlighted.push(c);
        }
      });
    } else {
      gameStore.puzzle.cells.forEach(c => {
        if (c.col === cell.col && !c.is_block) {
          highlighted.push(c);
        }
      });
    }
    
    gameStore.setHighlightedCells(highlighted);
  };

  const handleClueClick = (clue: Clue) => {
    gameStore.setSelectedClue(clue);
    const startCell = gameStore.puzzle?.cells.find(
      c => c.row === clue.start_row && c.col === clue.start_col
    );
    if (startCell) {
      handleCellClick(startCell);
    }
  };

  const isHighlighted = (cell: Cell) => {
    return gameStore.highlightedCells.some(
      c => c.row === cell.row && c.col === cell.col
    );
  };

  const isSelected = (cell: Cell) => {
    return gameStore.selectedCell?.row === cell.row &&
           gameStore.selectedCell?.col === cell.col;
  };

  const isCorrect = (cell: Cell) => {
    const key = `${cell.row}-${cell.col}`;
    return gameStore.letters[key]?.toUpperCase() === cell.answer?.toUpperCase();
  };

  if (!gameStore.puzzle) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-bold gradient-text">Încărcare...</div>
    </div>;
  }

  if (outOfHearts) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center">
                <Heart size={24} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Nu mai ai inimi</h2>
            <p className="text-gray-600 mt-2">Pentru a juca această integramă, ai nevoie de o inimă. Poți cumpăra inimi cu diamante sau poți activa abonamentul pentru joc nelimitat.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
              <Button variant="primary" onClick={() => router.push('/hearts')} icon={<Heart size={18} />}>Cumpără inimi</Button>
              <Button variant="accent" onClick={() => router.push('/wallet')} icon={<Gem size={18} />}>Vezi diamante</Button>
              <Button variant="outline" onClick={() => router.push('/subscriptions')} icon={<Crown size={18} />}>Abonamente</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const cluesAcross = gameStore.puzzle.clues.filter(c => c.direction === 'across');
  const cluesDown = gameStore.puzzle.clues.filter(c => c.direction === 'down');

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            icon={<ArrowLeft size={20} />}
            onClick={() => router.back()}
          >
            Înapoi
          </Button>

          <div className="flex items-center gap-4">
            <Badge variant="primary" size="lg">
              <Timer size={16} className="mr-1" />
              {Math.floor(gameStore.timer / 60)}:{(gameStore.timer % 60).toString().padStart(2, '0')}
            </Badge>
            
            {gameStore.isComplete && (
              <Badge variant="success" size="lg">
                <Trophy size={16} className="mr-1" />
                Completat!
              </Badge>
            )}
          </div>

          <Button
            variant="accent"
            icon={<RotateCcw size={20} />}
            onClick={() => gameStore.resetGame()}
          >
            Resetează
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crossword Grid */}
          <div className="lg:col-span-2">
            <Card>
              <h1 className="text-3xl font-bold mb-2">{gameStore.puzzle.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="warning">{gameStore.puzzle.difficulty}</Badge>
                <span className="text-gray-600">{gameStore.puzzle.rows}x{gameStore.puzzle.cols}</span>
              </div>

              <div
                className="grid gap-0.5 mx-auto bg-gray-300 p-0.5"
                style={{
                  gridTemplateColumns: `repeat(${gameStore.puzzle.cols}, minmax(0, 1fr))`,
                  maxWidth: '600px',
                }}
              >
                {gameStore.puzzle.cells.map((cell, idx) => {
                  const key = `${cell.row}-${cell.col}`;
                  
                  return (
                    <motion.div
                      key={idx}
                      className={`
                        relative aspect-square bg-white border-2 transition-all duration-200
                        ${cell.is_block ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}
                        ${isSelected(cell) ? 'border-purple-500 bg-purple-50 scale-105 z-10 shadow-lg' : ''}
                        ${isHighlighted(cell) && !isSelected(cell) ? 'bg-yellow-50 border-yellow-300' : ''}
                        ${!cell.is_block && gameStore.letters[key] && !isCorrect(cell) ? 'bg-red-50 border-red-400' : ''}
                        ${!cell.is_block && gameStore.letters[key] && isCorrect(cell) ? 'bg-green-50 border-green-400' : ''}
                        ${!cell.is_block ? 'cursor-pointer hover:bg-blue-50' : ''}
                      `}
                      onClick={() => handleCellClick(cell)}
                      whileHover={!cell.is_block ? { scale: 1.05 } : {}}
                    >
                      {!cell.is_block && (
                        <>
                          {cell.number && (
                            <span className="absolute top-0.5 left-1 text-[10px] font-bold text-gray-500">
                              {cell.number}
                            </span>
                          )}
                          <input
                            type="text"
                            maxLength={1}
                            value={gameStore.letters[key] || ''}
                            onChange={(e) => handleCellInput(cell, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, cell)}
                            className="w-full h-full text-center text-xl font-bold uppercase bg-transparent border-none outline-none"
                            style={{ caretColor: 'transparent' }}
                          />
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Clues Sidebar */}
          <div className="space-y-6">
            {gameStore.selectedClue && (
              <Card gradient className="sticky top-24">
                <div className="flex items-start gap-2">
                  <Lightbulb className="text-yellow-500 shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-bold text-purple-700">
                      {gameStore.selectedClue.number}. {gameStore.selectedClue.direction === 'across' ? 'Orizontal' : 'Vertical'}
                    </p>
                    <p className="text-gray-700 mt-1">{gameStore.selectedClue.text}</p>
                  </div>
                </div>
              </Card>
            )}

            <Card>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded"></span>
                Orizontal
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cluesAcross.map((clue) => (
                  <motion.div
                    key={`across-${clue.number}`}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      gameStore.selectedClue?.number === clue.number && gameStore.selectedClue?.direction === 'across'
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleClueClick(clue)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-bold text-purple-700">{clue.number}.</span>{' '}
                    <span className="text-gray-700">{clue.text}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-linear-to-b from-blue-500 to-cyan-500 rounded"></span>
                Vertical
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cluesDown.map((clue) => (
                  <motion.div
                    key={`down-${clue.number}`}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      gameStore.selectedClue?.number === clue.number && gameStore.selectedClue?.direction === 'down'
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleClueClick(clue)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-bold text-blue-700">{clue.number}.</span>{' '}
                    <span className="text-gray-700">{clue.text}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data generators
function generateMockCells(rows: number, cols: number): Cell[] {
  const cells: Cell[] = [];
  let numberCounter = 1;
  
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const isBlock = Math.random() > 0.75;
      cells.push({
        row: r,
        col: c,
        is_block: isBlock,
        number: !isBlock && Math.random() > 0.7 ? numberCounter++ : undefined,
        answer: !isBlock ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : undefined,
      });
    }
  }
  
  return cells;
}

function generateMockClues(): Clue[] {
  return [
    { number: 1, text: 'Capitala României', answer: 'BUCURESTI', direction: 'across', start_row: 1, start_col: 1, length: 9 },
    { number: 2, text: 'Oraș din Transilvania', answer: 'BRASOV', direction: 'across', start_row: 2, start_col: 1, length: 6 },
    { number: 3, text: 'Port la Marea Neagră', answer: 'CONSTANTA', direction: 'down', start_row: 1, start_col: 1, length: 9 },
    { number: 4, text: 'Oraș studentesc', answer: 'IASI', direction: 'down', start_row: 1, start_col: 5, length: 4 },
  ];
}
