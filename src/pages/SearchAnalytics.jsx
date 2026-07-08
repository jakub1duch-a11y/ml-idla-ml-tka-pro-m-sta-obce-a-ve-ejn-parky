import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Search, MousePointer, Eye, ArrowUpDown } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const PERIOD_OPTIONS = [
{ label: '7 dní', value: 7 },
{ label: '28 dní', value: 28 },
{ label: '90 dní', value: 90 }];


const StatCard = ({ icon: Icon, label, value, sub }) =>
<div className="bg-card_bg border border-white/10 rounded-2xl p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
        <Icon size={16} className="text-cyan" />
      </div>
      <p className="text-xs font-mono text-white/40 tracking-widest uppercase">{label}</p>
    </div>
    <p className="text-3xl font-light text-white">{value}</p>
    {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
  </div>;


export default function SearchAnalytics() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(28);
  const [sortBy, setSortBy] = useState('clicks');
  const [meta, setMeta] = useState({});

  const fetchData = async (d) => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('getSearchConsoleQueries', { days: d });
      setRows(res.data.rows || []);
      setMeta({ startDate: res.data.startDate, endDate: res.data.endDate });
    } catch (e) {
      setError(e.message || 'Nepodařilo se načíst data ze Search Console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSEO({ title: 'Analýza vyhledávání', robots: 'noindex, nofollow' });
  }, []);

  useEffect(() => {fetchData(days);}, [days]);

  const sorted = [...rows].sort((a, b) => b[sortBy] - a[sortBy]);
  const top10 = sorted.slice(0, 10);

  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
  const totalImpressions = rows.reduce((s, r) => s + r.impressions, 0);
  const avgCtr = rows.length ? (rows.reduce((s, r) => s + r.ctr, 0) / rows.length).toFixed(1) : 0;
  const avgPos = rows.length ? (rows.reduce((s, r) => s + r.position, 0) / rows.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[hsl(var(--card))]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-[hsl(var(--popover))] bg-[hsl(var(--card))]">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono tracking-widest uppercase mb-3 text-xs text-[hsl(var(--primary))]">GOOGLE SEARCH CONSOLE</p>
          <h1 className="font-heading font-light tracking-tight mb-2 text-[hsl(var(--popover))] text-2xl">Analýza vyhledávacích dotazů

          </h1>
          <p className="text-sm text-[hsl(var(--popover))]">
            {meta.startDate && meta.endDate ? `${meta.startDate} — ${meta.endDate}` : 'holmtec.cz'}
          </p>
        </div>

        {/* Period selector */}
        <div className="flex gap-2 mb-8">
          {PERIOD_OPTIONS.map((o) =>
          <button key={o.value} onClick={() => setDays(o.value)}
          className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all ${
          days === o.value ? 'bg-cyan text-ink font-bold' : 'bg-white/5 text-white/40 hover:bg-white/10'}`
          }>
              {o.label}
            </button>
          )}
        </div>

        {loading &&
        <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        }

        {error &&
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        }

        {!loading && !error &&
        <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard icon={MousePointer} label="Celkem kliků" value={totalClicks.toLocaleString('cs-CZ')} />
              <StatCard icon={Eye} label="Zobrazení" value={totalImpressions.toLocaleString('cs-CZ')} />
              <StatCard icon={TrendingUp} label="Průměrné CTR" value={`${avgCtr} %`} />
              <StatCard icon={Search} label="Průměrná pozice" value={avgPos} sub="nižší = lepší" />
            </div>

            {/* Bar chart — top 10 by clicks */}
            <div className="bg-card_bg border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-6">Top 10 dotazů — kliky</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={top10} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="query" width={200} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                  contentStyle={{ background: '#131c27', border: '1px solid #1e2a3a', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }}
                  cursor={{ fill: 'rgba(34,211,238,0.05)' }} />
                
                  <Bar dataKey="clicks" radius={4}>
                    {top10.map((_, i) => <Cell key={i} fill={i === 0 ? '#22d3ee' : `rgba(34,211,238,${0.6 - i * 0.05})`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Full table */}
            <div className="bg-card_bg border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <p className="text-xs font-mono text-white/40 tracking-widest uppercase">Všechny dotazy ({rows.length})</p>
                <div className="flex gap-2">
                  {['clicks', 'impressions', 'ctr', 'position'].map((k) =>
                <button key={k} onClick={() => setSortBy(k)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1 ${
                sortBy === k ? 'bg-cyan/20 text-cyan' : 'text-white/30 hover:text-white/60'}`
                }>
                      {k} {sortBy === k && <ArrowUpDown size={10} />}
                    </button>
                )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">#</th>
                      <th className="text-left px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">Dotaz</th>
                      <th className="text-right px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">Kliky</th>
                      <th className="text-right px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">Zobrazení</th>
                      <th className="text-right px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">CTR %</th>
                      <th className="text-right px-6 py-3 text-xs font-mono text-white/30 uppercase tracking-widest">Pozice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((r, i) =>
                  <tr key={r.query} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3 text-white/20 font-mono text-xs">{i + 1}</td>
                        <td className="px-6 py-3 text-white font-light max-w-xs truncate">{r.query}</td>
                        <td className="px-6 py-3 text-right text-cyan font-mono">{r.clicks}</td>
                        <td className="px-6 py-3 text-right text-white/50 font-mono">{r.impressions}</td>
                        <td className="px-6 py-3 text-right text-white/50 font-mono">{r.ctr}%</td>
                        <td className={`px-6 py-3 text-right font-mono ${r.position <= 3 ? 'text-emerald-400' : r.position <= 10 ? 'text-yellow-400' : 'text-white/30'}`}>
                          {r.position}
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        }
      </div>
    </div>);

}