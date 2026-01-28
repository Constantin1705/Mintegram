'use client';
import { Heart, Gem, Crown, Info } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useEconomyStore } from '@/stores/economyStore';
import { useRouter } from 'next/navigation';

export default function HeartsPage() {
  const { hearts, diamonds, purchaseHeartsWithDiamonds, isSubscriber, setSubscriber } = useEconomyStore();
  const router = useRouter();

  const buyHearts = (count: number, costPerHeart: number) => {
    const ok = purchaseHeartsWithDiamonds(count, costPerHeart);
    if (!ok) {
      alert('Diamante insuficiente!');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card">
            <Heart className="text-rose-600" size={18} />
            <span className="font-semibold text-gray-700">Inimi</span>
          </div>
          <h1 className="text-4xl font-bold mt-4 gradient-text">Continuă să joci</h1>
          <p className="text-gray-600 mt-2">Cumpără inimi cu diamante sau activează un abonament</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center mb-3">
              <Heart size={20} />
            </div>
            <p className="text-sm text-gray-500">Inimi disponibile</p>
            <p className="text-3xl font-bold text-gray-900">{hearts}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center mb-3">
              <Gem size={20} />
            </div>
            <p className="text-sm text-gray-500">Diamante</p>
            <p className="text-3xl font-bold text-gray-900">{diamonds}</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 text-white flex items-center justify-center mb-3">
              <Crown size={20} />
            </div>
            <p className="text-sm text-gray-500">Abonament</p>
            <p className="text-3xl font-bold text-gray-900">{isSubscriber ? 'Activ' : 'Inactiv'}</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pachete de inimi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <Badge variant="secondary" size="sm" className="mb-2">Mic</Badge>
              <p className="text-4xl font-bold text-gray-900">+1</p>
              <p className="text-sm text-gray-600 mt-1">Cost: 10 diamante</p>
              <Button variant="primary" size="sm" className="mt-3" onClick={() => buyHearts(1, 10)} icon={<Heart size={16} />}>Cumpără</Button>
            </Card>

            <Card className="text-center">
              <Badge variant="primary" size="sm" className="mb-2">Popular</Badge>
              <p className="text-4xl font-bold text-gray-900">+5</p>
              <p className="text-sm text-gray-600 mt-1">Cost: 45 diamante</p>
              <Button variant="accent" size="sm" className="mt-3" onClick={() => buyHearts(5, 9)} icon={<Heart size={16} />}>Cumpără</Button>
            </Card>

            <Card className="text-center">
              <Badge variant="success" size="sm" className="mb-2">Cel mai bun</Badge>
              <p className="text-4xl font-bold text-gray-900">+10</p>
              <p className="text-sm text-gray-600 mt-1">Cost: 85 diamante</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => buyHearts(10, 8.5)} icon={<Heart size={16} />}>Cumpără</Button>
            </Card>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Abonament Pro</h2>
          <p className="text-gray-600">Cu abonamentul activ, inimi nelimitate și fără consum la intrarea în puzzle-uri.</p>
          <div className="flex gap-3 mt-3">
            <Button variant="primary" icon={<Crown size={18} />} onClick={() => router.push('/subscriptions')}>Vezi planuri</Button>
            {!isSubscriber && (
              <Button variant="outline" icon={<Crown size={18} />} onClick={() => setSubscriber(true)}>Activează mock</Button>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-2">
            <Info className="text-blue-600" size={18} />
            <p className="text-gray-700">Logica de regenerare a inimilor (de ex. 1 inimă la 30 min) poate fi adăugată ulterior; momentan, această pagină oferă opțiuni mock de achiziție.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
