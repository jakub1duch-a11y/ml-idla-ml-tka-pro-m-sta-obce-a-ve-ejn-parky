import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, Loader, RefreshCw, Search, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const fmt = (value = 0) => Math.round(Number(value) || 0).toLocaleString('cs-CZ');
const pct = (value = 0) => `${Number(value || 0).toFixed(1).replace('.', ',')} %`;
const money = (value = 0, currency = 'CZK') => {
  try { return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value) || 0); }
  catch { return `${fmt(value)} ${currency}`; }
};

function StatusBadge({ ok, children }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-mono ${ok ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>{children}</span>;
}

function MetricCard({ icon: Icon, label, value, note, tone = 'text-cyan' }) {
  return <div className="rounded-xl border border-white/8 bg-white/3 p-4">
    <div className="flex items-center gap-2"><Icon size={14} className={tone}/><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">{label}</p></div>
    <p className={`mt-3 text-2xl font-light ${tone}`}>{value}</p>
    {note && <p className="mt-1 text-xs text-white/30">{note}</p>}
  </div>;
}

function SimpleTable({ title, rows, leftKey, valueKey, valueLabel = 'Hodnota' }) {
  return <div className="overflow-hidden rounded-xl border border-white/8">
    <div className="flex items-center justify-between bg-white/5 px-4 py-3"><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">{title}</p><span className="text-[10px] text-white/20">{valueLabel}</span></div>
    <div className="divide-y divide-white/5">{(rows || []).slice(0, 8).map((row, index) => <div key={`${row[leftKey]}-${index}`} className="flex items-center justify-between gap-4 px-4 py-2.5"><span className="truncate text-sm text-white/65">{row[leftKey] || '—'}</span><span className="shrink-0 font-mono text-xs text-cyan">{fmt(row[valueKey])}</span></div>)}{(!rows || rows.length === 0) && <p className="px-4 py-4 text-sm text-white/25">Zatím bez dat.</p>}</div>
  </div>;
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const response = await base44.functions.invoke('marketingIntelligence', { sendEmail: false });
      const result = response?.data || response;
      if (result?.error) throw new Error(result.error);
      if (!result?.ok) throw new Error('Server nevrátil platná analytická data.');
      setData(result);
    } catch (e) {
      setError(e?.message || 'Analytická data se nepodařilo načíst.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const conversion = useMemo(() => data?.intelligence?.dbConversion ?? 0, [data]);

  if (loading) return <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-cyan/50"/></div>;
  if (error && !data) return <div className="p-6"><div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">{error}<button onClick={load} className="mt-4 block rounded-lg border border-red-300/20 px-3 py-2 text-xs">Znovu načíst</button></div></div>;

  const ga = data?.ga4 || {};
  const gaReady = ga.available === true && Boolean(ga.property_id);
  const propertyId = (ga.property_id || '').split('/').pop();
  const gaUrl = gaReady ? 'https://analytics.google.com/analytics/web/#/p' + encodeURIComponent(propertyId) + '/reports/intelligenthome' : 'https://analytics.google.com/';
  const accountProblem = ga.account_matches_business === false;
  const sourceWarning = ga.account_email ? 'GA4 účet: ' + ga.account_email : 'Identitu GA4 účtu se nepodařilo ověřit';
  const leads = data?.leads || {};
  const ig = data?.instagram || {};
  const fb = data?.facebook || {};
  const ads = data?.metaAds || {};
  const googleAds = data?.googleAds || {};
  const adsCurrency = ads?.account?.currency || 'CZK';
  const eventCount = (name) => gaReady ? fmt(ga?.eventMap?.[name]?.eventCount || 0) : '—';
  const trendMax = Math.max(1, ...(ga.trend || []).map(d => Number(d.sessions || 0)));
  const funnelRows = [
    {
      title: 'Města a obce · 28 dní',
      rows: [
        ['Landing page', 'funnel_cities_landing_view'],
        ['Konzultace / CTA', 'funnel_cities_consultation_click'],
        ['AI vizualizace', 'funnel_cities_visualizer_click'],
        ['Otevření reference', 'funnel_cities_reference_open'],
        ['Odeslaný lead', 'funnel_cities_lead_submit'],
      ],
    },
    {
      title: 'Architekti · 28 dní',
      rows: [
        ['Landing page', 'funnel_architects_landing_view'],
        ['Konzultace / CTA', 'funnel_architects_consultation_click'],
        ['Projektové podklady', 'funnel_architects_downloads_click'],
        ['Otevření reference', 'funnel_architects_reference_open'],
        ['Odeslaný lead', 'funnel_architects_lead_submit'],
      ],
    },
    {
      title: 'Zahrady a rezidence · 28 dní',
      rows: [
        ['Landing page', 'funnel_residential_landing_view'],
        ['Konzultace / CTA', 'funnel_residential_consultation_click'],
        ['AI vizualizace', 'funnel_residential_visualizer_click'],
        ['Zahradní kolekce', 'funnel_residential_catalog_click'],
        ['Odeslaný lead', 'funnel_residential_lead_submit'],
      ],
    },
  ];

  return <div className="space-y-6 p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">MLŽIDLA.cz · Business Intelligence</p><h2 className="mt-1 text-xl font-medium text-white">Google Analytics 4 · Web · Obchodní výsledky</h2><p className="mt-1 text-xs text-white/45">GA4 návštěvy a události porovnáváme s poptávkami v Base44. Odlišné atribuční modely mohou způsobit rozdíl.</p></div>
      <div className="flex flex-wrap gap-2"><button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white"><RefreshCw size={13}/>Obnovit</button><a href={gaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-xs font-bold text-slate-950">Otevřít Google Analytics ↗</a></div>
    </div>

    <section className="rounded-2xl border border-white/10 bg-[#101b26] p-5">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold text-white">Stav propojení GA4</h3><StatusBadge ok={gaReady}>{gaReady ? 'webový stream nalezen' : 'neověřeno'}</StatusBadge></div>
          <p className="text-xs text-white/50">Web: mlzidla.cz · Property: <span className="font-mono text-white/75">{gaReady ? propertyId : 'nenalezena'}</span></p>
          <p className={'text-xs ' + (accountProblem ? 'text-amber-300' : 'text-white/50')}>{sourceWarning}{accountProblem ? ' · JINÝ účet než obchodní meduna@holmtec.cz' : ''}</p>
          <p className="text-xs text-white/35">Časové pásmo vyhodnocení: Europe/Prague · {data?.generatedAt ? 'Načteno ' + new Date(data.generatedAt).toLocaleString('cs-CZ') : 'Datum načtení není k dispozici'}</p>
        </div>
        <a href="/admin?tab=integrations" className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75">Správa konektorů ↗</a>
      </div>
      {!gaReady && <p role="alert" className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200">GA4 není možné považovat za připojené ke správné property. {ga.error || 'Ověřte přístup do Google Analytics a webový datový stream mlzidla.cz.'} Zobrazené pomlčky znamenají chybějící data, nikoli nulovou návštěvnost.</p>}
      {accountProblem && <p className="mt-3 text-xs text-amber-200">Pro firemní workflow doporučuji udělit přístup ke správné GA4 property účtu meduna@holmtec.cz a následně konektor znovu ověřit. Nynější čtení může fungovat pod jiným účtem.</p>}
    </section>
    {error && <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs text-amber-200">{error}</div>}

    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <MetricCard icon={Users} label="Návštěvy dnes · GA4" value={gaReady ? fmt(ga.today?.sessions) : '—'} note={gaReady ? `včera ${fmt(ga.yesterday?.sessions)}` : 'Bez ověřených GA4 dat'}/>
      <MetricCard icon={Target} label="Poptávky dnes" value={fmt(leads.today)} note={`měsíc ${fmt(leads.month)}`} tone="text-emerald-300"/>
      <MetricCard icon={BarChart3} label="Návštěvy měsíc · GA4" value={gaReady ? fmt(ga.month?.sessions) : '—'} note={gaReady ? `${fmt(ga.month?.users)} aktivních uživatelů` : 'Bez ověřených GA4 dat'} tone="text-violet-300"/>
      <MetricCard icon={TrendingUp} label="Poptávky / návštěvy" value={gaReady && ga.month?.sessions ? pct(conversion) : '—'} note="Poptávky Base44 za měsíc / GA4 sessions" tone="text-amber-300"/>
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <section className="rounded-xl border border-white/10 bg-white/[.03] p-5">
        <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-white">Návštěvnost · posledních 7 dní</h3><span className="text-[11px] text-white/40">GA4 sessions</span></div>
        {gaReady && ga.trend?.length ? <div className="mt-5 flex h-44 items-end justify-around gap-2">
          {ga.trend.map((day, i) => <div key={day.date || i} className="flex h-full flex-1 flex-col justify-end gap-2">
            <span className="text-center font-mono text-[10px] text-white/50">{fmt(day.sessions)}</span>
            <div className="flex h-28 items-end justify-center"><div title={`${day.date}: ${fmt(day.sessions)} sessions`} className="w-full max-w-12 rounded-t-md bg-cyan/70" style={{height: Math.max(3, Number(day.sessions || 0) / trendMax * 100) + '%'}} /></div>
            <span className="text-center font-mono text-[10px] text-white/40">{day.date ? day.date.slice(6,8) + '.' + day.date.slice(4,6) + '.' : '—'}</span>
          </div>)}
        </div> : <p className="mt-6 text-sm text-white/35">Časová řada není dostupná.</p>}
      </section>
      <section className="rounded-xl border border-white/10 bg-white/[.03] p-5">
        <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-white">Zařízení návštěvníků</h3><span className="text-[11px] text-white/40">GA4 · 28 dní</span></div>
        <div className="mt-5 space-y-3">
          {gaReady && ga.devices?.length ? ga.devices.map((d,i) => <div key={d.deviceCategory || i} className="space-y-1">
            <div className="flex justify-between gap-3 text-xs"><span className="capitalize text-white/65">{d.deviceCategory}</span><span className="font-mono text-cyan">{fmt(d.sessions)} návštěv</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan/70" style={{width: Math.min(100, Math.max(0, Number(d.sessions||0)/(ga.devices.reduce((n,x)=>n+Number(x.sessions||0),0)||1)*100))+'%'}} /></div>
          </div>) : <p className="text-sm text-white/35">Údaje o zařízeních nejsou dostupné.</p>}
        </div>
      </section>
    </div>

    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border border-white/8 bg-white/3 p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">Google Ads / GA4</p><StatusBadge ok={googleAds.generateLeadKeyEvent && googleAds.googleAdsLinked}>{googleAds.generateLeadKeyEvent && googleAds.googleAdsLinked ? 'připraveno' : 'dokončit'}</StatusBadge></div><div className="mt-5 space-y-2 text-xs text-white/45"><p>generate_lead Key event: <strong className={googleAds.generateLeadKeyEvent ? 'text-emerald-300' : 'text-amber-300'}>{googleAds.generateLeadKeyEvent ? 'ano' : 'ne'}</strong></p><p>GA4 ↔ Google Ads: <strong className={googleAds.googleAdsLinked ? 'text-emerald-300' : 'text-amber-300'}>{googleAds.googleAdsLinked ? 'propojeno' : 'nepropojeno'}</strong></p>{googleAds.googleAdsLinks?.[0]?.customerId && <p>Customer ID: <span className="font-mono text-white/65">{googleAds.googleAdsLinks[0].customerId}</span></p>}</div>{!googleAds.generateLeadKeyEvent && <p className="mt-3 text-[11px] text-amber-300">Konverzní událost lze nastavit až po ověření účtu a výslovném schválení správce.</p>}</div>
      <div className="rounded-xl border border-white/8 bg-white/3 p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">Instagram @mlzidla</p><StatusBadge ok={ig.available}>{ig.available ? 'aktivní' : 'čeká na práva'}</StatusBadge></div>{ig.available ? <><p className="mt-5 text-3xl font-light text-white">{fmt(ig.followers)}</p><p className="text-xs text-white/35">followers · odhad engagement {pct(ig.avgEngagement)}</p><p className="mt-4 text-xs text-white/45">Insights: {ig.insightsEnabled ? 'aktivní' : 'vyžaduje manage_insights scope'}</p></> : <p className="mt-5 text-sm leading-relaxed text-white/35">Po rozšíření oprávnění se doplní reach, interactions a top příspěvky.</p>}</div>
      <div className="rounded-xl border border-white/8 bg-white/3 p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">Facebook Pages</p><StatusBadge ok={fb.available}>{fb.available ? 'aktivní' : 'nepřipojeno'}</StatusBadge></div>{fb.available ? <><p className="mt-5 text-3xl font-light text-white">{fmt(fb.followers)}</p><p className="text-xs text-white/35">followers · {fb.name}</p></> : <p className="mt-5 text-sm leading-relaxed text-white/35">Po autorizaci se sem načtou nejlepší organické příspěvky a engagement.</p>}</div>
      <div className="rounded-xl border border-white/8 bg-white/3 p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">Meta Ads · 7 dní</p><StatusBadge ok={ads.available}>{ads.available ? 'aktivní' : 'nepřipojeno'}</StatusBadge></div>{ads.available ? <><p className="mt-5 text-3xl font-light text-white">{money(ads.total?.spend, adsCurrency)}</p><p className="text-xs text-white/35">CTR {pct(ads.total?.ctr)} · CPC {money(ads.total?.cpc, adsCurrency)} · leady {fmt(ads.total?.leads)} · CPL {ads.total?.leads ? money(ads.total?.cpl, adsCurrency) : '—'}</p></> : <p className="mt-5 text-sm leading-relaxed text-white/35">Po autorizaci se doplní spend, CTR, CPC, leady a CPL po kampaních.</p>}</div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
      <span>GA4 události za 28 dní · pokud událost nebyla zaznamenána, zobrazí se 0; při nedostupné GA4 pomlčka.</span>
      <span>Report je pouze ke čtení; žádné nastavení Ads ani e-mail se neodesílá automaticky.</span>
    </div>
    <div className="grid gap-5 xl:grid-cols-3">
      {funnelRows.map((funnel) => <div key={funnel.title} className="overflow-hidden rounded-xl border border-white/8 bg-white/3"><div className="flex items-center justify-between bg-white/5 px-4 py-3"><p className="font-mono text-[10px] uppercase tracking-widest text-white/45">{funnel.title}</p><span className="text-[10px] text-white/25">GA4 funnel</span></div><div className="divide-y divide-white/5">{funnel.rows.map(([label, eventName], index) => <div key={eventName} className="grid grid-cols-[34px_1fr_auto] items-center gap-3 px-4 py-3"><span className="font-mono text-[10px] text-white/20">{String(index + 1).padStart(2, '0')}</span><span className="text-sm text-white/65">{label}</span><span className="font-mono text-xs text-cyan">{eventCount(eventName)}</span></div>)}</div></div>)}
    </div>

    <div className="grid gap-5 xl:grid-cols-2">
      <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-5"><div className="flex items-center gap-2 text-emerald-300"><CheckCircle2 size={15}/><p className="font-mono text-[10px] uppercase tracking-widest">Úspěchy</p></div><ul className="mt-4 space-y-3">{(data?.intelligence?.wins || []).map((item, i) => <li key={i} className="text-sm leading-relaxed text-white/65">• {item}</li>)}{!data?.intelligence?.wins?.length && <li className="text-sm text-white/30">Je potřeba nasbírat další data.</li>}</ul></div>
      <div className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-5"><div className="flex items-center gap-2 text-amber-300"><Zap size={15}/><p className="font-mono text-[10px] uppercase tracking-widest">Doporučení</p></div><ol className="mt-4 space-y-3">{(data?.intelligence?.recommendations || []).map((item, i) => <li key={i} className="text-sm leading-relaxed text-white/65"><span className="mr-2 font-mono text-amber-300/70">{String(i + 1).padStart(2, '0')}</span>{item}</li>)}</ol></div>
    </div>

    <div className="grid gap-5 xl:grid-cols-2"><SimpleTable title="Top zdroje · 28 dní" rows={ga.sources} leftKey="sourceMedium" valueKey="sessions" valueLabel="sessions"/><SimpleTable title="Top stránky · 28 dní" rows={ga.pages} leftKey="pagePath" valueKey="views" valueLabel="views"/></div>

    <div className="grid gap-5 xl:grid-cols-2"><SimpleTable title="GA4 měřené události" rows={ga.events} leftKey="eventName" valueKey="eventCount" valueLabel="event count"/><div className="overflow-hidden rounded-xl border border-white/8"><div className="flex items-center gap-2 bg-white/5 px-4 py-3"><Search size={13} className="text-cyan"/><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Search Console · top dotazy</p></div><div className="divide-y divide-white/5">{(data?.search?.queries || []).slice(0, 8).map((q, i) => <div key={`${q.key}-${i}`} className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 text-xs"><span className="truncate text-white/65">{q.key}</span><span className="font-mono text-cyan">{fmt(q.clicks)} kliků</span><span className="font-mono text-white/30">poz. {Number(q.position || 0).toFixed(1)}</span></div>)}{!data?.search?.queries?.length && <p className="px-4 py-4 text-sm text-white/25">Zatím bez dat.</p>}</div></div></div>
  </div>;
}
