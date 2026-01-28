'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Setting {
  theme: 'light' | 'dark';
  notifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  language: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting>({
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    soundEnabled: true,
    language: 'ro'
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (key: keyof Setting) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await fetch('/api/settings/preferences/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(settings)
      });
      alert('Setările au fost salvate!');
    } catch (error) {
      console.error('Error:', error);
      alert('Eroare la salvarea setărilor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Setări</h1>

      <div className="max-w-2xl space-y-6">
        {/* Tema */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🎨 Apariție</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Temă</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="light">Lumină</option>
                <option value="dark">Întuneric</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notificări */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🔔 Notificări</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Notificări în aplicație</span>
              <button
                onClick={() => handleToggle('notifications')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  settings.notifications
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {settings.notifications ? 'Activat' : 'Dezactivat'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Notificări prin email</span>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  settings.emailNotifications
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {settings.emailNotifications ? 'Activat' : 'Dezactivat'}
              </button>
            </div>
          </div>
        </div>

        {/* Sunet */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🔊 Sunet</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Efecte sonore</span>
            <button
              onClick={() => handleToggle('soundEnabled')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                settings.soundEnabled
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {settings.soundEnabled ? 'Activat' : 'Dezactivat'}
            </button>
          </div>
        </div>

        {/* Limbă */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🌐 Limbă</h2>
          <div>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="ro">Română</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Informații și Acțiuni */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">ℹ️ Informații</h2>
          <div className="space-y-2">
            <Link href="/help" className="block text-indigo-400 hover:text-indigo-300">
              → Ajutor și tutoriale
            </Link>
            <Link href="/privacy" className="block text-indigo-400 hover:text-indigo-300">
              → Politica de confidențialitate
            </Link>
            <Link href="/terms" className="block text-indigo-400 hover:text-indigo-300">
              → Termeni și condiții
            </Link>
            <Link href="/about" className="block text-indigo-400 hover:text-indigo-300">
              → Despre Mintegram
            </Link>
            <button className="block w-full text-left text-red-400 hover:text-red-300 mt-4 p-2 hover:bg-red-900/20 rounded">
              → Șterge contul
            </button>
          </div>
        </div>

        {/* Salvare */}
        <button
          onClick={saveSettings}
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Se salvează...' : 'Salvează Setări'}
        </button>
      </div>
    </div>
  );
}
