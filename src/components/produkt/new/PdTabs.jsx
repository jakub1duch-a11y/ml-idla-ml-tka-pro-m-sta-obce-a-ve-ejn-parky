import React, { useState } from 'react';
import { Wrench, ShieldCheck, FileText } from 'lucide-react';

const TABS = [
  { id: 'instalace', label: 'Instalace', icon: Wrench, items: [
    'Varianta A: Kotvení patkou do betonu — pro trvalé umístění na dlažbě nebo betonové podloží.',
    'Varianta B: Zemní vrut — pro instalaci do trávníku nebo jemného povrchu bez betonové přípravy.',
    'Varianta C: Příprava vody v revizním šachtě — pro řešení s předem připraveným připojením.',
  ]},
  { id: 'hygiena', label: 'Hygiena a provoz', icon: ShieldCheck, items: [
    'Provoz na pitnou vodu z běžného vodovodního řadu.',
    'Filtr 5 µm zadržuje nečistoty a prodlužuje životnost trysek.',
    'Automatický proplach systému před a po provozu.',
    'Zazimování do 31. 10. — odpojení, vyplach a případně demontáž.',
  ]},
  { id: 'ke-stazeni', label: 'Ke stažení', icon: FileText, items: [] },
];

export default function PdTabs({ product }) {
  const [active, setActive] = useState('instalace');
  const documents = product.documents_urls || [];
  const tab = TABS.find((t) => t.id === active);

  return (
    <section className="bg-[#EAF5FB] py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="flex gap-2 border-b border-[#0B5EA8]/15">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors ${
                active === t.id ? 'border-b-2 border-[#0B5EA8] text-[#0B5EA8]' : 'text-[#0D2F4F]/50 hover:text-[#0D2F4F]'
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {active === 'ke-stazeni' ? (
            documents.length > 0 ? (
              <ul className="space-y-3">
                {documents.map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-[#0B5EA8] hover:text-[#0D2F4F]">
                      <FileText size={16} />
                      {url.split('/').pop() || `Dokument ${i + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#0D2F4F]/50">Dokumenty k tomuto produktu připravíme na vyžádání.</p>
            )
          ) : (
            <ul className="space-y-3">
              {tab.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#0D2F4F]">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-[#0B5EA8]" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}