import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

// Each use-case page links only to the nearest adjacent contexts,
// avoiding a repetitive 13-item link cloud below every landing page.
const PORTFOLIO = [
  { title: 'Města a obce', path: '/mlzitka-pro-mesta-obce' },
  { title: 'Parky a hřiště', path: '/kategorie/parky-hriste' },
  { title: 'Koupaliště a aquaparky', path: '/kategorie/koupaliste' },
  { title: 'Zahrady a terasy', path: '/kategorie/outdoor-zahrady' },
  { title: 'Zakázkové a art instalace', path: '/kategorie/art-instalace' },
  { title: 'Školy a školky', path: '/kategorie/skoly-skolky-deti' },
  { title: 'Pro architekty', path: '/kategorie/architekti' },
  { title: 'Gastro a komerční prostory', path: '/kategorie/komercni' },
  { title: 'Eventy a festivaly', path: '/kategorie/eventy' },
  { title: 'Dopravní uzly', path: '/kategorie/dopravni-uzly' },
  { title: 'Sportoviště', path: '/kategorie/sportoviste' },
  { title: 'Hotely a resorty', path: '/kategorie/hotely-resorty' },
  { title: 'Veřejné instituce', path: '/kategorie/verejne-instituce' },
];

const RELATED = {
  '/mlzitka-pro-mesta-obce': [1, 9, 10, 12],
  '/kategorie/parky-hriste': [0, 5, 10, 3],
  '/kategorie/koupaliste': [10, 7, 3, 0],
  '/kategorie/outdoor-zahrady': [7, 11, 4, 8],
  '/kategorie/art-instalace': [6, 8, 7, 0],
  '/kategorie/skoly-skolky-deti': [1, 12, 10, 3],
  '/kategorie/architekti': [4, 0, 12, 11],
  '/kategorie/komercni': [11, 3, 8, 4],
  '/kategorie/eventy': [7, 4, 11, 3],
  '/kategorie/dopravni-uzly': [0, 12, 10, 1],
  '/kategorie/sportoviste': [2, 1, 8, 0],
  '/kategorie/hotely-resorty': [7, 3, 4, 8],
  '/kategorie/verejne-instituce': [0, 9, 5, 1],
};

export default function B2BPortfolioNavigation() {
  const { pathname } = useLocation();
  const current = pathname.replace(/\/$/, '') || '/';
  const preferred = RELATED[current] || [];
  const links = [...preferred.map((index) => PORTFOLIO[index]), ...PORTFOLIO]
    .filter((entry, index, list) =>
      entry?.path && entry.path !== current &&
      list.findIndex((item) => item?.path === entry.path) === index
    )
    .slice(0, 4);

  return (
    <section className="border-t border-[#D7E4E9] bg-[#F4F8FA] py-14 sm:py-16" aria-labelledby="related-usecases-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#257487]">Související řešení</p>
            <h2 id="related-usecases-title" className="mt-3 max-w-lg font-heading text-2xl font-semibold tracking-[-.025em] text-[#103447] sm:text-3xl">
              Další možnosti podle prostoru.
            </h2>
          </div>
          <Link to="/katalog-mlzitek" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#16465B] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D8097]">
            Kompletní katalog <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <nav className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Související způsoby využití mlžítek">
          {links.map(({ path, title }, index) => (
            <Link
              key={path}
              to={path}
              className="group flex min-h-[112px] flex-col justify-between gap-4 border border-[#D4E3E8] bg-white p-5 transition-colors hover:border-[#85BCC7] hover:bg-[#FBFEFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D8097]"
            >
              <div className="flex items-center justify-between text-[#27788C]">
                <span className="font-mono text-[11px]">0{index + 1}</span>
                <ArrowUpRight size={18} aria-hidden="true" className="transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1" />
              </div>
              <span className="font-heading text-base font-semibold text-[#103447]">{title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
