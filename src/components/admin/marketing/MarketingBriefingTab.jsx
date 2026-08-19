import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CalendarDays, CheckCircle2, ClipboardCheck, Loader, RefreshCw, Search, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const fmt = (value = 0) => Math.round(Number(value) || 0).toLocaleString('cs-CZ');
const pct = (value = 0) => `${Number(value || 0).toFixed(1).replace('.', ',')} %`;

function dateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateInput(d);
}

function Metric({ icon: Icon, label, value, note, tone = 'text-cyan' }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <div className="flex items-center gap-2">
        <Icon size={14} className={tone} />
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/35">{label}</p>
      </div>
      <p className={`mt-3 text-2xl font-light ${tone}`}>{value}</p>
      {note ? <p className="mt-1 text-xs text-white/30">{note}</p> : null}
    </div>
  );
}

function Status({ label, ok, detail }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <div>
        <p className="text-sm text-white/70">{label}</p>
        {detail ? <p className="mt-0.5 text-xs text-white/30">{detail}</p> : null}
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-mono ${ok ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>
        {ok ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}{ok ? 'aktivní' : 'omezené'}
      </span>
    </div>
  );
}

function BriefList({ items, empty = 'Bez zásadních bodů.' }) {
  if (!items?.length) return <p className="text-sm text-white/30">{empty}</p>;
  return <ul className="space-y-3">{items.map((item, index) => <li key={index} className="text-sm leading-relaxed text-white/65">• {item}</li>)}</ul>;
}

