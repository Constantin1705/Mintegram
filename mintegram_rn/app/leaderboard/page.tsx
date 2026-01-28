'use client';

import { motion } from 'framer-motion';
import { Crown, Medal, Zap, Trophy, Moon, Sun } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useThemeStore } from '@/stores/themeStore';

const leaders = [
  { name: 'Alex', xp: 3450, rank: 1, country: '🇷🇴' },
  { name: 'Mara', xp: 2980, rank: 2, country: '🇷🇴' },
  { name: 'Dani', xp: 2760, rank: 3, country: '🇷🇴' },
  { name: 'Ioana', xp: 2400, rank: 4, country: '🇷🇴' },
  { name: 'Vlad', xp: 2200, rank: 5, country: '🇷🇴' },
];

export default function LeaderboardPage() {
  const { isDark, toggle } = useThemeStore();
  return (
      <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-slate-900' : 'bg-linear-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggle}
        className="fixed top-20 right-6 z-20 p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
      >
        {isDark ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-gray-800" size={24} />}
      </button>

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-card'}`}>
            <Trophy className="text-yellow-500" size={20} />
            <span className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Clasament</span>
          </div>
          <h1 className={`text-5xl font-bold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Jucători</h1>
          <p className={`text-lg mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cei mai buni integramă-i din comunitate</p>
        </div>

        <Card>
          <div className="space-y-4">
            {leaders.map((p, i) => (
              <motion.div
                key={p.name}
                className={`p-5 rounded-xl flex items-center justify-between text-lg ${isDark ? 'bg-slate-800 border border-slate-700 hover:border-slate-600' : 'bg-white/80 hover:bg-white'} transition`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                    p.rank === 1 ? 'bg-yellow-500' : p.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {p.rank === 1 ? <Crown size={24} /> : p.rank === 2 ? <Medal size={24} /> : p.rank}
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{p.country} • Rang #{p.rank}</p>
                  </div>
                </div>
                <Badge variant="primary" size="lg" className="font-bold text-base">{p.xp.toLocaleString()} XP</Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-yellow-500" size={20} />
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cum câștigi XP?</h2>
          </div>
          <ul className={`text-base list-disc list-inside space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>Finalizează integrame și rebusuri.</li>
            <li>Păstrează streak-ul zilnic.</li>
            <li>Participă la provocări și evenimente.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
