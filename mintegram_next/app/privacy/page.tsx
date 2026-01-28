'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Politica de Confidențialitate</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introducere</h2>
            <p>
              Mintegram respectă confidențialitatea utilizatorilor și se angajează să protejeze datele personale.
              Această politică explică cum colectăm, folosim și protejăm informațiile tale.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Datele pe care le Colectăm</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Informații de cont (nume, email, parolă)</li>
              <li>Profilul utilizatorului (fotografie, biografie)</li>
              <li>Progres în joc (scoruri, timp, puzzle-uri rezolvate)</li>
              <li>Informații de cumpărare (tranzacții, monede)</li>
              <li>Date de utilizare (pagini vizitate, timp petrecut)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Cum Folosim Datele</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Pentru a furniza și îmbunătăți serviciile</li>
              <li>Pentru a personaliza experiența utilizatorului</li>
              <li>Pentru analytics și statistici</li>
              <li>Pentru a comunica cu tine</li>
              <li>Pentru a completa cu legea</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Protecția Datelor</h2>
            <p>
              Folosim criptare SSL/TLS pentru a proteja datele în tranzit. Parolele sunt stocate cu hash-uri.
              Accesul la date este restricționat și monitorizat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Cookie-uri</h2>
            <p>
              Folosim cookie-uri pentru a memora preferințele tale și pentru analytics.
              Poți controla cookie-urile din setările browserului.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Drepturile Tale</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Dreptul la acces: Poți cere o copie a datelor tale</li>
              <li>Dreptul la rectificare: Poți actualiza datele</li>
              <li>Dreptul la ștergere: Poți cere ștergerea contului</li>
              <li>Dreptul la portabilitate: Poți exporta datele</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Contact</h2>
            <p>
              Pentru întrebări despre politica de confidențialitate, contactează-ne la{' '}
              <a href="mailto:privacy@mintegram.com" className="text-indigo-600 hover:underline">
                privacy@mintegram.com
              </a>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">Ultima actualizare: 26 ianuarie 2026</p>
        </div>
      </div>
    </div>
  );
}
