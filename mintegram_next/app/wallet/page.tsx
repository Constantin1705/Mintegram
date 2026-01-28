'use client';
import { Gem, Gift, Coins, ShoppingCart } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
// no Badge used here
import { useEconomyStore } from '@/stores/economyStore';

export default function WalletPage() {
  const { diamonds, addDiamonds } = useEconomyStore();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card">
            <Gem className="text-purple-600" size={18} />
            <span className="font-semibold text-gray-700">Diamante</span>
          </div>
          <h1 className="text-4xl font-bold mt-4 gradient-text">Portofel</h1>
          <p className="text-gray-600 mt-2">Gestionare și achiziții mock</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center mb-3">
              <Gem size={20} />
            </div>
            <p className="text-sm text-gray-500">Diamante disponibile</p>
            <p className="text-3xl font-bold text-gray-900">{diamonds}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 text-white flex items-center justify-center mb-3">
              <Coins size={20} />
            </div>
            <p className="text-sm text-gray-500">Pachet mic</p>
            <p className="text-xl font-bold text-gray-900">+20</p>
            <Button variant="primary" size="sm" className="mt-3" onClick={() => addDiamonds(20)} icon={<ShoppingCart size={16} />}>Cumpără mock</Button>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-linear-to-r from-emerald-400 to-green-500 text-white flex items-center justify-center mb-3">
              <Gift size={20} />
            </div>
            <p className="text-sm text-gray-500">Pachet mare</p>
            <p className="text-xl font-bold text-gray-900">+100</p>
            <Button variant="accent" size="sm" className="mt-3" onClick={() => addDiamonds(100)} icon={<ShoppingCart size={16} />}>Cumpără mock</Button>
          </Card>
        </div>

        <Card>
          <p className="text-sm text-gray-700">Integrarea reală a plăților și a stocării balansului se va realiza prin backend/payments. Momentan, aceste acțiuni sunt mock pentru testare UX.</p>
        </Card>
      </div>
    </div>
  );
}
