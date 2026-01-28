'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, Grid3x3, Timer, Trophy } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function IntegrameList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const puzzles = [
    {
      id: 1,
      title: 'Orașele României',
      slug: 'orasele-romaniei',
      difficulty: 'Ușor',
      color: 'success',
      size: '10x10',
      estimate: 8,
      desc: 'Descoperă orașele importante din România prin acest puzzle captivant.',
      tags: ['Geografie', 'România'],
      cover: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=500',
      completions: 234,
    },
    {
      id: 2,
      title: 'Scriitori celebri',
      slug: 'scriitori-celebri',
      difficulty: 'Mediu',
      color: 'warning',
      size: '12x12',
      estimate: 12,
      desc: 'Testează-ți cunoștințele despre marii scriitori români și internaționali.',
      tags: ['Literatură', 'Cultură'],
      cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500',
      completions: 156,
    },
    {
      id: 3,
      title: 'Animale sălbatice',
      slug: 'animale-salbatice',
      difficulty: 'Dificil',
      color: 'danger',
      size: '15x15',
      estimate: 18,
      desc: 'Explorează lumea fascinantă a animalelor sălbatice din întreaga lume.',
      tags: ['Natură', 'Animale'],
      cover: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=500',
      completions: 89,
    },
    {
      id: 4,
      title: 'Sportul mondial',
      slug: 'sportul-mondial',
      difficulty: 'Mediu',
      color: 'warning',
      size: '12x12',
      estimate: 10,
      desc: 'De la fotbal la tenis, testează-ți cunoștințele despre sporturile mondiale.',
      tags: ['Sport', 'General'],
      cover: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
      completions: 178,
    },
    {
      id: 5,
      title: 'Muzică clasică',
      slug: 'muzica-clasica',
      difficulty: 'Dificil',
      color: 'danger',
      size: '14x14',
      estimate: 15,
      desc: 'Compozitori, opere și instrumente din lumea muzicii clasice.',
      tags: ['Muzică', 'Cultură'],
      cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500',
      completions: 67,
    },
    {
      id: 6,
      title: 'Filmul românesc',
      slug: 'filmul-romanesc',
      difficulty: 'Ușor',
      color: 'success',
      size: '10x10',
      estimate: 7,
      desc: 'Actori, regizori și filme celebre din cinematografia românească.',
      tags: ['Film', 'România'],
      cover: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
      completions: 201,
    },
  ];

  const filteredPuzzles = puzzles.filter(puzzle => {
    const matchesSearch = puzzle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         puzzle.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || puzzle.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Integrame</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descoperă colecția noastră de integrame captivante pentru toate nivelurile
          </p>
        </motion.div>

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
            <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
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
            <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Trophy className="text-white" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {puzzles.reduce((acc, p) => acc + p.completions, 0)}
              </p>
              <p className="text-gray-600">Finalizări totale</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Timer className="text-white" size={32} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {Math.floor(puzzles.reduce((acc, p) => acc + p.estimate, 0) / puzzles.length)}
              </p>
              <p className="text-gray-600">Minute medie/puzzle</p>
            </Card>
          </motion.div>
        </div>

        {/* Puzzles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPuzzles.map((puzzle, index) => (
            <motion.div
              key={puzzle.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/integrame/${puzzle.slug}`}>
                <Card className="overflow-hidden group cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden rounded-t-2xl -m-6 mb-4">
                    <img
                      src={puzzle.cover}
                      alt={puzzle.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant={puzzle.color as 'success' | 'warning' | 'danger'} size="md">
                        {puzzle.difficulty}
                      </Badge>
                      <Badge variant="primary" size="md">
                        {puzzle.completions} finalizări
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-4 text-white text-sm">
                        <span className="flex items-center gap-1">
                          <Grid3x3 size={16} />
                          {puzzle.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer size={16} />
                          {puzzle.estimate} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                    {puzzle.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {puzzle.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {puzzle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPuzzles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-400">Nu am găsit integrame care să se potrivească criteriilor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
