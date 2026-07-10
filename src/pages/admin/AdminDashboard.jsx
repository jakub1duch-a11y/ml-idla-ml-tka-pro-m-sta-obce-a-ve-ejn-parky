import React, { useState, useEffect } from 'react';
import { Loader, Users, MousePointerClick, Clock, MapPin, Package, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      base44.functions.invoke('getAnalyticsData', { days: 28 }),
      base44.functions.invoke('getSearchConsoleQueries', { days: 28 }),
      base44.entities.Product.list(),
    ])
      .then(([a, s, p]) => {
        setAnalytics(a.data);
        setSearch(s.data);
        setProducts(p);
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

  const cards = [
    { icon: Users, label: 'Návštěvy (28 dní)', value: totals.sessions.toLocaleString(), color: 'text-cyan' },
    { icon: MousePointerClick, label: 'Konverze', value: `${inquiries} (${conversionRate} %)`, color: 'text-emerald-400' },
    { icon: Clock, label: 'Doba na uživatele', value: formatDuration(analytics?.avgSessionDuration), color: 'text-violet-400' },
    { icon: Search, label: 'Průměrná pozice', value: avgPosition, color: 'text-amber-400' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-white text-lg font-medium">Přehled</h2>

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