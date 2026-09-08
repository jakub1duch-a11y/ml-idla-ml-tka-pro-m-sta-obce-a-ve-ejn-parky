import React, { useMemo, useState, useEffect } from 'react';
import { Loader, Eye, Users, Play, MousePointerClick, BarChart3, ImageIcon, TrendingUp, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const fmt = (v = 0) => Number(v || 0).toLocaleString('cs-CZ');
const pct = (v = 0) => `${Number(v || 0).toFixed(1).replace('.', ',')} %`;

const CATEGORY_LABELS = {
  mestsky: 'Městský',
  event: 'Event',
  soukromy: 'Soukromý',
  prumyslovy: 'Průmysl',
};

// Canonical slug map matching ReferenceDetail.jsx
const CANONICAL_BY_ID = {
  '6a42491409abbf575447aaeb': 'mlzitka-pro-zoo-praha',
  '6a480e05664f948152611f5f': 'mlzitko-mrak-materska-skola-siskova',
  '6a480c0da87022c6c9559115': 'mlzitko-aura-domov-palata-praha-5',
  '6a72947ef1579cba611a2f6b': 'mlzitko-mrak-soukroma-zahrada',
  '6a71d1ff57598752eed27bfb': 'bendy-jicinske-namesti',
  '6a6b8d1d553d8991f46cd6a3': 'mestska-mlzna-brana-gate',
  '6a450e035aef0b45b2a8728f': 'mesto-polna-mlzitko-mrkev',
};

export default function AdminReferenceAnalytics() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('28');

  useEffect(() => {
    setLoading(true); setError(null);
    Promise.all([
      base44.functions.invoke('getAnalyticsData', { days: parseInt(period) }),
      base44.entities.Realizace.list('-created_date', 100),
    ])
      .then(([analyticsRes, references]) => {
        const clicks = analyticsRes.data?.referenceClicks || [];
        const engagement = analyticsRes.data?.referenceEngagement || [];
        const eventByPaths = Object.fromEntries(engagement.map(x => [x.path, x]));

        // Build lookup: both /reference/<slug> (canonical) and /reference/<id> (raw)
        const refBySlug = {};
        const refById = {};
        references.forEach(r => {
          const slug = CANONICAL_BY_ID[r.id];
          if (slug) refBySlug[slug] = r;
          refById[r.id] = r;
        });

        const merged = clicks.map(c => {
          const segment = c.path.replace('/reference/', '').split('?')[0];
          // Try canonical slug first, then raw ID
          const ref = refBySlug[segment] || refById[segment];
          const e = eventByPaths[c.path] || eventByPaths[`/reference/${segment}`] || {};
          const intent = Number(e.cta_click || 0) + Number(e.phone_click || 0) + Number(e.email_click || 0) + Number(e.form_start || 0) + Number(e.generate_lead || 0);
          const video = Number(e.video_start || 0);
          const sectionViews = Number(e.section_view || 0);
          const engagementRate = c.views ? (intent / c.views) * 100 : 0;
          return {
            path: c.path,
            segment,
            name: ref?.name || segment,
            image: ref?.image_url,
            location: ref?.location,
            category: ref?.category,
            year: ref?.year,
            refId: ref?.id,
            views: Number(c.views || 0),
            users: Number(c.users || 0),
            referenceView: Number(e.reference_view || 0),
            intent,
            video,
            videoComplete: Number(e.video_complete || 0),
            sectionViews,
            engagementRate,
          };
        });
        setRows(merged.sort((a, b) => b.views - a.views));
      })
      .catch(() => setError('Nelze načíst data o realizacích. Zkontrolujte připojení Google Analytics a oprávnění Data API.'))
      .finally(() => setLoading(false));
  }, [period]);

  const totals = useMemo(() =>
    rows.reduce((a, r) => ({
      views: a.views + r.views,
      users: a.users + r.users,
      intent: a.intent + r.intent,
      video: a.video + r.video,
      referenceView: a.referenceView + r.referenceView,
    }), { views: 0, users: 0, intent: 0, video: 0, referenceView: 0 }),
  [rows]);

  const chartData = rows.slice(0, 10).map(r => ({
    name: r.name.length > 18 ? `${r.name.slice(0, 18)}…` : r.name,
    views: r.views,
    intent: r.intent,
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Reference intelligence</p>
          <h2 className="mt-1 text-xl font-medium text-white">Návštěvnost realizací · zájem · video</h2>
          <p className="mt-1 text-xs text-white/35">GA4 zobrazení stránek realizací spojená s událostmi — vidíte, které projekty lidé nejvíce prohlížejí a kde konvertují.</p>
        </div>
        <div className="flex gap-2">
          {[['7', '7 dní'], ['28', '28 dní'], ['90', '90 dní']].map(([v, l]) => (
            <button key={v} onClick={() => setPeriod(v)} className={`rounded-full px-3 py-1.5 text-xs font-mono ${period === v ? 'bg-cyan text-slate-950' : 'border border-white/10 text-white/40 hover:text-white'}`}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-cyan/40" /></div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
            <Metric icon={Eye} label="Zobrazení realizací" value={fmt(totals.views)} tone="text-cyan" />
            <Metric icon={Users} label="Uživatelé" value={fmt(totals.users)} tone="text-violet-300" />
            <Metric icon={ImageIcon} label="Reference view event" value={fmt(totals.referenceView)} tone="text-teal-300" />
            <Metric icon={MousePointerClick} label="Akce se záměrem" value={fmt(totals.intent)} note={totals.views ? pct((totals.intent / totals.views) * 100) : ''} tone="text-amber-300" />
            <Metric icon={Play} label="Spuštění videa" value={fmt(totals.video)} tone="text-sky-300" />
          </div>

          {chartData.length > 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/35"><BarChart3 size={12} /> Top realizace podle návštěvnosti</p>
                <span className="text-[10px] text-white/20">cyan = views · amber = intent</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
                  <XAxis dataKey="name" angle={-18} textAnchor="end" interval={0} tick={{ fill: 'rgba(255,255,255,.35)', fontSize: 9 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,.3)', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: '#fff' }} />
                  <Bar dataKey="views" fill="#22d3ee" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="intent" fill="#f59e0b" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[.02]">
            <div className="grid grid-cols-[minmax(220px,1.6fr)_repeat(6,minmax(70px,.55fr))] gap-3 bg-white/5 px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-white/30">
              <span>Realizace</span>
              <span className="text-right">Views</span>
              <span className="text-right">Users</span>
              <span className="text-right">Ref view</span>
              <span className="text-right">Intent</span>
              <span className="text-right">Video</span>
              <span className="text-right">Engagement</span>
            </div>
            <div className="divide-y divide-white/5">
              {rows.length ? rows.map((r, i) => (
                <div key={r.path} className="grid grid-cols-[minmax(220px,1.6fr)_repeat(6,minmax(70px,.55fr))] items-center gap-3 px-4 py-3 hover:bg-white/[.025]">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-5 font-mono text-[10px] text-white/20">{String(i + 1).padStart(2, '0')}</span>
                    {r.image ? <img src={r.image} alt="" className="h-9 w-9 rounded-lg object-cover" /> : <div className="h-9 w-9 rounded-lg bg-white/5" />}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/70">{r.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/25">
                        {r.location && <><MapPin size={9} /> {r.location}</>}
                        {r.category && <span className="text-cyan/40">{CATEGORY_LABELS[r.category] || r.category}</span>}
                      </p>
                    </div>
                  </div>
                  <Cell>{fmt(r.views)}</Cell>
                  <Cell>{fmt(r.users)}</Cell>
                  <Cell tone="text-teal-300">{fmt(r.referenceView)}</Cell>
                  <Cell tone="text-amber-300">{fmt(r.intent)}</Cell>
                  <Cell tone="text-sky-300">{fmt(r.video)}</Cell>
                  <Cell tone="text-emerald-300">{pct(r.engagementRate)}</Cell>
                </div>
              )) : <p className="px-4 py-10 text-center text-sm text-white/25">Žádná data o realizacích za vybrané období.</p>}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Info icon={TrendingUp} title="Jak číst intent" text="Součet CTA, telefonu, e-mailu, startu formuláře a lead eventů na stránce realizace. Ukazuje, které projekty nejvíce motivují návštěvníky k akci." />
            <Info icon={Play} title="Video engagement" text="Sleduje video_start a video_complete na realizacích s video ukázkou. Můžete porovnat, které realizace s videem generují hlubší zájem." />
            <Info icon={Eye} title="Reference view event" text="Kromě pageview posílá každá realizace i custom event reference_view s názvem a kategorií — díky tomu lze v GA4 přímo filtrovat projekty bez ohledu na URL." />
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value, note, tone }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <Icon size={14} className={tone} />
      <p className={`mt-3 text-2xl font-light ${tone}`}>{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/30">{label}</p>
      {note ? <p className="mt-1 text-[10px] text-white/20">{note}</p> : null}
    </div>
  );
}
function Cell({ children, tone = 'text-cyan' }) { return <span className={`text-right font-mono text-xs ${tone}`}>{children}</span>; }
function Info({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <div className="flex items-center gap-2"><Icon size={13} className="text-cyan" /><p className="text-sm font-medium text-white/65">{title}</p></div>
      <p className="mt-2 text-xs leading-relaxed text-white/35">{text}</p>
    </div>
  );
}