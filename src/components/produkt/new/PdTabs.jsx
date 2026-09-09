import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, FileText, Wifi, ScanLine } from 'lucide-react';

const TAB_META = [
  { id: 'instalace', label: 'Instalace', icon: Wrench },
  { id: 'provoz', label: 'Provoz a řízení', icon: Wifi },
  { id: 'podklady', label: 'Projektové podklady', icon: ShieldCheck },
  { id: 'ke-stazeni', label: 'Ke stažení', icon: FileText },
];

export default function PdTabs({ product }) {
  const [active, setActive] = useState('instalace');
  const documents = product.documents_urls || [];

  const content = {
    instalace: [
      'Způsob kotvení se volí podle konkrétního výrobku, podloží a požadavků projektu.',
      'Přívod vody a servisní přístup navrhujeme tak, aby nenarušovaly výsledný vzhled prostoru.',
      'Před realizací upřesníme stavební připravenost a montážní detail.',
    ],
    provoz: [
      product.pressure ? `Provozní tlak produktu: ${product.pressure}.` : 'Provozní tlak se řídí technickou specifikací produktu a místními podmínkami.',
      product.water_consumption ? `Uvedená spotřeba vody: ${product.water_consumption}.` : 'Spotřeba vody se stanoví podle počtu a typu trysek a provozního režimu.',
      product.power_supply ? `Napájení / řízení: ${product.power_supply}.` : 'Manuální nebo smart řízení se volí podle konkrétní instalace.',
    ],
    podklady: [
      'Pro projektanty připravujeme dostupné technické listy, instalační podklady a potřebné výrobní informace.',
      'U zakázkových řešení upřesňujeme geometrii, kotvení a napojení před výrobou.',
      'Pokud potřebujete podklady pro konkrétní stupeň projektu, uveďte je v poptávce.',
    ],
  };

  return (
    <section className="bg-[#EAF5FB] py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="flex gap-1 overflow-x-auto border-b border-[#0B5EA8]/15 pb-px">
          {TAB_META.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)} className={`flex min-h-[44px] shrink-0 items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${active === t.id ? 'border-b-2 border-[#0B5EA8] text-[#0B5EA8]' : 'text-[#0D2F4F]/50 hover:text-[#0D2F4F]'}`}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 min-h-[150px]">
          {active === 'ke-stazeni' ? (
            documents.length > 0 ? (
              <ul className="space-y-3">
                {documents.map((url, i) => (
                  <li key={`${url}-${i}`}><a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-[#0B5EA8] hover:text-[#0D2F4F]"><FileText size={16}/>{url.split('/').pop() || `Dokument ${i + 1}`}</a></li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="text-sm leading-relaxed text-[#0D2F4F]/55">Veřejné dokumenty k tomuto produktu zatím nejsou přiřazené. Potřebné podklady připravíme podle vašeho projektu.</p>
                <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="text-sm font-semibold text-[#0B5EA8] hover:text-[#0D2F4F]">Vyžádat technické podklady →</Link>
              </div>
            )
          ) : (
            <ul className="space-y-3">
              {(content[active] || []).filter(Boolean).map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#0D2F4F]"><span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-[#0B5EA8]" />{item}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#0B5EA8]/10 pt-6 sm:flex-row">
          <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-[46px] items-center justify-center gap-2 border border-[#0B5EA8]/20 bg-white px-5 text-sm font-semibold text-[#0B5EA8]"><ScanLine size={15}/> Vizualizovat v prostoru</Link>
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-[46px] items-center justify-center bg-[#0B5EA8] px-6 text-sm font-semibold text-white">Probrat technické řešení</Link>
        </div>
      </div>
    </section>
  );
}