export default function MarketingBriefingTab() {
  const defaultDate = yesterday();
  const [dateFrom, setDateFrom] = useState(defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (from = dateFrom, to = dateTo) => {
    setLoading(true);
    setError('');
    try {
      const response = await base44.functions.invoke('seniorMarketingBriefing', { dateFrom: from, dateTo: to });
      if (response?.data?.error) throw new Error(response.data.error);
      setData(response?.data || null);
    } catch (err) {
      setError(err?.message || 'Briefing se nepodařilo načíst.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(defaultDate, defaultDate); }, []);

  const setPreset = (type) => {
    const end = new Date();
    end.setDate(end.getDate() - 1);
    let start = new Date(end);
    if (type === '7d') start.setDate(start.getDate() - 6);
    if (type === 'month') start = new Date(end.getFullYear(), end.getMonth(), 1);
    const from = dateInput(start);
    const to = dateInput(end);
    setDateFrom(from);
    setDateTo(to);
    load(from, to);
  };

  const ga = data?.ga4 || {};
  const summary = ga?.summary || {};
  const leads = data?.leads || {};
  const work = data?.work || {};
  const narrative = data?.narrative || {};
  const search = data?.search || {};
  const googleAds = data?.googleAds || {};

  const conversion = useMemo(() => {
    const sessions = Number(summary?.sessions || 0);
    return sessions > 0 ? (Number(leads?.total || 0) / sessions) * 100 : 0;
  }, [summary?.sessions, leads?.total]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Senior marketing briefing</p>
          <h3 className="mt-1 text-xl font-medium text-white">Výkon · odvedená práce · priority</h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/35">Manažerský briefing odděluje skutečný výkon webu od zaznamenané práce na produktech, referencích, obsahu, médiích, nabídkách a vizualizacích.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setPreset('yesterday')} className="rounded-full border border-white/10 px-3 py-2 text-[11px] text-white/55 hover:text-white" type="button">Včera</button>
          <button onClick={() => setPreset('7d')} className="rounded-full border border-white/10 px-3 py-2 text-[11px] text-white/55 hover:text-white" type="button">Posledních 7 dní</button>
          <button onClick={() => setPreset('month')} className="rounded-full border border-white/10 px-3 py-2 text-[11px] text-white/55 hover:text-white" type="button">Tento měsíc</button>
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-xs text-white/35">Od<input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => setDateFrom(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan/50" /></label>
            <label className="text-xs text-white/35">Do<input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} className="mt-1.5 block w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan/50" /></label>
          </div>
          <button onClick={() => load()} disabled={loading || !dateFrom || !dateTo} className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-xs font-bold text-slate-950 disabled:opacity-50" type="button">
            {loading ? <Loader size={13} className="animate-spin" /> : <RefreshCw size={13} />} Vytvořit briefing
          </button>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div> : null}
      {loading && !data ? <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/50" /></div> : null}

      {data ? <>
        <div className="rounded-2xl border border-cyan/15 bg-gradient-to-br from-cyan/8 to-white/2 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Executive summary</p><p className="mt-1 text-xs text-white/35">Období {data?.period?.label}</p></div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-mono text-white/45"><CalendarDays size={12} /> generováno z živých dat</span>
          </div>
          <p className="mt-5 max-w-5xl text-lg leading-relaxed text-white/85">{narrative?.executive_summary || 'Briefing neobsahuje dostatek dat pro manažerské shrnutí.'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          <Metric icon={Users} label="Sessions" value={fmt(summary?.sessions)} note={`${fmt(summary?.users)} aktivních uživatelů`} />
          <Metric icon={BarChart3} label="Zobrazení" value={fmt(summary?.views)} note={`${fmt(summary?.newUsers)} nových uživatelů`} tone="text-violet-300" />
          <Metric icon={Target} label="Poptávky" value={fmt(leads?.total)} note={`lead / session ${pct(conversion)}`} tone="text-emerald-300" />
          <Metric icon={TrendingUp} label="Engagement" value={pct(Number(summary?.engagementRate || 0) * 100)} note="GA4 engagement rate" tone="text-amber-300" />
          <Metric icon={ClipboardCheck} label="Odvedená práce" value={fmt(work?.totalChanges)} note="nové + upravené záznamy" tone="text-sky-300" />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-xl border border-white/8 bg-white/3 p-5">
            <div className="flex items-center gap-2 text-sky-300"><ClipboardCheck size={15} /><p className="font-mono text-[10px] uppercase tracking-widest">Odvedená práce</p></div>
            <div className="mt-4"><BriefList items={narrative?.delivered_work} empty="V systému nejsou pro zvolené období zaznamenané změny." /></div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/3 p-5">
            <div className="flex items-center gap-2 text-emerald-300"><TrendingUp size={15} /><p className="font-mono text-[10px] uppercase tracking-widest">Marketingový výkon</p></div>
            <div className="mt-4"><BriefList items={narrative?.performance_readout} /></div>
          </div>
        </div>

        {(work?.activeSections || []).length > 0 ? <div className="rounded-xl border border-white/8 bg-white/3 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Evidence práce podle oblastí</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{work.activeSections.map((section) => <div key={section.entity} className="rounded-xl border border-white/7 bg-black/10 p-4"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-white/75">{section.label}</p><span className="font-mono text-xs text-cyan">{fmt(section.total)}</span></div><p className="mt-1 text-[11px] text-white/30">{section.created} nových · {section.updated} upravených</p><div className="mt-3 space-y-2">{(section.items || []).slice(0, 4).map((item) => <div key={`${section.entity}-${item.id}`} className="text-xs leading-relaxed text-white/45"><span className={item.action === 'created' ? 'text-emerald-300/70' : 'text-amber-300/70'}>{item.action === 'created' ? 'NOVÉ' : 'ÚPRAVA'}</span> · {item.label}</div>)}</div></div>)}</div>
        </div> : null}

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-5">
            <div className="flex items-center gap-2 text-amber-300"><AlertTriangle size={15} /><p className="font-mono text-[10px] uppercase tracking-widest">Rizika a slabá místa</p></div>
            <div className="mt-4"><BriefList items={narrative?.risks} empty="Pro zvolené období briefing nevyhodnotil zásadní riziko." /></div>
          </div>
          <div className="rounded-xl border border-cyan/15 bg-cyan/5 p-5">
            <div className="flex items-center gap-2 text-cyan"><Zap size={15} /><p className="font-mono text-[10px] uppercase tracking-widest">Další doporučené kroky</p></div>
            <ol className="mt-4 space-y-3">{(narrative?.next_actions || []).map((item, index) => <li key={index} className="text-sm leading-relaxed text-white/65"><span className="mr-2 font-mono text-cyan/60">{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_1fr_.85fr]">
          <div className="overflow-hidden rounded-xl border border-white/8"><div className="flex items-center gap-2 bg-white/5 px-4 py-3"><Search size={13} className="text-cyan" /><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Top zdroje</p></div><div className="divide-y divide-white/5">{(ga?.sources || []).slice(0, 6).map((row, index) => <div key={`${row.sourceMedium}-${index}`} className="flex items-center justify-between gap-3 px-4 py-2.5"><span className="truncate text-sm text-white/65">{row.sourceMedium || '—'}</span><span className="font-mono text-xs text-cyan">{fmt(row.sessions)}</span></div>)}{!ga?.sources?.length ? <p className="px-4 py-4 text-sm text-white/25">Bez dat.</p> : null}</div></div>
          <div className="overflow-hidden rounded-xl border border-white/8"><div className="flex items-center gap-2 bg-white/5 px-4 py-3"><BarChart3 size={13} className="text-cyan" /><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Top stránky</p></div><div className="divide-y divide-white/5">{(ga?.pages || []).slice(0, 6).map((row, index) => <div key={`${row.pagePath}-${index}`} className="flex items-center justify-between gap-3 px-4 py-2.5"><span className="truncate text-sm text-white/65">{row.pagePath || '—'}</span><span className="font-mono text-xs text-cyan">{fmt(row.views)}</span></div>)}{!ga?.pages?.length ? <p className="px-4 py-4 text-sm text-white/25">Bez dat.</p> : null}</div></div>
          <div className="rounded-xl border border-white/8 bg-white/3 p-5"><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Stav měření</p><div className="mt-3"><Status label="Google Analytics 4" ok={Boolean(ga?.available)} detail="sessions, engagement, eventy, landing pages" /><Status label="GA4 ↔ Google Ads" ok={Boolean(googleAds?.googleAdsLinked)} detail={googleAds?.customerIds?.[0] ? `Customer ID ${googleAds.customerIds[0]}` : 'stav propojení účtu'} /><Status label="generate_lead Key event" ok={Boolean(googleAds?.generateLeadKeyEvent)} detail="hlavní lead konverze" /><Status label="Search Console" ok={Boolean(search?.available)} detail="organické dotazy a stránky" /></div></div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/3 px-5 py-4 text-sm leading-relaxed text-white/45">{narrative?.conclusion}</div>
      </> : null}
    </div>
  );
}
