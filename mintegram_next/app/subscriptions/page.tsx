'use client';

import { motion } from 'framer-motion';
import { Crown, ShieldCheck, Rocket } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const plans = [
  { name: 'Free', price: '€0', perks: ['Acces puzzle-uri de bază', 'Reclame ocazionale'], color: 'from-gray-300 to-gray-200' },
  { name: 'Pro', price: '€4.99/lună', perks: ['Fără reclame', 'Hint-uri extra', 'XP boost +20%'], color: 'from-purple-400 to-pink-500', featured: true },
  { name: 'Ultra', price: '€8.99/lună', perks: ['Tot din Pro', 'Statistici avansate', 'Evenimente speciale'], color: 'from-amber-400 to-orange-500' },
];

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card">
            <Crown className="text-amber-500" size={18} />
            <span className="font-semibold text-gray-700">Abonamente</span>
          </div>
          <h1 className="text-4xl font-bold mt-4 gradient-text">Alege planul tău</h1>
          <p className="text-gray-600 mt-2">De la free la ultra, pentru orice ritm de joacă</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className={`relative h-full ${plan.featured ? 'shadow-playful-lg border border-purple-200' : ''}`}>
                {plan.featured && (
                  <Badge variant="secondary" size="sm" className="absolute -top-3 right-4">Recomandat</Badge>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${plan.color} text-white flex items-center justify-center text-lg font-bold mb-3`}>
                  {plan.name === 'Ultra' ? 'U' : plan.name === 'Pro' ? 'P' : 'F'}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{plan.price}</p>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <ShieldCheck className="text-green-500" size={16} /> {perk}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.featured ? 'primary' : 'outline'} size="sm" className="mt-4" icon={<Rocket size={16} />}>
                  Activează
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
