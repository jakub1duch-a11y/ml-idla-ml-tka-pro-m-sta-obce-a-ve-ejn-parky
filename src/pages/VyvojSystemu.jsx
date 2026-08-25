import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Cpu, Clock3, Sparkles, Layers3, ArrowUpRight } from 'lucide-react';

const fmt = (value) => Number(value || 0).toLocaleString('cs-CZ', { maximumFractionDigits: 1 });
const monthLabel = (month) => {
  if (!month) return '';
  const [y, m] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1));
};

export default function VyvojSystemu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.PublicWorkSummary.list('-month', 24)
      .then((rows) => setItems(rows || []))
      .finally(() => setLoading(false));
  }, []);

  const total = useMemo(() => items.reduce((acc, item) => {
    acc.actual += Number(item.actual_hours) || 0;
    acc.estimated += Number(item.estimated_hours) || 0;
    acc.tasks += Number(item.completed_tasks) || 0;
    return acc;
  }, { actual: 0, estimated: 0, tasks: 0 }), [items]);

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <div className="text-sm font-semibold tracking-[0.08em]">MLŽIDLA®</div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">HolmTec · vývoj systému</div>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-700">Transparentní přehled vývoje</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-light leading-tight sm:text-6xl">Co se na systému MLŽIDLA.cz skutečně staví a rozvíjí.</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">Měsíční souhrn dokončených změn napříč webem, produkty, médii, analytikou, marketingem, obchodními nabídkami a interní administrací. Hlavní metrika je jeden finální pracovní čas; potvrzená a odhadovaná část jsou pouze jeho rozpad.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white"><Clock3 size={18} className="text-cyan"/><div className="mt-5 text-4xl font-light">{fmt(total.actual + total.estimated)} h</div><div className="mt-1 text-xs text-white/50">finální pracovní čas</div></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-2xl font-light">{fmt(total.actual)} h</div><div className="mt-1 text-xs text-slate-500">potvrzená část</div></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-2xl font-light">{fmt(total.estimated)} h</div><div className="mt-1 text-xs text-slate-500">odhadovaná část</div></div>
              <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4"><CheckCircle2 size={18} className="text-emerald-600"/><div className="mt-5 text-3xl font-light">{fmt(total.tasks)}</div><div className="mt-1 text-xs text-slate-500">dokončených evidovaných výstupů</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
        {loading ? <div className="text-sm text-slate-500">Načítám přehled…</div> : null}
        <div className="space-y-6">
          {items.map((item) => {
            const equivalent = (Number(item.actual_hours) || 0) + (Number(item.estimated_hours) || 0);
            return <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[.72fr_1.28fr]">
                <div className="border-b border-slate-200 bg-slate-950 p-6 text-white lg:border-b-0 lg:border-r lg:p-8">
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">{monthLabel(item.month)}</div>
                  <h2 className="mt-3 text-2xl font-light">{item.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-white/60">{item.summary}</p>
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-2xl font-light">{fmt(item.actual_hours)} h</div><div className="mt-1 text-[11px] text-white/45">potvrzeno</div></div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-2xl font-light">{fmt(item.estimated_hours)} h</div><div className="mt-1 text-[11px] text-white/45">odhad ekvivalentu</div></div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-2xl font-light">{fmt(equivalent)} h</div><div className="mt-1 text-[11px] text-white/45">souhrnný pracovní ekvivalent</div></div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-2xl font-light">{fmt(item.completed_tasks)}</div><div className="mt-1 text-[11px] text-white/45">výstupů</div></div>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium"><Layers3 size={16}/> Oblasti práce</div>
                      <div className="mt-3 flex flex-wrap gap-2">{(item.areas || []).map((area) => <span key={area} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">{area}</span>)}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium"><Cpu size={16}/> AI a koordinace</div>
                      <div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-xl bg-violet-50 p-3"><div className="text-xl font-light">{fmt(item.ai_hours)} h</div><div className="text-[11px] text-violet-700/70">AI / konektory</div></div><div className="rounded-xl bg-sky-50 p-3"><div className="text-xl font-light">{fmt(item.input_hours)} h</div><div className="text-[11px] text-sky-700/70">zadávání / kontrola</div></div></div>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-slate-200 pt-6">
                    <div className="text-sm font-medium">Vybrané dokončené práce</div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">{(item.highlights || []).map((text) => <div key={text} className="flex gap-3 rounded-2xl border border-slate-200 p-4"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600"/><span className="text-sm leading-6 text-slate-600">{text}</span></div>)}</div>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-400"><span>{item.updated_label}</span><a href="/kontakt" className="inline-flex items-center gap-1 text-slate-700 hover:text-sky-700">Kontakt <ArrowUpRight size={13}/></a></div>
                </div>
              </div>
            </article>;
          })}
        </div>
        <p className="mt-8 max-w-4xl text-xs leading-5 text-slate-500">Metodika: finální pracovní čas = potvrzený lidský čas + kvalifikovaný odhad práce tam, kde přesný timesheet neexistuje. AI/konektorová a zadávací část jsou pouze informativním rozpadem odhadované části a do finálního času se znovu nepřičítají.</p>
      </section>
    </main>
  );
}
