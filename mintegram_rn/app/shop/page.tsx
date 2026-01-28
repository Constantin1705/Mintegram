'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Diamond, ShieldCheck, Heart, Sparkles, Zap, Crown, Wand2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface Product {
  id: number;
  name: string;
  price: number;
  priceDisplay: string;
  reward: string;
  icon: React.ReactNode;
  tag: string;
  currency: 'coins' | 'diamonds';
}

const items: Product[] = [
  { id: 1, name: 'Pachet Diamante', price: 4.99, priceDisplay: '€4.99', reward: '+200 diamante', icon: <Diamond size={18} />, tag: 'Popular', currency: 'diamonds' },
  { id: 2, name: 'Reîncărcare Inimi', price: 1.99, priceDisplay: '€1.99', reward: '+5 inimi', icon: <Heart size={18} />, tag: 'Rapid', currency: 'coins' },
  { id: 3, name: 'Boost Protecție', price: 3.49, priceDisplay: '€3.49', reward: 'Scade penalizările 24h', icon: <ShieldCheck size={18} />, tag: 'Strategic', currency: 'diamonds' },
  { id: 4, name: 'Indiciu Premium', price: 0.99, priceDisplay: '€0.99', reward: '+3 Indicii', icon: <Zap size={18} />, tag: 'Util', currency: 'coins' },
  { id: 5, name: 'Temă VIP', price: 2.99, priceDisplay: '€2.99', reward: 'Temă exclusivă', icon: <Crown size={18} />, tag: 'Exclusiv', currency: 'diamonds' },
  { id: 6, name: 'Pachet Magie', price: 5.99, priceDisplay: '€5.99', reward: 'Toate beneficiile', icon: <Wand2 size={18} />, tag: 'Super Deal', currency: 'diamonds' },
];

export default function ShopPage() {
  const [coins, setCoins] = useState(1500);
  const [diamonds, setDiamonds] = useState(50);
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handlePurchase = async (product: Product) => {
    setPurchasing(product.id);
    
    // Simulare cumpărare
    setTimeout(() => {
      if (product.currency === 'coins') {
        setCoins(c => c + 100);
      } else {
        setDiamonds(d => d + 50);
      }
      
      setNotification(`✓ ${product.name} cumpărat cu succes!`);
      setPurchasing(null);
      
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card">
            <ShoppingBag className="text-purple-600" size={18} />
            <span className="font-semibold text-gray-700">Shop</span>
          </div>
          <h1 className="text-4xl font-bold mt-4 gradient-text">Boost-uri & Recompense</h1>
          <p className="text-gray-600 mt-2">Pachete rapide pentru progres accelerat - MODE TEST</p>
        </div>

        {/* Portofel */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Card className="flex flex-col items-center gap-2 p-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white">
              💰
            </div>
            <p className="text-sm text-gray-600">Monede</p>
            <p className="text-2xl font-bold text-gray-900">{coins}</p>
          </Card>
          <Card className="flex flex-col items-center gap-2 p-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center text-white">
              💎
            </div>
            <p className="text-sm text-gray-600">Diamante</p>
            <p className="text-2xl font-bold text-gray-900">{diamonds}</p>
          </Card>
        </div>

        {/* Notificare */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold z-50"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Produse */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Card className="h-full flex flex-col gap-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.reward}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">{item.tag}</Badge>
                  <span className="text-gray-900 font-bold">{item.priceDisplay}</span>
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={purchasing === item.id}
                  className={`mt-auto px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                    purchasing === item.id
                      ? 'bg-gray-400 text-white cursor-wait'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {purchasing === item.id ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Se procesează...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Cumpără acum
                    </>
                  )}
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
