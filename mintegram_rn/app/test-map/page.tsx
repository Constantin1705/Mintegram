'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2,
  Lock,
  Map,
  Sparkles,
  Trophy,
  Star,
  Flame,
  Compass,
  Crown,
  Wand2,
  Rocket,
  Swords,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type LevelStatus = 'done' | 'current' | 'locked';

type Level = {
  id: number;
  title: string;
  status: LevelStatus;
  rewards: string;
  color: string;
  progress?: number;
  bonus?: string;
};

const levels: Level[] = [
  { id: 1, title: 'Tutorial', status: 'done', rewards: '+50 XP', color: 'from-green-400 to-emerald-500', progress: 100 },
  { id: 2, title: 'Nivel 1', status: 'done', rewards: '+80 XP', color: 'from-blue-400 to-cyan-500', progress: 100, bonus: 'Cheie de bronz' },
  { id: 3, title: 'Nivel 2', status: 'current', rewards: '+120 XP', color: 'from-purple-400 to-pink-500', progress: 65, bonus: 'Boost de timp' },
  { id: 4, title: 'Nivel 3', status: 'locked', rewards: '+150 XP', color: 'from-amber-400 to-orange-500', progress: 0, bonus: 'Cufăr misterios' },
  { id: 5, title: 'Nivel 4', status: 'locked', rewards: '+200 XP', color: 'from-red-400 to-rose-500', progress: 0 },
];

const floaters = [
  { icon: <Rocket size={18} />, color: 'from-blue-400 to-cyan-400', delay: 0 },
  { icon: <Crown size={18} />, color: 'from-yellow-400 to-orange-400', delay: 0.4 },
  { icon: <Wand2 size={18} />, color: 'from-purple-400 to-pink-400', delay: 0.8 },
  { icon: <Swords size={18} />, color: 'from-red-400 to-rose-400', delay: 1.2 },
];

export default function TestMapPage() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      {/* floating orbs */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute w-72 h-72 rounded-full bg-purple-300 blur-3xl -top-10 -left-10" />
        <div className="absolute w-64 h-64 rounded-full bg-pink-300 blur-3xl top-20 right-0" />
        <div className="absolute w-80 h-80 rounded-full bg-blue-200 blur-3xl bottom-0 left-1/3" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          >
            <Map className="text-purple-600" size={18} />
            <span className="font-semibold text-gray-700">Harta de Test</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 gradient-text">Progres pe niveluri</h1>
          <p className="text-gray-600 mt-2">Harta animată cu progres, bonusuri și butoane de acțiune.</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {floaters.map((f, i) => (
              <motion.div
                key={i}
                className={`px-3 py-2 rounded-full bg-gradient-to-r ${f.color} text-white shadow-playful flex items-center gap-2`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: f.delay, type: 'spring', stiffness: 180, damping: 14 }}
              >
                {f.icon}
                <span className="text-sm font-semibold">Boost</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Niveluri terminate', value: '2 / 5', accent: 'from-green-400 to-emerald-500' },
            { label: 'XP estimat', value: '600+', accent: 'from-blue-400 to-cyan-500' },
            { label: 'Bonusuri active', value: '2', accent: 'from-purple-400 to-pink-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.2 }}
            >
              <Card className="text-center h-full">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${stat.accent} flex items-center justify-center text-white font-bold text-xl`}>
                  {i === 0 ? '✓' : i === 1 ? 'XP' : '★'}
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 via-pink-200 to-orange-200 -translate-x-1/2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          <div className="space-y-8 relative z-10">
            {levels.map((level, idx) => {
              const isLocked = level.status === 'locked';
              const isDone = level.status === 'done';
              const isCurrent = level.status === 'current';

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.08 + 0.1, type: 'spring', stiffness: 160, damping: 18 }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center"
                >
                  <Card className={`border-2 transition-all duration-300 ${isCurrent ? 'border-purple-400 shadow-playful-lg' : 'border-transparent'}`}>
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${level.color} text-white flex items-center justify-center text-xl font-bold shadow-playful`}
                        animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.6 }}
                      >
                        {level.id}
                      </motion.div>

                      <div className="flex-1 space-y-1">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {isCurrent ? 'În progres' : isDone ? 'Finalizat' : 'Blocat'}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          {level.title}
                          {level.bonus && (
                            <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">{level.bonus}</span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm">Recompense: {level.rewards}</p>

                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${level.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${level.progress ?? 0}%` }}
                            transition={{ duration: 0.8, delay: 0.1 * idx }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">Progres {level.progress ?? 0}%</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {isDone && <CheckCircle2 className="text-green-500" size={24} />}
                        {isCurrent && <Flame className="text-orange-500 animate-pulse" size={24} />}
                        {isLocked && <Lock className="text-gray-400" size={24} />}
                        <span className="text-xs text-gray-500">#{level.id}</span>
                      </div>
                    </div>
                  </Card>

                  <div className="flex md:flex-col items-center md:items-end gap-2">
                    {isDone && (
                      <Button variant="accent" size="sm" icon={<Trophy size={16} />}>
                        Rejoacă
                      </Button>
                    )}
                    {isCurrent && (
                      <Link href={`/integrame/${level.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Button variant="primary" size="sm" icon={<Sparkles size={16} />}>
                          Continuă
                        </Button>
                      </Link>
                    )}
                    {isLocked && (
                      <Button variant="ghost" size="sm" disabled icon={<Lock size={16} />}>
                        Blocat
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card gradient>
            <div className="flex items-center gap-3 mb-3">
              <Compass className="text-purple-600" size={22} />
              <h3 className="text-lg font-bold text-gray-900">Legendă & Bonusuri</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400" /> Finalizat</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-400" /> În progres</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-300" /> Blocat</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400" /> Bonus activ</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">Boost timp</span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Cufăr misterios</span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Cheie</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Star className="text-yellow-500" size={22} />
              <h3 className="text-lg font-bold text-gray-900">Acțiuni rapide</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" icon={<Sparkles size={16} />}>Generează hartă nouă</Button>
              <Button variant="outline" size="sm" icon={<Crown size={16} />}>Activează mod Hard</Button>
              <Button variant="ghost" size="sm" icon={<Wand2 size={16} />}>Shuffle noduri</Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">Acțiunile sunt mock și pot fi legate la backend ulterior.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
