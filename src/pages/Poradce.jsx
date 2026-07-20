import React, { useState } from 'react';

export default function PoradceRozcestnik() {
  const [vybranySmer, setVybranySmer] = useState(null);

  // Definice možností na základě vaší otázky
  const moznosti = [
    {
      id: 'produkt',
      titulek: 'Vybrat produkt',
      popis: 'Prohlédněte si katalog mlžítek a vyberte si standardní model.',
      ikona: '📦'
    },
    {
      id: 'nabidka',
      titulek: 'Zažádat o cenovou nabídku',
      popis: 'Máte vybraný produkt a chcete znát přesnou cenu a termín dodání.',
      ikona: '💰'
    },
    {
      id: 'vlastni_reseni',
      titulek: 'Poptat vlastní řešení a tvar mlžítka',
      popis: 'Potřebujete atypický tvar nebo specifické technické řešení na míru.',
      ikona: '📐'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen flex flex-col justify-center">
      
      {/* Hlavní nadpis - Vaše otázka */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          S čím vám mohu pomoci?
        </h1>
        <p className="text-gray-600 text-lg">
          Vyberte si jednu z možností níže a já vás provedu dalším postupem.
        </p>
      </div>

      {/* Grid s interaktivními kartami */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moznosti.map((moznost) => (
          <button
            key={moznost.id}
            onClick={() => setVybranySmer(moznost.id)}
            className={`flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md hover:border-blue-500 ${
              vybranySmer === moznost.id 
                ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/30' 
                : 'border-gray-200'
            }`}
          >
            {/* Ikona */}
            <span className="text-4xl mb-4" role="img" aria-label={moznost.titulek}>
              {moznost.ikona}
            </span>
            
            {/* Titulek */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {moznost.titulek}
            </h3>
            
            {/* Popis */}
            <p className="text-sm text-gray-500 line-clamp-3">
              {moznost.popis}
            </p>
          </button>
        ))}
      </div>

      {/* Dynamické zobrazení dalšího kroku podle výběru */}
      {vybranySmer && (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-sm border border-gray-200 animate-fadeIn">
          {vybranySmer === 'produkt' && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Skvělé! Pojďme vybrat mlžítko.</h4>
              <p className="text-gray-600 mb-4">Zde se zobrazí filtr produktů nebo odkaz na katalog...</p>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">Otevřít katalog</button>
            </div>
          )}

          {vybranySmer === 'nabidka' && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Formulář pro cenovou nabídku</h4>
              <p className="text-gray-600 mb-4">Připravte si prosím kód produktu nebo odkaz z katalogu.</p>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">Pokračovat k poptávce</button>
            </div>
          )}

          {vybranySmer === 'vlastni_reseni' && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Návrh vlastního tvaru a řešení</h4>
              <p className="text-gray-600 mb-4">Budeme od vás potřebovat přibližné rozměry např. výšku mlžítka a představu o umístění.</p>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">Konfigurovat vlastní tvar</button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
