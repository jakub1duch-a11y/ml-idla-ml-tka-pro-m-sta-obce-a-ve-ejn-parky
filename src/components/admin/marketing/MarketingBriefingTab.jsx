import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, Loader, RefreshCw, Search, Target, Users, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const fmt = (value = 0) => Math.round(Number(value) || 0).toLocaleString('cs-CZ');
const pct = (value = 0) => `${Number(value || 0).toFixed(1).replace('.', ',')} %`;

function Metric({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-cyan" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/35">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-light text-white">{value}</p>
      {note ? <p className="mt-1 text-xs text-white/30">{note}</p> : null}
    </div>
  );
}

function SourceStatus({ label, ok, detail }) {
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

export default function MarketingBriefingTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await base44.functions.invoke('marketingIntelligence', { sendEmail: false });
      if (response?.data?.error) throw new Error(response.data.error);
      setData(response?.data || null);
    } catch (err) {
      setError(err?.message || 'Briefing se nepodařilo načíst.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const ga = data?.ga4 || {};
  const leads = data?.leads || {};
  const search = data?.search || {};
  const googleAds = data?.googleAds || {};
  const instagram = data?.instagram || {};
  const facebook = data?.facebook || {};
  const metaAds = data?.metaAds || {};
  const intelligence = data?.intelligence || {};

  const conversion = useMemo(() => {
    const sessions = Number(ga?.month?.sessions || 0);
    return sessions > 0 ? (Number(leads?.month || 0) / sessions) * 100 : 0;
  }, [ga?.month?.sessions, leads?.month]);

  if (loading) return <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/50" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Denní briefing</p>
          <h3 className="mt-1 text-xl font-medium text-white">GA4 · Search · leady · Ads · social</h3>
          <p className="mt-1 text-xs text-white/35">Živý přehled používá stejný datový zdroj jako denní analytický report.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white">
          <RefreshCw size={13} /> Obnovit data
        </button>
      </div>

      {error ? <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div> : null}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Metric icon={Users} label="Návštěvy dnes" value={fmt(ga?.today?.sessions)} note={`včera ${fmt(ga?.yesterday?.sessions)}`} />
        <Metric icon={BarChart3} label="Uživatelé včera" value={fmt(ga?.yesterday?.users)} note={`${fmt(ga?.yesterday?.newUsers)} nových`} />
        <Metric icon={Target} label="Poptávky měsíc" value={fmt(leads?.month)} note={`konverze ${pct(conversion)}`} />
        <Metric icon={Zap} label="GA4 engagement" value={pct(Number(ga?.yesterday?.engagementRate || 0) * 100)} note="předchozí kalendářní den" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-xl border border-white/8 bg-white/3 p-5">
          <div className="flex items-center gap-2 text-emerald-300"><CheckCircle2 size={15} /><p className="font-mono text-[10px] uppercase tracking-widest">Co briefing doporučuje</p></div>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/35">Pozitiva</p>
              <ul className="space-y-3">{(intelligence?.wins || []).map((item, index) => <li key={index} className="text-sm leading-relaxed text-white/65">• {item}</li>)}{!intelligence?.wins?.length ? <li className="text-sm text-white/30">Zatím bez dostatečných dat.</li> : null}</ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/35">Priority</p>
              <ol className="space-y-3">{(intelligence?.recommendations || []).map((item, index) => <li key={index} className="text-sm leading-relaxed text-white/65"><span className="mr-2 font-mono text-amber-300/70">{String(index + 1).padStart(2, '0')}</span>{item}</li>)}{!intelligence?.recommendations?.length ? <li className="text-sm text-white/30">Bez urgentního zásahu.</li> : null}</ol>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/3 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Stav datových zdrojů</p>
          <div className="mt-3">
            <SourceStatus label="Google Analytics 4" ok={Boolean(ga?.today || ga?.yesterday)} detail="návštěvnost, engagement, stránky, eventy" />
            <SourceStatus label="GA4 ↔ Google Ads" ok={Boolean(googleAds?.googleAdsLinked)} detail={googleAds?.googleAdsLinks?.[0]?.customerId ? `Customer ID ${googleAds.googleAdsLinks[0].customerId}` : 'ověření propojení účtu'} />
            <SourceStatus label="generate_lead Key event" ok={Boolean(googleAds?.generateLeadKeyEvent)} detail={googleAds?.keyEventCreated ? 'vytvořen při tomto načtení' : 'stav konverzního eventu'} />
            <SourceStatus label="Search Console" ok={Boolean(search?.available)} detail="organické dotazy a stránky" />
            <SourceStatus label="Instagram" ok={Boolean(instagram?.available)} detail={instagram?.available ? `@${instagram.username || 'mlzidla'}` : 'omezené oprávnění nebo zdroj'} />
            <SourceStatus label="Facebook" ok={Boolean(facebook?.available)} detail="organické příspěvky" />
            <SourceStatus label="Meta Ads" ok={Boolean(metaAds?.available)} detail="spend, CTR, CPC, leady" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/8">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-3"><Search size={13} className="text-cyan" /><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Top zdroje · 28 dní</p></div>
          <div className="divide-y divide-white/5">{(ga?.sources || []).slice(0, 6).map((row, index) => <div key={`${row.sourceMedium}-${index}`} className="flex items-center justify-between gap-3 px-4 py-2.5"><span className="truncate text-sm text-white/65">{row.sourceMedium || '—'}</span><span className="font-mono text-xs text-cyan">{fmt(row.sessions)}</span></div>)}{!ga?.sources?.length ? <p className="px-4 py-4 text-sm text-white/25">Zatím bez dat.</p> : null}</div>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/8">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-3"><BarChart3 size={13} className="text-cyan" /><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Top stránky · 28 dní</p></div>
          <div className="divide-y divide-white/5">{(ga?.pages || []).slice(0, 6).map((row, index) => <div key={`${row.pagePath}-${index}`} className="flex items-center justify-between gap-3 px-4 py-2.5"><span className="truncate text-sm text-white/65">{row.pagePath || '—'}</span><span className="font-mono text-xs text-cyan">{fmt(row.views)}</span></div>)}{!ga?.pages?.length ? <p className="px-4 py-4 text-sm text-white/25">Zatím bez dat.</p> : null}</div>
        </div>
      </div>
    </div>
  );
}
