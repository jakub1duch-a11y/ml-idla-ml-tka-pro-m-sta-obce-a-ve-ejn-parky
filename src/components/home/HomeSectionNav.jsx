import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'uvod', label: 'Úvod' },
  { id: 'benefity', label: 'Výhody' },
  { id: 'pribeh', label: 'Příběh mlhy' },
  { id: 'produkty', label: 'Produkty' },
  { id: 'realizace', label: 'Realizace' },
  { id: 'poznatky', label: 'Inspirace' },
];

export default function HomeSectionNav() {
  const [activeId, setActiveId] = useState('uvod');
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const current = entries.find((entry) => entry.isIntersecting);
      if (current) setActiveId(current.target.id);
    }, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
    SECTIONS.forEach(({ id }) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  const scrollTo = (event, id) => { event.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return <nav aria-label="Navigace hlavní stránkou" className="sticky top-[64px] z-30 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl lg:top-[72px]"><div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2.5 lg:px-10 [&::-webkit-scrollbar]:hidden">{SECTIONS.map(({ id, label }) => <a key={id} href={`#${id}`} onClick={(event) => scrollTo(event, id)} aria-current={activeId === id ? 'true' : undefined} className={`relative shrink-0 px-3 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${activeId === id ? 'text-slate-950' : 'text-slate-500 hover:text-slate-950'}`}>{label}{activeId === id && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-cyan sm:inset-x-4" />}</a>)}</div></nav>;
}