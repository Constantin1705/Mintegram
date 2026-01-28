'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Award, Crown, Gem, Heart, Settings, Star, Trophy, Zap, Target, Flame, Moon, Sun, Lock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { useEconomyStore } from '@/stores/economyStore';
import { User } from '@/types';

type BadgeVariant = 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'info';

interface UserBadge {
  id: number;
  name: string;
  description: string;
  icon: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isDark, toggle } = useThemeStore();
  const { user, isLoading } = useAuthStore();
  const { diamonds, hearts } = useEconomyStore();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [totalSolved, setTotalSolved] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch user badges and stats
    if (user.badges) {
      setBadges(user.badges);
    }
  }, [user, router]);

  if (isLoading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-linear-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
        <div className="animate-spin">
          <Gem className="text-purple-500" size={48} />
        </div>
      </div>
    );
  }

  const getInitial = (username: string) => username.charAt(0).toUpperCase();
  const badgeVariants: BadgeVariant[] = ['primary', 'secondary', 'warning', 'success', 'danger', 'info'];

  return (
    <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-slate-900' : 'bg-linear-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
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
              <div className="w-24 h-24 rounded-3xl bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {getInitial(user.username)}
              </div>
              <div>
                <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Nivel {user.level} · {user.xp} XP</p>
                <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.username}</h1>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {badges.slice(0, 3).map((b, idx) => (
                    <Badge key={b.id} variant={badgeVariants[idx % badgeVariants.length]} size="md">{b.name}</Badge>
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
          {[
            { label: 'Integrame rezolvate', value: totalSolved.toString(), icon: '✓' },
            { label: 'Diamante', value: diamonds.toString(), icon: '💎' },
            { label: 'Inimi', value: hearts.toString(), icon: '❤️' }
          ].map((stat) => (
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
            <motion.div 
              className="h-full bg-linear-to-r from-purple-500 to-pink-500" 
              initial={{ width: 0 }} 
              animate={{ width: `${Math.min((user.xp / (user.level * 100)) * 100, 100)}%` }} 
              transition={{ duration: 0.8 }} 
            />
          </div>
          <p className={`text-base font-semibold mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Progres: {Math.round((user.xp / (user.level * 100)) * 100)}% din nivelul {user.level + 1}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-amber-500" size={24} />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Insigne Câștigate ({badges.length})</h2>
          </div>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((b, idx) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-3 rounded-2xl border-2 text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} hover:border-purple-400 transition-all`}
                  title={b.description}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg`}>
                    <Star size={20} />
                  </div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{b.name}</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} title={b.description}>
                    {b.description.substring(0, 30)}...
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-lg font-semibold">Nu ai nici o insignă încă</p>
              <p className="text-sm">Completează integrame pentru a câștiga insigne!</p>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Gem className="text-purple-600" size={24} />
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Statistici Utilizator</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Monede (Coins)</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.coins} 🪙</p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ID Utilizator</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>#{user.id}</p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>XP Total</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.xp}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
