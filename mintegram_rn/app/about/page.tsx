'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">Despre Mintegram</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ce este Mintegram?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Mintegram este o platformă interactivă de puzzle-uri și jocuri de cuvinte care combină tradiționalul
            cu modernul. Oferim integrame și rebusuri pentru toți vârstele, cu o comunitate activă și sisteme
            de recompense engaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-indigo-600 mb-3">🎯 Misiunea Noastră</h3>
            <p className="text-gray-700">
              Să oferim jocuri de cuvinte divertismente care stimulează mintea și conectează oamenii din toată lumea.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-indigo-600 mb-3">🌟 Valorile Noastre</h3>
            <p className="text-gray-700">
              Inovație, calitate, comunitate și incluziune. Credem în puterea jocurilor pentru educație și divertisment.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-indigo-600 mb-3">🚀 Viziunea Noastră</h3>
            <p className="text-gray-700">
              Să devenim platforma de puzzle-uri nr. 1 din lume, cu milioane de utilizatori activi zilnic.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Caracteristici</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">✓</span>
              <span><strong>Puzzle-uri Zilnice:</strong> Noi integrame și rebusuri zilnic</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">✓</span>
              <span><strong>Leaderboard Global:</strong> Competează cu utilizatori din toată lumea</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">✓</span>
              <span><strong>Sisteme de Recompense:</strong> Câștigă insigne, diamante și altele</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">✓</span>
              <span><strong>Niveluri și Progres:</strong> Tracking detaliat al progresului tău</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">✓</span>
              <span><strong>Comunitate Activă:</strong> Conectează-te cu alți jucători</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">✓</span>
              <span><strong>Personalizare:</strong> Alege tema, dificultatea și alte setări</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Echipa Noastră</h2>
          <p className="text-gray-700 mb-4">
            Mintegram este creată de o echipă dedicată de dezvoltatori, designeri și puzzle enthusiasts din România.
          </p>
          <p className="text-gray-700">
            Contactează-ne la{' '}
            <a href="mailto:hello@mintegram.com" className="text-indigo-600 hover:underline">
              hello@mintegram.com
            </a>
            {' '}sau vizitează pagina de{' '}
            <a href="/contact" className="text-indigo-600 hover:underline">
              contact
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
