'use client';

import { useState, useEffect } from 'react';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
  earned: boolean;
  earned_date?: string;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/badges/');
      const data = await response.json();
      setBadges(data);
      
      const userResponse = await fetch('/api/users/me/badges/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const userData = await userResponse.json();
      setUserBadges(userData);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Se încarcă...</div>;

  const earnedBadges = badges.filter(b => userBadges.some(ub => ub.id === b.id));
  const lockedBadges = badges.filter(b => !userBadges.some(ub => ub.id === b.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Insignele Mele</h1>

      {/* Insignele Câștigate */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
          Câștigate ({earnedBadges.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {earnedBadges.map(badge => (
            <div
              key={badge.id}
              className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg p-4 text-center hover:scale-110 transition-transform shadow-lg"
            >
              <div className="text-5xl mb-2">{badge.icon}</div>
              <h3 className="font-bold text-sm text-gray-900">{badge.name}</h3>
              <p className="text-xs text-gray-800 mt-1">{badge.description}</p>
              {badge.earned_date && (
                <p className="text-xs text-gray-700 mt-2">
                  Câștigată: {new Date(badge.earned_date).toLocaleDateString('ro-RO')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Insignele Blocate */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">
          Blocate ({lockedBadges.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {lockedBadges.map(badge => (
            <div
              key={badge.id}
              className="bg-gray-700 rounded-lg p-4 text-center opacity-60 hover:opacity-80 transition-opacity shadow-lg"
            >
              <div className="text-5xl mb-2 grayscale">{badge.icon}</div>
              <h3 className="font-bold text-sm text-gray-300">{badge.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
              <p className="text-xs text-yellow-300 mt-2">
                {badge.condition_type}: {badge.condition_value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
