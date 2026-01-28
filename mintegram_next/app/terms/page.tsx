'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Termeni și Condiții</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Acceptarea Termenilor</h2>
            <p>
              Folosind Mintegram, accepți acești termeni și condiții. Dacă nu le accepți, nu poți folosi aplicația.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Licența Utilizatorului</h2>
            <p>
              Mintegram ți-o acordă o licență limitată, non-exclusivă și revocabilă pentru a folosi aplicația personal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Responsabilități ale Utilizatorului</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Ești responsabil de contul tău și de parolă</li>
              <li>Nu poți folosi aplicația pentru activități ilegale</li>
              <li>Nu poți hărțui, defăima sau amenința alți utilizatori</li>
              <li>Nu poți modifica sau descuraja accesul la aplicație</li>
              <li>Nu poți exploata vulnerabilități de securitate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Conținut Utilizatorului</h2>
            <p>
              Orice conținut pe care îl postezi rămâne proprietatea ta, dar îi dai Mintegram o licență pentru a-l folosi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Achiziții și Plăți</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Monedele virtuale nu pot fi schimbate cu bani real</li>
              <li>Plățile sunt finale și nereturnabile</li>
              <li>Mintegram se rezervă dreptul de a modifica prețurile</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Exonerare de Răspundere</h2>
            <p>
              Mintegram furnizează serviciul &quot;ca este&quot; fără garanții. Nu suntem responsabili pentru pierderi de date,
              întreruperi de serviciu sau alte daune indirecte.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Limitarea Răspunderii</h2>
            <p>
              Răspunderea noastră este limitată la suma pe care ai plătit-o pentru servicii în ultimele 12 luni.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Jurisdicție</h2>
            <p>
              Acești termeni sunt guvernați de legile României. Orice dispute vor fi rezolvate în tribunalele din România.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Modificări ale Termenilor</h2>
            <p>
              Mintegram se rezervă dreptul de a modifica acești termeni. Vei fi notificat dacă apar schimbări importante.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">Ultima actualizare: 26 ianuarie 2026</p>
        </div>
      </div>
    </div>
  );
}
