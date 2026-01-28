'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, Grid3x3, Timer, Trophy, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/axios';

interface Puzzle {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  rows: number;
  cols: number;
  description?: string;
  categories?: Array<{ name: string }>;
}

const getDifficultyColor = (difficulty: string | undefined) => {
  if (!difficulty) return 'primary';
  const lower = difficulty.toLowerCase();
  if (lower.includes('ușor') || lower.includes('easy')) return 'success';
  if (lower.includes('mediu') || lower.includes('medium')) return 'warning';
  if (lower.includes('dificil') || lower.includes('hard')) return 'danger';
  return 'primary';
};

export default function IntegrameList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/puzzles/');
        setPuzzles(Array.isArray(data) ? data : data.results || []);
        setError(null);
      } catch (err) {
        setError('Eroare la încărcarea integramelor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzles();
  }, []);

  const filteredPuzzles = puzzles.filter(puzzle => {
    const matchesSearch = puzzle.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || puzzle.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Integrame</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descoperă colecția noastră de integrame captivante pentru toate nivelurile
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin">
              <Grid3x3 className="mx-auto text-purple-600" size={48} />
            </div>
            <p className="text-gray-600 mt-4">Se încarcă integramele...</p>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-2 border-red-200 text-center py-8">
            <p className="text-red-600 font-semibold">{error}</p>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <Card className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:w-96">
                  <Input
                    placeholder="Caută integrame..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search size={20} />}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {['all', 'Ușor', 'Mediu', 'Dificil'].map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      {difficulty === 'all' ? 'Toate' : difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center bg-linear-to-br from-purple-50 to-pink-50">
              <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Grid3x3 className="text-white" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{puzzles.length}</p>
              <p className="text-gray-600">Integrame disponibile</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center bg-linear-to-br from-blue-50 to-cyan-50">
              <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Trophy className="text-white" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{puzzles.length}</p>
              <p className="text-gray-600">Rezolvări posibile</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center bg-linear-to-br from-orange-50 to-red-50">
              <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Timer className="text-white" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{puzzles.reduce((acc, p) => acc + p.rows, 0)}</p>
              <p className="text-gray-600">Celule totale</p>
            </Card>
          </motion.div>
        </div>

        {/* Puzzles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPuzzles.length > 0 ? (
            filteredPuzzles.map((puzzle, index) => (
              <motion.div
                key={puzzle.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/integrame/${puzzle.id}`}>
                  <Card className="overflow-hidden group cursor-pointer h-full flex flex-col">
                    <div className="relative h-32 overflow-hidden rounded-t-2xl -m-6 mb-4 bg-linear-to-r from-purple-500 to-pink-500">
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid3x3 className="text-white/50" size={64} />
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {puzzle.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {puzzle.rows}x{puzzle.cols}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-3 flex-wrap">
                        <Badge
                          variant={getDifficultyColor(puzzle.difficulty) as 'success' | 'warning' | 'danger' | 'primary'}
                          size="sm"
                        >
                          {puzzle.difficulty}
                        </Badge>
                        {puzzle.categories?.map((cat) => (
                          <Badge key={cat.name} variant="info" size="sm">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 grow mb-4">
                        {puzzle.description || 'Descoperă această integramă interesantă'}
                      </p>

                      <div className="pt-4 border-t border-gray-100">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          icon={<ChevronRight size={16} />}
                        >
                          Joacă acum
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">Nu au fost găsite integrame</p>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
