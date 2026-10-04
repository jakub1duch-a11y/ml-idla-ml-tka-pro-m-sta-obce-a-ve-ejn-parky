import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Clock3, Sparkles, Bot, MessageSquareText, CheckCircle2, ListFilter, Wrench, Layers3 } from 'lucide-react';

const fmt = (v) => Number(v || 0).toLocaleString('cs-CZ', { maximumFractionDigits: 1 });
const currentMonth = new Date().toISOString().slice(0, 7);
const monthLabel = (value) => {
  if (value === 'all') return 'Kompletní historie';
  const [y, m] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1));
};

export default function WorkBriefingPanel() {
  const [logs, setLogs] = useState([]);
  const [briefings, setBriefings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [period, setPeriod] = useState(currentMonth);

  useEffect(() => {
    Promise.all([
      base44.entities.WorkLog.list('-work_date', 500).catch(() => []),
      base44.entities.WorkBriefing.list('-month', 36).catch(() => []),
      base44.entities.AdminTask.list('-updated_date', 300).catch(() => []),
    ]).then(([l, b, t]) => { setLogs(l || []); setBriefings(b || []); setTasks(t || []); });
  }, []);

  const months = useMemo(() => Array.from(new Set([
    currentMonth,
    ...logs.map(x => x.work_date?.slice(0, 7)).filter(Boolean),
    ...briefings.map(x => x.month).filter(Boolean),
  ])).sort().reverse(), [logs, briefings]);

  const filtered = useMemo(() => logs.filter(x => period === 'all' || x.work_date?.startsWith(period)), [logs, period]);
  const filteredTasks = useMemo(() => tasks.filter(x => period === 'all' || (x.completed_at || x.created_date || '').startsWith(period)), [tasks, period]);
  const briefing = useMemo(() => period === 'all' ? null : briefings.find(x => x.month === period), [briefings, period]);

  const totals = useMemo(() => filtered.reduce((a, x) => {
    a.actual += Number(x.actual_hours) || 0;
    a.estimated += Number(x.actual_hours) > 0 ? 0 : Number(x.estimated_hours) || 0;
    a.ai += Number(x.ai_hours) || 0;
    a.input += Number(x.input_hours) || 0;
    a.completed += x.status === 'completed' ? 1 : 0;
    a.blocked += x.status === 'blocked' ? 1 : 0;
    return a;
  }, { actual: 0, estimated: 0, ai: 0, input: 0, completed: 0, blocked: 0 }), [filtered]);

  const taskHours = useMemo(() => filteredTasks.reduce((a, x) => {
    a.actual += Number(x.actual_hours) || 0;
    a.estimated += Number(x.estimated_hours) || 0;
    a.completed += x.status === 'completed' ? 1 : 0;
    return a;
  }, { actual: 0, estimated: 0, completed: 0 }), [filteredTasks]);

  const byArea = useMemo(() => Object.entries(filtered.reduce((a, x) => {
    const key = x.area || 'ostatní';
    if (!a[key]) a[key] = { count: 0, equivalent: 0 };
    a[key].count += 1;
    a[key].equivalent += Number(x.actual_hours) > 0 ? Number(x.actual_hours) : Number(x.estimated_hours) || 0;
    return a;
  }, {})).sort((a,b) => b[1].equivalent - a[1].equivalent), [filtered]);

  const equivalent = totals.actual + totals.estimated;

  return (
    <section className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[.08] via-white/[.025] to-cyan-500/[.05] p-5 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-violet-300">Pracovní briefing</p>
          <h3 className="mt-1 text-xl font-medium text-white">{monthLabel(period)} · práce, úkoly a AI procesy</h3>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-white/35">Hlavní metrika je vždy jeden finální pracovní čas za zvolené období. Jednotlivé pracovní logy jsou rozepsané podrobněji podle konkrétních činností, výstupů, nástrojů a procesů.</p>
        </div>
        <div className="flex items-center gap-2">
          <ListFilter size={14} className="text-white/35" />
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-xl border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white outline-none">
            {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
            <option value="all">Kompletní historie</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-2xl border border-cyan/20 bg-cyan/[.08] p-5"><div className="flex items-center gap-2 text-cyan"><CheckCircle2 size={15}/><span className="font-mono text-[10px] uppercase tracking-widest">Finální pracovní čas</span></div><div className="mt-3 text-4xl font-light text-white">{fmt(equivalent)} h</div><div className="mt-1 text-xs text-white/35">jediný výsledný součet za období · {totals.completed} dokončených logů</div></div>
      </div>

      {briefing ? <div className="mt-4 rounded-xl border border-white/8 bg-black/10 p-4"><div className="flex items-center gap-2"><Layers3 size={13} className="text-cyan"/><span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Měsíční shrnutí</span></div><p className="mt-2 text-sm leading-6 text-white/55">{briefing.summary}</p><div className="mt-3 flex flex-wrap gap-2">{(briefing.top_tools || []).map(x => <span key={x} className="rounded-full border border-white/8 px-2.5 py-1 font-mono text-[10px] text-white/35">{x}</span>)}</div></div> : null}

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
        <div className="overflow-hidden rounded-xl border border-white/8 bg-black/10">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3"><span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Pracovní logy</span><span className="text-[10px] text-white/25">{filtered.length} záznamů</span></div>
          <div className="max-h-[520px] divide-y divide-white/5 overflow-auto">
            {filtered.map(item => {
              const hasActual = Number(item.actual_hours) > 0;
              const main = hasActual ? Number(item.actual_hours) : Number(item.estimated_hours) || 0;
              return <div key={item.id} className="px-4 py-3"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-sm font-medium text-white/75">{item.title}</p><p className="mt-1 text-xs leading-relaxed text-white/35">{item.description}</p><div className="mt-2 flex flex-wrap gap-1.5"><Pill>{item.work_date}</Pill><Pill>{item.area}</Pill>{item.subtype ? <Pill>{item.subtype}</Pill> : null}{item.tool ? <Pill>{item.tool}</Pill> : null}{item.connector ? <Pill>{item.connector}</Pill> : null}</div></div><div className="shrink-0 text-right"><div className="font-mono text-sm text-cyan">{fmt(main)} h</div><div className="mt-1 text-[9px] uppercase tracking-wider text-white/25">pracovní čas</div></div></div></div>;
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-white/8 bg-black/10 p-4"><div className="flex items-center gap-2"><Wrench size={13} className="text-amber-300"/><span className="font-mono text-[10px] uppercase tracking-widest text-white/35">Podle oblasti</span></div><div className="mt-3 space-y-2">{byArea.map(([area, v]) => <div key={area} className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[.02] px-3 py-2"><div><div className="text-xs capitalize text-white/55">{area}</div><div className="text-[10px] text-white/25">{v.count} procesů</div></div><div className="font-mono text-xs text-cyan">{fmt(v.equivalent)} h</div></div>)}</div></div>
          <div className="rounded-xl border border-white/8 bg-black/10 p-4"><div className="font-mono text-[10px] uppercase tracking-widest text-white/35">Propojené AdminTask</div><div className="mt-3 grid grid-cols-2 gap-2"><Small label="Dokončeno" value={taskHours.completed}/><Small label="Celkem úkolů" value={filteredTasks.length}/><Small label="Pracovní logy" value={filtered.length}/><Small label="Blokované logy" value={totals.blocked}/></div></div>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value, note }) { return <div className="rounded-xl border border-white/8 bg-black/10 p-4"><div className="flex items-center gap-2 text-white/40"><Icon size={13}/><span className="font-mono text-[9px] uppercase tracking-widest">{label}</span></div><div className="mt-3 text-2xl font-light text-white">{value}</div><div className="mt-1 text-[10px] text-white/25">{note}</div></div>; }
function Pill({ children }) { return <span className="rounded-full border border-white/7 px-2 py-0.5 font-mono text-[9px] text-white/25">{children}</span>; }
function Small({ label, value }) { return <div className="rounded-lg border border-white/6 bg-white/[.02] p-2.5"><div className="text-lg font-light text-white/70">{value}</div><div className="text-[9px] text-white/25">{label}</div></div>; }
