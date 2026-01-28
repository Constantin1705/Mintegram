'use client';

import { motion } from 'framer-motion';
import { Award, Crown, Gem, Heart, Settings, Star, Trophy, Zap, Target, Flame, Moon, Sun, Lock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useThemeStore } from '@/stores/themeStore';

type BadgeVariant = 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'info';

const allBadges = [
  { id: 1, label: 'Explorator', desc: 'A completat 10 integrame', icon: <Star size={24} />, color: 'primary' as BadgeVariant, rarity: 'common', unlocked: true },
  { id: 2, label: 'Speed Solver', desc: 'Rezolvare în sub 5 minute', icon: <Zap size={24} />, color: 'info' as BadgeVariant, rarity: 'rare', unlocked: true },
  { id: 3, label: 'Daily Streak', desc: 'Joc 7 zile consecutiv', icon: <Flame size={24} />, color: 'secondary' as BadgeVariant, rarity: 'epic', unlocked: true },
  { id: 4, label: 'Campion', desc: 'Top 10 în clasament', icon: <Trophy size={24} />, color: 'warning' as BadgeVariant, rarity: 'legendary', unlocked: true },
  { id: 5, label: 'Perfecționist', desc: 'Finalizat fără hint-uri', icon: <Target size={24} />, color: 'success' as BadgeVariant, rarity: 'epic', unlocked: false },
  { id: 6, label: 'Maestru', desc: 'Rezolvat 100 de integrame', icon: <Crown size={24} />, color: 'warning' as BadgeVariant, rarity: 'legendary', unlocked: false },
];

export default function ProfilePage() {
  const { isDark, toggle } = useThemeStore();
  const earnedBadges = allBadges.filter(b => b.unlocked);
  const lockedBadges = allBadges.filter(b => !b.unlocked);

  return (
    <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggle}
        className="fixed top-20 right-6 z-20 p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
      >
        {isDark ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-gray-800" size={24} />}
      </button>

      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">A</div>
              <div>
                <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Nivel 7 · 3,450 XP</p>
                <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>alexandru.dev</h1>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {earnedBadges.slice(0, 3).map((b) => (
                    <Badge key={b.label} variant={b.color} size="md">{b.label}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={<Settings size={18} />}>Setări</Button>
              <Button variant="primary" size="sm" icon={<Crown size={18} />}>Upgrade</Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{label:'Integrame rezolvate',value:'42',icon:'✓'},{label:'Diamante',value:'128',icon:'💎'},{label:'Inimi',value:'8',icon:'❤️'}].map((stat)=>(
            <Card key={stat.label} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-r from-purple-400 to-pink-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                {stat.icon}
              </div>
              <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
              <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Gem className="text-purple-600" size={24} />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Progres & Streak</h2>
          </div>
          <div className="h-3 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div className="h-full bg-linear-to-r from-purple-500 to-pink-500" initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 0.8 }} />
          </div>
          <p className={`text-base font-semibold mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Streak: 12 zile · 72% din obiectivul săptămânii</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-amber-500" size={24} />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Insigne Câștigate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnedBadges.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: b.id * 0.1 }}
                className={`p-4 rounded-2xl border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} hover:border-purple-400 transition-all`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${b.rarity === 'legendary' ? 'from-amber-400 to-orange-500' : b.rarity === 'epic' ? 'from-purple-500 to-pink-500' : b.rarity === 'rare' ? 'from-blue-500 to-cyan-500' : 'from-gray-400 to-gray-500'} flex items-center justify-center text-white shadow-lg`}>
                    {b.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{b.label}</h3>
                      <Badge variant={b.color} size="sm">{b.rarity}</Badge>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{b.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-gray-500" size={24} />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Insigne Blocate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedBadges.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: b.id * 0.1 }}
                className={`p-4 rounded-2xl border-2 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'} opacity-60`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-400 flex items-center justify-center text-white shadow-lg">
                    <Lock size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{b.label}</h3>
                      <Badge variant="secondary" size="sm">{b.rarity}</Badge>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{b.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
