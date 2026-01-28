'use client';

import { motion } from 'framer-motion';
import { Target, Flame, Gift, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const challenges = [
  { title: 'Rezolvă 3 puzzle-uri', reward: '+120 XP', time: 'Azi', tag: 'Daily' },
  { title: 'Finalizează un rebus dificil', reward: '+80 XP', time: '24h', tag: 'Hard' },
  { title: 'Streak 5 zile', reward: '+150 XP', time: '5 zile', tag: 'Streak' },
];

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card">
            <Target className="text-purple-600" size={18} />
            <span className="font-semibold text-gray-700">Provocări</span>
          </div>
          <h1 className="text-4xl font-bold mt-4 gradient-text">Completează și câștigă</h1>
          <p className="text-gray-600 mt-2">Provocări zilnice și săptămânale mock</p>
        </div>

        <div className="space-y-4">
          {challenges.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                    {i === 0 ? <Flame size={20} /> : i === 1 ? <Gift size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{c.title}</p>
                    <p className="text-sm text-gray-600">{c.reward} · Timp: {c.time}</p>
                    <Badge variant="secondary" size="sm">{c.tag}</Badge>
                  </div>
                </div>
                <Button variant="primary" size="sm">Începe</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
