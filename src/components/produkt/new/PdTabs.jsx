import React, { useMemo, useState } from 'react';
import { Wrench, ShieldCheck, FileText } from 'lucide-react';

export default function PdTabs({ product }) {
  const [active, setActive] = useState('instalace');
  const documents = product.documents_urls || [];

  const tabs = useMemo(() => [
    {
      id: 'instalace',
      label: 'Instalace',
      icon: Wrench,
      items: [
        'Kotvení se navrhuje podle konkrétního produktu, podloží a charakteru finálního povrchu.',
        'Přívod vody je vhodné připravit skrytě tam, kde to umožňuje stavební a technické řešení projektu.',
        'Rozmístění prvků a servisní přístup se potvrzují před výrobou podle finálního situačního návrhu.',
      ],
    },
    {
      id: 'provoz',
      label: 'Provoz a údržba',
      icon: ShieldCheck,
      items: [
        product.pressure ? `Provozní tlak evidovaný u tohoto produktu: ${product.pressure}.` : 'Provozní tlak se stanoví podle konkrétního produktu a instalace.',
        product.water_consumption ? `Evidovaná spotřeba vody: ${product.water_consumption}.` : 'Spotřeba vody závisí na počtu trysek, tlaku a provozním režimu.',
        'Filtrace, proplach, servis a zazimování se navrhují podle místních podmínek, kvality vody a způsobu sezónního provozu.',
      ],
    },
    {
      id: 'ke-stazeni',
      label: 'Ke stažení',
      icon: FileText,
      items: [],
    },
  ], [product]);

  const tab = tabs.find((item) => item.id === active) || tabs[0];

  return (
    <section className="bg-[#F4FAFC] py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-7 lg:px-10">
        <div className="overflow-x-auto border-b border-[#CFE0E6] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-1">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={`relative flex min-h-[52px] items-center gap-2 px-5 text-sm font-semibold transition-colors ${active === item.id ? 'text-[#0A1628]' : 'text-[#647683] hover:text-[#0A1628]'}`}
                >
                  <Icon size={15} />
                  {item.label}
                  {active === item.id && <span className="absolute inset-x-4 bottom-0 h-0.5 bg-[#22D3EE]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border border-[#D5E5EA] bg-white p-6 sm:p-8">
          {active === 'ke-stazeni' ? (
            documents.length > 0 ? (
              <ul className="divide-y divide-[#E4EEF2]">
                {documents.map((url, index) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-[52px] items-center gap-3 text-sm font-semibold text-[#0B5EA8] transition-colors hover:text-[#0A1628]"
                    >
                      <FileText size={16} />
                      Technický dokument {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-6 text-[#5A6B78]">Technické podklady k tomuto produktu připravíme podle konkrétního projektu nebo na vyžádání.</p>
            )
          ) : (
            <ul className="space-y-4">
              {tab.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#334B5C]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22D3EE]" />
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
