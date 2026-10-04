import React, { useEffect, useMemo, useState } from 'react';
import { Clock3, CheckCircle2, Layers3, Wrench, CalendarDays } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import WorkBriefingPanel from '@/components/admin/WorkBriefingPanel';

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
