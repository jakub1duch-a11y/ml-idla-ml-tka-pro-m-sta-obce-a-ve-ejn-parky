import React, { useState, useEffect } from 'react';
import { Loader, Users, MousePointerClick, Clock, MapPin, Package, Search, ClipboardCheck, Hammer, CalendarDays, CheckCircle2, ListTodo, UserRound, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import WorkBriefingPanel from '@/components/admin/WorkBriefingPanel';

const PRODUCT_NAME_CACHE = {};

function formatDuration(seconds) {
  const s = Math.round(seconds || 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState(null);
  const [products, setProducts] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [adminTasks, setAdminTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      base44.functions.invoke('getAnalyticsData', { days: 28 }),
      base44.functions.invoke('getSearchConsoleQueries', { days: 28 }),
      base44.entities.Product.list(),
      base44.entities.WorkLog.list('-work_date', 250).catch(() => []),
      base44.entities.AdminTask.list('-updated_date', 100).catch(() => []),
    ])
      .then(([a, s, p, w, t]) => {
        setAnalytics(a.data);
        setSearch(s.data);
        setProducts(p);
        setWorkLogs(w || []);
        setAdminTasks(t || []);
      })
      .catch(() => setError('Nelze načíst data — zkontrolujte připojení Google Analytics / Search Console.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-cyan/40" /></div>;
  if (error) return <div className="p-6"><div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div></div>;

  const totals = analytics?.totals || { sessions: 0, users: 0, pageviews: 0 };
  const inquiries = analytics?.inquiries || 0;
  const conversionRate = totals.sessions > 0 ? ((inquiries / totals.sessions) * 100).toFixed(1) : '0';
  const avgPosition = search?.rows?.length
    ? (search.rows.reduce((sum, r) => sum + r.position, 0) / search.rows.length).toFixed(1)
    : '—';

  const productName = (path) => {
    const slug = path?.split('/produkt/')[1];
    if (!slug) return path;
    if (PRODUCT_NAME_CACHE[slug]) return PRODUCT_NAME_CACHE[slug];
    const found = products.find((p) => p.slug === slug);
    const name = found?.name || slug;
    PRODUCT_NAME_CACHE[slug] = name;
    return name;
  };

  const jakubLogs = workLogs.filter((item) => !item.worker_name || item.worker_name.toLowerCase().includes('jakub'));
  const completedWork = jakubLogs.filter((item) => item.status === 'completed');
  const recordedHours = jakubLogs.reduce((sum, item) => sum + (Number(item.actual_hours) > 0 ? Number(item.actual_hours) : Number(item.estimated_hours) || 0), 0);
  const recordedDays = new Set(jakubLogs.filter((item) => item.work_date).map((item) => item.work_date)).size;
  const firstWorkDate = jakubLogs.length ? [...jakubLogs].filter((item) => item.work_date).sort((a, b) => String(a.work_date).localeCompare(String(b.work_date)))[0]?.work_date : null;
  const recentWork = [...jakubLogs].sort((a, b) => `${b.work_date || ''}${b.updated_date || ''}`.localeCompare(`${a.work_date || ''}${a.updated_date || ''}`)).slice(0, 8);
  const hoursByArea = Object.entries(jakubLogs.reduce((acc, item) => {
    const key = item.area || 'ostatní';
    if (!acc[key]) acc[key] = { hours: 0, tasks: 0 };
    acc[key].hours += Number(item.actual_hours) > 0 ? Number(item.actual_hours) : Number(item.estimated_hours) || 0;
    acc[key].tasks += 1;
    return acc;
  }, {})).sort((a, b) => b[1].hours - a[1].hours || b[1].tasks - a[1].tasks);

  const activeTasks = adminTasks.filter((item) => !['completed','cancelled'].includes(item.status));
  const completedTasks = adminTasks.filter((item) => item.status === 'completed');
  const reviewTasks = adminTasks.filter((item) => item.status === 'review');
  const overdueTasks = activeTasks.filter((item) => item.due_date && new Date(`${item.due_date}T23:59:59`) < new Date());
  const recentTasks = [...activeTasks].sort((a,b) => String(b.updated_date || '').localeCompare(String(a.updated_date || ''))).slice(0, 6);

  const cards = [
    { icon: Users, label: 'Návštěvy (28 dní)', value: totals.sessions.toLocaleString(), color: 'text-cyan' },
    { icon: MousePointerClick, label: 'Konverze', value: `${inquiries} (${conversionRate} %)`, color: 'text-emerald-400' },
    { icon: Clock, label: 'Doba na uživatele', value: formatDuration(analytics?.avgSessionDuration), color: 'text-violet-400' },
    { icon: Search, label: 'Průměrná pozice', value: avgPosition, color: 'text-amber-400' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-white text-lg font-medium">Přehled</h2>

      <WorkBriefingPanel />

      <section className="rounded-2xl border border-cyan/15 bg-gradient-to-br from-cyan/8 to-white/2 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Stavba systému MLŽIDLA.cz</p>
            <h3 className="mt-1 text-xl font-medium text-white">Dlouhodobý přehled práce · Jakub Duch</h3>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-white/35">Souhrn odvedených změn, pracovních logů a oblastí vývoje systému. V přehledu se vždy zobrazuje jeden finální pracovní čas za zvolené období.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] text-white/40">
            <CalendarDays size={12} /> od {firstWorkDate ? new Date(`${firstWorkDate}T00:00:00`).toLocaleDateString('cs-CZ') : 'prvního záznamu'}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-xl border border-cyan/20 bg-cyan/[.06] p-4"><div className="flex items-center gap-2 text-cyan"><Clock size={14}/><span className="font-mono text-[10px] uppercase tracking-widest">Finální pracovní čas</span></div><p className="mt-3 text-3xl font-light text-white">{recordedHours.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} h</p><p className="mt-1 text-xs text-white/30">jeden výsledný součet práce</p></div>
          <div className="rounded-xl border border-white/8 bg-black/10 p-4"><div className="flex items-center gap-2 text-emerald-300"><CheckCircle2 size={14}/><span className="font-mono text-[10px] uppercase tracking-widest">Dokončeno</span></div><p className="mt-3 text-3xl font-light text-white">{completedWork.length}</p><p className="mt-1 text-xs text-white/30">evidovaných pracovních výstupů</p></div>
          <div className="rounded-xl border border-white/8 bg-black/10 p-4"><div className="flex items-center gap-2 text-violet-300"><Hammer size={14}/><span className="font-mono text-[10px] uppercase tracking-widest">Celkem záznamů</span></div><p className="mt-3 text-3xl font-light text-white">{jakubLogs.length}</p><p className="mt-1 text-xs text-white/30">vývoj · obsah · marketing · integrace</p></div>
          <div className="rounded-xl border border-white/8 bg-black/10 p-4"><div className="flex items-center gap-2 text-amber-300"><CalendarDays size={14}/><span className="font-mono text-[10px] uppercase tracking-widest">Aktivní dny</span></div><p className="mt-3 text-3xl font-light text-white">{recordedDays}</p><p className="mt-1 text-xs text-white/30">dní s evidovanou prací</p></div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
          <div className="overflow-hidden rounded-xl border border-white/8 bg-black/10">
            <div className="flex items-center gap-2 border-b border-white/8 bg-white/[.025] px-4 py-3"><ClipboardCheck size={13} className="text-sky-300"/><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Poslední odvedená práce</p></div>
            <div className="divide-y divide-white/5">{recentWork.length ? recentWork.map((item) => { const time = Number(item.actual_hours) > 0 ? Number(item.actual_hours) : Number(item.estimated_hours) || 0; return <div key={item.id} className="flex items-start justify-between gap-4 px-4 py-3"><div className="min-w-0"><p className="text-sm font-medium text-white/75">{item.title}</p><p className="mt-1 line-clamp-3 text-xs leading-relaxed text-white/35">{item.description}</p><p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-cyan/55">{item.work_date} · {item.area}{item.subtype ? ` · ${item.subtype}` : ''}</p></div><span className="shrink-0 rounded-full border border-cyan/15 bg-cyan/[.05] px-2.5 py-1 font-mono text-[10px] text-cyan">{time > 0 ? `${time.toLocaleString('cs-CZ')} h` : 'čas neuveden'}</span></div>; }) : <p className="px-4 py-5 text-sm text-white/30">Zatím nejsou evidované pracovní záznamy.</p>}</div>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/10 p-4">
            <div className="flex items-center gap-2"><Hammer size={13} className="text-violet-300"/><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Práce podle oblastí</p></div>
            <div className="mt-4 space-y-3">{hoursByArea.length ? hoursByArea.map(([area, stats]) => <div key={area} className="rounded-lg border border-white/7 bg-white/[.025] px-3 py-3"><div className="flex items-center justify-between gap-3"><span className="text-sm capitalize text-white/65">{area}</span><span className="font-mono text-xs text-cyan">{stats.hours > 0 ? `${stats.hours.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} h` : `${stats.tasks} úkolů`}</span></div><p className="mt-1 text-[10px] text-white/25">{stats.tasks} evidovaných změn</p></div>) : <p className="text-sm text-white/30">Bez dat.</p>}</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-violet-300">Týmový workflow</p><h3 className="mt-1 text-lg font-medium text-white">Jakub Duch × Radek Meduna</h3><p className="mt-1 text-xs text-white/35">Aktivní úkoly, předávání, kontrola a stav dokončení v interním administračním systému.</p></div><div className="flex flex-wrap gap-2"><span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 font-mono text-[10px] text-amber-300">{activeTasks.length} aktivních</span><span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 font-mono text-[10px] text-violet-300">{reviewTasks.length} ke kontrole</span><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 font-mono text-[10px] text-emerald-300">{completedTasks.length} hotovo</span></div></div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_280px]">
          <div className="overflow-hidden rounded-xl border border-white/8 bg-black/10"><div className="flex items-center gap-2 border-b border-white/8 px-4 py-3"><ListTodo size={13} className="text-violet-300"/><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Aktuální pracovní fronta</p></div><div className="divide-y divide-white/5">{recentTasks.length ? recentTasks.map(task => <div key={task.id} className="flex items-start justify-between gap-4 px-4 py-3"><div className="min-w-0"><p className="text-sm font-medium text-white/70">{task.title}</p><p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] text-white/25"><span className="inline-flex items-center gap-1"><UserRound size={10}/>{task.assignee_name || task.assignee_email}</span><span>{task.area}</span>{task.due_date ? <span>{task.due_date}</span> : null}</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] ${task.status === 'review' ? 'border-violet-400/20 bg-violet-400/10 text-violet-300' : task.status === 'in_progress' ? 'border-amber-400/20 bg-amber-400/10 text-amber-300' : 'border-sky-400/20 bg-sky-400/10 text-sky-300'}`}>{task.status === 'review' ? 'KONTROLA' : task.status === 'in_progress' ? 'ROZPRACOVÁNO' : 'PLÁN'}</span></div>) : <p className="px-4 py-5 text-sm text-white/25">Bez aktivních úkolů.</p>}</div></div>
          <div className="rounded-xl border border-white/8 bg-black/10 p-4"><div className="flex items-center gap-2"><AlertTriangle size={13} className="text-red-300"/><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Kontrola termínů</p></div><p className="mt-4 text-3xl font-light text-white">{overdueTasks.length}</p><p className="mt-1 text-xs text-white/30">úkolů po termínu</p><p className="mt-4 text-xs leading-relaxed text-white/30">Detailní editace, předání druhému administrátorovi a komunikace jsou v sekci <strong className="text-white/55">Úkoly & tým</strong>.</p></div>
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="p-4 rounded-xl bg-white/3 border border-white/8">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={c.color} />
                <p className="text-xs font-mono text-white/35 tracking-widest uppercase">{c.label}</p>
              </div>
              <p className={`text-2xl font-light ${c.color}`}>{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sessions chart */}
      {analytics?.daily?.length > 0 && (
        <div className="p-4 rounded-xl bg-white/3 border border-white/8">
          <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-4">Návštěvy v čase</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="sessions" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cities */}
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
            <MapPin size={13} className="text-cyan" />
            <p className="text-xs font-mono text-white/30 tracking-widest uppercase">Návštěvy dle měst</p>
          </div>
          <div className="divide-y divide-white/5">
            {(analytics?.cities || []).length === 0 && <p className="text-white/30 text-sm px-4 py-4">Žádná data.</p>}
            {(analytics?.cities || []).map((c) => (
              <div key={c.city} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-white/70">{c.city}</span>
                <span className="text-sm text-cyan font-mono">{c.sessions}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
            <Package size={13} className="text-cyan" />
            <p className="text-xs font-mono text-white/30 tracking-widest uppercase">Nejnavštěvovanější produkty</p>
          </div>
          <div className="divide-y divide-white/5">
            {(analytics?.productClicks || []).length === 0 && <p className="text-white/30 text-sm px-4 py-4">Žádná data.</p>}
            {(analytics?.productClicks || []).map((p) => (
              <div key={p.path} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-white/70 truncate">{productName(p.path)}</span>
                <span className="text-sm text-cyan font-mono">{p.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}