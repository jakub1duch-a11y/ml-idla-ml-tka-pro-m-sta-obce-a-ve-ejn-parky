import React from 'react';
import { CheckSquare } from 'lucide-react';

const CHECKLIST = [
  'Technický list produktu s parametry a kotvením',
  'Vizualizace produktu přímo ve vašem prostoru',
  'Nabídka s variantami A/B/C a cenou bez DPH',
  'Odhad spotřeby vody a provozních nákladů',
  'Návrh rozmístění prvků s ohledem na provoz',
  'Podklady pro dotační žádost (technický popis, rozpočet)',
  'Návrh smart řízení podle teploty a času',
  'Harmonogram instalace a servisu',
];

export default function CoDostaneRadaMesta() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Co dostane rada města</p>
            <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
              Podklady připravené pro schvalování.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#0D2F4F]/60">
              Každá nabídka obsahuje technické i provozní podklaty potřebné pro rozhodnutí rady nebo zastupitelstva.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-start gap-3 border border-[#EAF5FB] bg-white p-4">
                <CheckSquare size={16} className="mt-0.5 shrink-0 text-[#0B5EA8]" />
                <span className="text-sm leading-relaxed text-[#0D2F4F]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}