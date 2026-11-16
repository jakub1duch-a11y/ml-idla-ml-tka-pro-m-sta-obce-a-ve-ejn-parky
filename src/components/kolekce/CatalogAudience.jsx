import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2, Users, Home, Warehouse, School } from 'lucide-react';

const SEGMENTS = [
  { icon: Building2, code: 'B2G', label: 'Města a obce', path: '/mlzitka-pro-mesta-obce', desc: 'Pro náměstí, parky a veřejná prostranství. Důležitý je pohyb lidí, technická příprava a následný provoz.' },
  { icon: Users, code: 'EVENT', label: 'Eventy a festivaly', path: '/kategorie/eventy', desc: 'Dočasná mlžítka a mlžné brány podle délky akce, prostoru, přívodu vody a pohybu návštěvníků.' },
  { icon: Home, code: 'HOME', label: 'Zahrady a rezidence', path: '/zahradni-mlzitka', desc: 'Zahradní mlžítka s umístěním podle slunce, větru a odstupu od míst k sezení.' },
  { icon: Warehouse, code: 'B2B', label: 'Gastro, hotely, areály', path: '/kategorie/komercni', desc: 'Pro terasy, hotelové zahrady, kiosky a fotopointy. Doporučíme řešení podle konkrétního provozu.' },
  { icon: School, code: 'ŠKOLY', label: 'Školy a školky', path: '/kategorie/skoly-skolky-deti', desc: 'Návrh pro školní areály s ohledem na provoz a bezpečnost. Mlžítka nejsou herními prvky podle ČSN EN 1176.' },
];

export default function CatalogAudience() {
  return (
    <section className="border-t border-[#D3E2E8] bg-[#F4FAFC]" aria-labelledby="catalog-audience-title">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">Podle využití</p>
        <h2 id="catalog-audience-title" className="mt-3 max-w-3xl font-heading text-3xl font-semibold text-[#0A1628] sm:text-4xl">
          Najděte řešení podle místa, kde bude mlžítko stát.
        </h2>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTS.map(({ icon: Icon, code, label, desc, path }) => (
            <Link
              key={path}
              to={path}
              className="group flex min-h-[230px] flex-col border border-[#D7E6EA] bg-white p-6 transition-colors hover:border-[#7EBAC8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8CA7]"
            >
              <div className="flex items-center justify-between text-[#1C7288]">
                <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
                <ArrowUpRight size={18} aria-hidden="true" className="transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1" />
              </div>
              <p className="mt-5 font-mono text-[11px] font-semibold tracking-[.12em] text-[#5E8490]">{code}</p>
              <h3 className="mt-2 font-heading text-xl font-semibold text-[#092F42]">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-[#58717B]">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
