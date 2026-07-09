import React, { useState, useEffect } from 'react';
import { Loader, TrendingUp, MousePointer, Eye, Search, Gauge } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('28');

  useEffect(() => {
    setLoading(true);
    setError(null);
    base44.functions.invoke('getSearchConsoleQueries', { days: parseInt(period) })
      .then(res => setData(res.data))
      .catch(e => setError('Nelze načíst data — zkontrolujte Google Search Console připojení.'))
      .finally(() => setLoading(false));
  }, [period]);

  const queries = data?.rows || [];
  const totals = queries.reduce((acc, r) => ({
    clicks: acc.clicks + (r.clicks || 0),
    impressions: acc.impressions + (r.impressions || 0),
  }), { clicks: 0, impressions: 0 });

  const chartData = queries.slice(0, 10).map(r => ({
    name: r.keys?.[0]?.substring(0, 18) || '',
    clicks: r.clicks || 0,
    impressions: r.impressions || 0,
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">Google Analytics & Search</h2>
        <div className="flex gap-2">
          {[['7', '7 dní'], ['28', '28 dní'], ['90', '90 dní']].map(([val, label]) => (
            <button key={val} onClick={() => setPeriod(val)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${period === val ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
              {label}
            </button>
          ))}
          <a href="https://pagespeed.web.dev/analysis?url=https://mlzidla.cz" target="_blank" rel="noopener noreferrer" aria-label="Otevřít PageSpeed Insights pro mlzidla.cz"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-white/10 text-white/40 hover:text-white/70 transition-all">
            <Gauge size={13} /> PageSpeed Insights
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      ) : (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: MousePointer, label: 'Celkem kliků', value: totals.clicks.toLocaleString(), color: 'text-cyan' },
              { icon: Eye, label: 'Zobrazení', value: totals.impressions.toLocaleString(), color: 'text-blue-400' },
              { icon: TrendingUp, label: 'Avg. CTR', value: totals.impressions > 0 ? `${((totals.clicks / totals.impressions) * 100).toFixed(1)} %` : '—', color: 'text-emerald-400' },
              { icon: Search, label: 'Dotazy', value: queries.length, color: 'text-violet-400' },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-4 rounded-xl bg-white/3 border border-white/8">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className={stat.color} />
                    <p className="text-xs font-mono text-white/35 tracking-widest uppercase">{stat.label}</p>
                  </div>
                  <p className={`text-2xl font-light ${stat.color}`}>{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="p-4 rounded-xl bg-white/3 border border-white/8">
              <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-4">Top 10 dotazů — kliky</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="clicks" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Table */}
          <div className="rounded-xl border border-white/8 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-white/5 text-[10px] font-mono text-white/30 tracking-widest uppercase">
              <span className="col-span-2">Dotaz</span>
              <span className="text-right">Kliky</span>
              <span className="text-right">Zobrazení</span>
            </div>
            <div className="divide-y divide-white/5">
              {queries.slice(0, 20).map((row, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 px-4 py-2.5 hover:bg-white/3 transition-all">
                  <span className="col-span-2 text-sm text-white/70 truncate font-mono">{row.keys?.[0]}</span>
                  <span className="text-sm text-cyan text-right">{row.clicks}</span>
                  <span className="text-sm text-white/40 text-right">{row.impressions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}