'use client';

import { motion } from 'framer-motion';
import { Grid3x3, Clock, Star, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useThemeStore } from '@/stores/themeStore';

type DifficultyLevel = 'Ușor' | 'Mediu' | 'Greu';

const rebusuri: Array<{
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  rating: number;
  plays: number;
  image: string;
  category: string;
  badge?: string;
}> = [
  {
    id: 1,
    slug: 'rebus-clasic-usor',
    title: 'Rebus Clasic Ușor',
    description: 'Perfect pentru începători',
    difficulty: 'Ușor',
    estimatedTime: '10 min',
    rating: 4.5,
    plays: 2340,
    image: '/images/rebus1.jpg',
    category: 'Clasic',
  },
  {
    id: 2,
    slug: 'rebus-tematic-animale',
    title: 'Rebus Tematic - Animale',
    description: 'Descoperă lumea animalelor',
    difficulty: 'Mediu',
    estimatedTime: '15 min',
    rating: 4.7,
    plays: 1890,
    image: '/images/rebus2.jpg',
    category: 'Tematic',
  },
  {
    id: 3,
    slug: 'rebus-expertul',
    title: 'Rebus pentru Experți',
    description: 'Provocare pentru maeștri',
    difficulty: 'Greu',
    estimatedTime: '25 min',
    rating: 4.9,
    plays: 1234,
    image: '/images/rebus3.jpg',
    category: 'Expert',
  },
  {
    id: 4,
    slug: 'rebus-rapid-5min',
    title: 'Rebus Rapid 5 Min',
    description: 'Rezolvă în timp record',
    difficulty: 'Ușor',
    estimatedTime: '5 min',
    rating: 4.3,
    plays: 3120,
    image: '/images/rebus4.jpg',
    category: 'Rapid',
  },
  {
    id: 5,
    slug: 'rebus-cultura-generala',
    title: 'Rebus Cultură Generală',
    description: 'Testează-ți cunoștințele',
    difficulty: 'Mediu',
    estimatedTime: '18 min',
    rating: 4.6,
    plays: 1670,
    image: '/images/rebus5.jpg',
    category: 'Educativ',
  },
  {
    id: 6,
    slug: 'rebus-zilnic',
    title: 'Rebus Zilnic',
    description: 'Provocarea zilei de azi',
    difficulty: 'Mediu',
    estimatedTime: '12 min',
    rating: 4.8,
    plays: 4560,
    image: '/images/rebus6.jpg',
    category: 'Zilnic',
    badge: 'NOU',
  },
];

const difficultyColors: Record<DifficultyLevel, 'success' | 'warning' | 'danger'> = {
  Ușor: 'success',
  Mediu: 'warning',
  Greu: 'danger',
};

export default function RebusuriPage() {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-5xl md:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Rebusuri
            </h1>
            <p className={`text-xl mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Descoperă și rezolvă rebusuri captivante
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex flex-wrap gap-3 items-center">
              <Filter className="text-purple-600" size={20} />
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Filtrează:</span>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary" size="md">Toate</Badge>
                <Badge variant="secondary" size="md">Clasic</Badge>
                <Badge variant="info" size="md">Tematic</Badge>
                <Badge variant="success" size="md">Rapid</Badge>
                <Badge variant="warning" size="md">Expert</Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Rebusuri Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rebusuri.map((rebus, index) => (
            <motion.div
              key={rebus.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/integrame/${rebus.slug}`}>
                <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  {rebus.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="danger" size="sm">{rebus.badge}</Badge>
                    </div>
                  )}
                  
                  {/* Image Placeholder */}
                  <div className="relative h-48 bg-linear-to-r from-purple-400 to-pink-500 rounded-2xl mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Grid3x3 className="text-white opacity-30" size={80} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} group-hover:text-purple-600 transition-colors`}>
                        {rebus.title}
                      </h3>
                      <Badge variant={difficultyColors[rebus.difficulty]} size="sm">
                        {rebus.difficulty}
                      </Badge>
                    </div>

                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {rebus.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={16} className="text-gray-500" />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{rebus.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-amber-500" fill="currentColor" />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{rebus.rating}</span>
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {rebus.plays.toLocaleString()} jucători
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                      <Badge variant="secondary" size="sm">{rebus.category}</Badge>
                      <div className="flex items-center gap-1 text-purple-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        Joacă
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
            Încarcă mai multe rebusuri
          </button>
        </motion.div>
      </div>
    </div>
  );
}
