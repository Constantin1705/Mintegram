'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Grid3x3, Lightbulb, Timer, Trophy, Zap, Heart, Flame, Moon, Sun } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useThemeStore } from '@/stores/themeStore';

export default function Home() {
  const { isDark, toggle } = useThemeStore();
  const [currentWord, setCurrentWord] = useState('Integrame');
  const [wordIndex, setWordIndex] = useState(0);
  const words = ['Integrame', 'Rebusuri', 'Puzzle-uri', 'Cuvinte Încrucișate'];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    setCurrentWord(words[wordIndex]);
  }, [wordIndex, words]);

  const puzzleData = [
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
    },
  ];

  return (
    <div className={isDark ? 'bg-slate-900' : 'bg-white'}>
      <section className="relative overflow-hidden bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 py-20 px-6">
        <div className="absolute inset-0 bg-dots opacity-20"></div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          {isDark ? <Sun className="text-yellow-300" size={24} /> : <Moon className="text-white" size={24} />}
        </button>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="text-yellow-300" size={20} />
              <span className="text-white font-semibold">Integrame & Rebusuri Românești</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Antrenează-ți mintea cu{' '}
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="inline-block bg-white text-transparent bg-clip-text"
              >
                {currentWord}
              </motion.span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Peste 100 de puzzle-uri selectate, niveluri variate și o experiență fluidă.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/integrame">
                <Button variant="primary" size="lg" icon={<Grid3x3 size={20} />}>
                  Începe o integrame
                </Button>
              </Link>
              <Link href="/rebusuri">
                <Button variant="secondary" size="lg" icon={<Lightbulb size={20} />}>
                  Rezolvă un rebus
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {[
                { icon: <Zap />, label: 'Rapid', color: 'from-yellow-400 to-orange-500' },
                { icon: <Heart />, label: 'Preferate', color: 'from-pink-400 to-red-500' },
                { icon: <Trophy />, label: 'Provocări', color: 'from-blue-400 to-cyan-500' },
                { icon: <Flame />, label: 'Populare', color: 'from-purple-400 to-pink-500' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  className={`bg-linear-to-r ${item.color} p-4 rounded-2xl text-white floating-animation`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {item.icon}
                    <span className="font-bold">{item.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className={`max-w-7xl mx-auto px-6 py-16 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className={`font-semibold mb-2 uppercase text-sm tracking-wide flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              <Grid3x3 size={20} />
              Integrame
            </p>
            <h2 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Teme populare</h2>
          </div>
          <Link href="/integrame">
            <Button variant="outline">
              Vezi toate →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {puzzleData.map((puzzle, index) => (
            <motion.div
              key={puzzle.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group">
                <div className="relative h-64 overflow-hidden rounded-t-2xl -m-6 mb-4">
                  <img
                    src={puzzle.cover}
                    alt={puzzle.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant={puzzle.color as 'success' | 'warning' | 'danger'} size="md">
                      {puzzle.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-white font-bold text-2xl">{puzzle.title}</h3>
                    <div className="flex items-center gap-6 text-white/90 text-base mt-2 font-semibold">
                      <span className="flex items-center gap-2">
                        <Grid3x3 size={16} />
                        {puzzle.size}
                      </span>
                      <span className="flex items-center gap-2">
                        <Timer size={16} />
                        {puzzle.estimate} min
                      </span>
                    </div>
                  </div>
                </div>

                <p className={`text-base mb-5 line-clamp-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {puzzle.desc}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {puzzle.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${isDark ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/integrame/${puzzle.slug}`}>
                    <Button variant="primary" size="sm" icon={<Sparkles size={16} />}>
                      Deschide →
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-linear-to-br from-blue-50 to-purple-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            De ce Mintegram?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Grid3x3 size={40} />,
                title: 'Peste 100 de puzzle-uri',
                desc: 'O colecție vastă de integrame și rebusuri pentru toate nivelurile.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: <Trophy size={40} />,
                title: 'Sistem de progres',
                desc: 'Câștigă XP, urcă în nivel și deblochează insigne speciale.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: <Zap size={40} />,
                title: 'Interfață rapidă',
                desc: 'Experiență fluidă și intuitivă, optimizată pentru desktop și mobile.',
                color: 'from-orange-500 to-red-500',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <div className={`w-20 h-20 mx-auto mb-4 bg-linear-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
