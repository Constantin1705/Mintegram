'use client';

import { motion } from 'framer-motion';
import { Grid3x3 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const categories = [
  { name: 'Geografie', count: 14, color: 'from-blue-400 to-cyan-500' },
  { name: 'Literatură', count: 10, color: 'from-purple-400 to-pink-500' },
  { name: 'Sport', count: 8, color: 'from-amber-400 to-orange-500' },
  { name: 'Muzică', count: 6, color: 'from-emerald-400 to-green-500' },
];

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card">
            <Grid3x3 className="text-purple-600" size={18} />
            <span className="font-semibold text-gray-700">Categorii</span>
          </div>
          <h1 className="text-4xl font-bold mt-4 gradient-text">Alege tema</h1>
          <p className="text-gray-600 mt-2">Liste mock de categorii populare</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${cat.color} text-white flex items-center justify-center font-bold`}>
                    {cat.name[0]}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{cat.name}</p>
                    <p className="text-sm text-gray-600">{cat.count} puzzle-uri</p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">Intră</Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
