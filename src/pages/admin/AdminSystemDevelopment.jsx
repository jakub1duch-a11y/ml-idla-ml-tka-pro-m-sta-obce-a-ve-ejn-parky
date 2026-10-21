import React, { useEffect, useMemo, useState } from 'react';
import { Clock3, CheckCircle2, Layers3, Wrench, CalendarDays } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import WorkBriefingPanel from '@/components/admin/WorkBriefingPanel';

const REACT_FRAMEWORKS = [
  { name: 'Next.js', url: 'https://nextjs.org', description: 'The React Framework.', group: 'Hlavní seznam' },
  { name: 'Remix', url: 'https://remix.run', description: 'Resilientní webové aplikace a routing přes React Router.', group: 'Hlavní seznam' },
  { name: 'Astro', url: 'https://astro.build', description: 'Webový framework zaměřený na obsahové weby.', group: 'Hlavní seznam' },
  { name: 'Gatsby', url: 'https://www.gatsbyjs.com', description: 'React framework s důrazem na výkon, škálovatelnost a bezpečnost.', group: 'Hlavní seznam' },
  { name: 'Redwood', url: 'https://redwoodjs.com', description: 'Aplikační framework pro startupy.', group: 'Hlavní seznam' },
  { name: 'Vike', url: 'https://vike.dev', description: 'Flexibilní Vite framework s podporou SSR.', group: 'Hlavní seznam' },
  { name: 'vite-ssr-boost', url: 'https://github.com/Lomray-Software/vite-ssr-boost', description: 'SSR nebo SPA nad Vite a React Router.', group: 'Hlavní seznam' },
  { name: 'after.js', url: 'https://github.com/jaredpalmer/after.js', description: 'Serverově renderovaný React s React Routerem.', group: 'Hlavní seznam' },
  { name: 'Waku', url: 'https://github.com/dai-shi/waku', description: 'Minimalistický React framework.', group: 'Experimentální' },
  { name: 'TanStack Start', url: 'https://tanstack.com/start/latest', description: 'Full-stack React framework postavený na TanStack Router.', group: 'Experimentální' },
  { name: 'RakkasJS', url: 'https://github.com/rakkasjs/rakkasjs', description: 'Experimentální framework postavený na Vite.', group: 'Experimentální' },
];

const fmt = (value) => Number(value || 0).toLocaleString('cs-CZ', { maximumFractionDigits: 1 });
const monthLabel = (month) => {
  if (!month) return '';
  const [y, m] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1));
};

export default function AdminSystemDevelopment() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.PublicWorkSummary.list('-month', 24)
      .then((rows) => setSummaries(rows || []))
      .finally(() => setLoading(false));
  }, []);

  const total = useMemo(() => summaries.reduce((acc, item) => {
    acc.hours += (Number(item.actual_hours) || 0) + (Number(item.estimated_hours) || 0);
    acc.tasks += Number(item.completed_tasks) || 0;
    return acc;
  }, { hours: 0, tasks: 0 }), [summaries]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan">Interní přehled vývoje</p>
          <h2 className="mt-1 text-2xl font-medium text-white">Vývoj systému MLŽIDLA.cz</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">Interní stránka administrace pro pracovní historii, finální pracovní čas, dokončené výstupy a detailní rozpad činností. Tento přehled není určen pro veřejnou navigaci webu.</p>
        </div>
        <div className="rounded-2xl border border-cyan/20 bg-cyan/[.07] px-5 py-4">
          <div className="flex items-center gap-2 text-cyan"><Clock3 size={14}/><span className="font-mono text-[10px] uppercase tracking-widest">Finální pracovní čas</span></div>
          <div className="mt-2 text-3xl font-light text-white">{fmt(total.hours)} h</div>
        </div>
      </div>

      <WorkBriefingPanel />

      <section className="rounded-2xl border border-cyan/20 bg-[#0d1117] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan">GitHub zdroj · nahráno do kódu</p>
            <h3 className="mt-2 text-xl font-medium text-white">Awesome React Frameworks</h3>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Interní katalog frameworků převzatý z repozitáře. Obsahuje odkazy a stručné popisy, nikoli instalovatelný balíček.
              Seznam zůstává v administraci a není součástí veřejné navigace webu.
            </p>
            <a href="https://github.com/jakub1duch-a11y/awesome-react-frameworks/tree/main" target="_blank" rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs text-cyan hover:text-white">
              Otevřít původní repozitář <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="max-w-xl rounded-xl border border-emerald-300/15 bg-emerald-300/[.04] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-200">Rozhodnutí pro MLŽIDLA.cz</p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Zachovat současný Vite + React + React Router + Base44 Vite plugin. Tento repozitář je přehled možností SSR, ne hotový kód k instalaci.
              Přechod na jiný framework by vyžadoval samostatnou migraci a ověření přihlášení, Base44 SDK, tras, SEO a nasazení.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {REACT_FRAMEWORKS.map((framework) => (
            <a key={framework.name} href={framework.url} target="_blank" rel="noreferrer"
              className="group rounded-xl border border-white/8 bg-white/[.025] p-4 transition-colors hover:border-cyan/30 hover:bg-cyan/[.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-medium text-white/85">{framework.name}</h4>
                <span className={`shrink-0 rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${framework.group === 'Experimentální' ? 'border-amber-300/20 text-amber-200/80' : 'border-white/10 text-white/30'}`}>
                  {framework.group}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/45">{framework.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-cyan/70 group-hover:text-cyan">Dokumentace / zdroj <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-5 text-white/30">
          Úplná interní kopie seznamu a poznámky k rozhodnutí: <code className="text-white/50">docs/AWESOME_REACT_FRAMEWORKS.md</code>.
          Před případnou migrací ověř aktuální údržbu a kompatibilitu každého projektu.
        </p>
      </section>

      <section className="rounded-2xl border border-white/8 bg-white/[.025] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><Layers3 size={14} className="text-violet-300"/><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Měsíční historie vývoje</p></div>
            <p className="mt-1 text-xs text-white/25">Souhrny dokončených prací podle měsíců.</p>
          </div>
          <div className="rounded-full border border-white/8 px-3 py-1.5 font-mono text-[10px] text-white/35">{total.tasks} výstupů</div>
        </div>

        {loading ? <div className="py-12 text-center text-sm text-white/25">Načítám historii…</div> : (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {summaries.map((item) => {
              const hours = (Number(item.actual_hours) || 0) + (Number(item.estimated_hours) || 0);
              return (
                <article key={item.id} className="rounded-2xl border border-white/8 bg-black/10 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-cyan"><CalendarDays size={13}/><span className="font-mono text-[10px] uppercase tracking-widest">{monthLabel(item.month)}</span></div>
                      <h3 className="mt-2 text-lg font-medium text-white/85">{item.title}</h3>
                    </div>
                    <div className="text-right"><div className="font-mono text-xl text-cyan">{fmt(hours)} h</div><div className="text-[9px] uppercase tracking-wider text-white/25">finální čas</div></div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-white/40">{item.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{(item.areas || []).map((area) => <span key={area} className="rounded-full border border-white/8 px-2.5 py-1 font-mono text-[9px] text-white/30">{area}</span>)}</div>
                  <div className="mt-5 border-t border-white/8 pt-4">
                    <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-300"/><span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Vybrané dokončené práce</span></div>
                    <div className="mt-3 space-y-2">{(item.highlights || []).map((text) => <div key={text} className="flex gap-2 text-xs leading-5 text-white/45"><Wrench size={12} className="mt-1 shrink-0 text-white/25"/><span>{text}</span></div>)}</div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
