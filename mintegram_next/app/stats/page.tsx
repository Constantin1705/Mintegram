'use client';

import { motion } from 'framer-motion';
import { BarChart3, Timer, Target, Activity } from 'lucide-react';
import Card from '@/components/ui/Card';

const stats = [
  { label: 'Total puzzle-uri', value: '124', accent: 'from-blue-400 to-cyan-500' },
  { label: 'Timp mediu', value: '08:45', accent: 'from-purple-400 to-pink-500' },
  { label: 'Rată completare', value: '78%', accent: 'from-emerald-400 to-green-500' },
  { label: 'Streak', value: '12 zile', accent: 'from-amber-400 to-orange-500' },
];

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card">
            <BarChart3 className="text-purple-600" size={18} />
            <span className="font-semibold text-gray-700">Statistici</span>
          </div>
          <h1 className="text-4xl font-bold mt-4 gradient-text">Performanța ta</h1>
          <p className="text-gray-600 mt-2">Indicatori rapizi despre progres</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="text-center h-full">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${s.accent} text-white flex items-center justify-center text-lg font-bold`}>
                  {i === 0 ? '🧩' : i === 1 ? <Timer size={18} /> : i === 2 ? <Target size={18} /> : <Activity size={18} />}
                </div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Trend săptămânal (mock)</h2>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" initial={{ width: 0 }} animate={{ width: '76%' }} transition={{ duration: 0.9 }} />
          </div>
          <p className="text-sm text-gray-600 mt-2">76% din obiectivul săptămânii atins.</p>
        </Card>
      </div>
    </div>
  );
}
