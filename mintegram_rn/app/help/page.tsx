'use client';

import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Ajutor și Tutoriale</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tutorialuri */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Cum să Joci</h2>
          <ul className="space-y-3">
            <li>
              <h3 className="font-semibold text-gray-700">Integrame</h3>
              <p className="text-gray-600 text-sm">Completează cuvintele pe baza definițiilor. Răspunsurile se intersectează pe litere.</p>
            </li>
            <li>
              <h3 className="font-semibold text-gray-700">Rebusuri</h3>
              <p className="text-gray-600 text-sm">Rezolvă ghicitori și puzzle-uri bazate pe imagini și cuvinte.</p>
            </li>
            <li>
              <h3 className="font-semibold text-gray-700">Provocări</h3>
              <p className="text-gray-600 text-sm">Participă la provocări zilnice și săptămânale pentru a câștiga premii.</p>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">❓ Întrebări Frecvente</h2>
          <ul className="space-y-3">
            <li>
              <h3 className="font-semibold text-gray-700">Cum obțin inimile?</h3>
              <p className="text-gray-600 text-sm">Inimile se refac automat în fiecare oră. Poți cumpăra mai multe din shop.</p>
            </li>
            <li>
              <h3 className="font-semibold text-gray-700">Cum câștig puncte?</h3>
              <p className="text-gray-600 text-sm">Completezi integrame și rebusuri pentru XP. Nivelul crește cu 100 XP.</p>
            </li>
            <li>
              <h3 className="font-semibold text-gray-700">Ce sunt diamantele?</h3>
              <p className="text-gray-600 text-sm">Diamantele sunt premium currency. Poți le folosi pentru cosmetice speciale.</p>
            </li>
          </ul>
        </div>

        {/* Suport */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Contactează-ne</h2>
          <p className="text-gray-600 mb-4">Ai o problemă? Contactează echipa noastră de suport.</p>
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Trimite Mesaj
          </Link>
        </div>

        {/* Setări */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Setări</h2>
          <p className="text-gray-600 mb-4">Personalizează experiența ta în joc.</p>
          <Link
            href="/settings"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Deschide Setări
          </Link>
        </div>
      </div>
    </div>
  );
}
