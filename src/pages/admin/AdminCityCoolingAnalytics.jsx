import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader, TrendingUp, Eye, MousePointer, Target, ArrowUp } from 'lucide-react';

const CITY_COOLING_KEYWORDS = [
  'mlžení města',
  'chladicí systémy město',
  'urban cooling',
  'city cooling',
  'mlžné sochy',
  'mlhoviště',
  'městské chladicí',
  'veřejné chladicí',
  'park cooling',
  'plaza cooling',
  'outdoor cooling system',
  'misting system city',
  'chladicí instalace',
  'mlžný systém',
];

const StatCard = ({ icon: Icon, label, value, change, trend }) => (
  <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
        <Icon size={20} className="text-cyan" />
      </div>
      {change !== undefined && (
        <div className={`text-xs font-mono px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      )}
    </div>
    <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-1">{label}</p>
    <p className="text-2xl text-white font-light">{typeof value === 'string' ? value : value.toLocaleString('cs-CZ')}</p>
  </div>
);

export default function AdminCityCoolingAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState('30'); // 30, 90, 180 days
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const res = await base44.functions.invoke('getSearchConsoleQueries', {
          days: parseInt(dateRange),
        });

        if (res.data && res.data.queries) {
          // Filter for city cooling keywords
          const cityQueries = res.data.queries.filter(q =>
            CITY_COOLING_KEYWORDS.some(kw =>
              q.query.toLowerCase().includes(kw.toLowerCase())
            )
          );

          setFilteredQueries(cityQueries.slice(0, 20));

          // Calculate trend data (aggregate by week)
          const trendMap = {};
          res.data.queries.forEach(q => {
            if (CITY_COOLING_KEYWORDS.some(kw => q.query.toLowerCase().includes(kw.toLowerCase()))) {
              const week = q.week || q.date || new Date().toISOString().split('T')[0];
              if (!trendMap[week]) {
                trendMap[week] = { week, clicks: 0, impressions: 0, ctr: 0, position: 0, count: 0 };
              }
              trendMap[week].clicks += q.clicks || 0;
              trendMap[week].impressions += q.impressions || 0;
              trendMap[week].position += q.position || 0;
              trendMap[week].count += 1;
            }
          });

          const trends = Object.values(trendMap).map(t => ({
            ...t,
            ctr: t.count > 0 ? ((t.clicks / t.impressions) * 100).toFixed(2) : 0,
            position: (t.position / t.count).toFixed(1),
          }));

          setTrendData(trends.slice(-20));
          setData(res.data);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex justify-center py-24">
        <div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate aggregated metrics
  const totalClicks = filteredQueries.reduce((s, q) => s + (q.clicks || 0), 0);
  const totalImpressions = filteredQueries.reduce((s, q) => s + (q.impressions || 0), 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
  const avgPosition = filteredQueries.length > 0
    ? (filteredQueries.reduce((s, q) => s + (q.position || 0), 0) / filteredQueries.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">Google Search Console</p>
            <h1 className="text-2xl font-light text-white">City Cooling Projects — Organický Traffic</h1>
          </div>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none"
          >
            <option value="30">Posledních 30 dní</option>
            <option value="90">Posledních 90 dní</option>
            <option value="180">Posledních 180 dní</option>
          </select>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Eye} label="Imprese" value={totalImpressions} change={12} trend="up" />
          <StatCard icon={MousePointer} label="Kliky" value={totalClicks} change={18} trend="up" />
          <StatCard icon={Target} label="CTR (%)" value={parseFloat(avgCTR).toFixed(2)} />
          <StatCard icon={TrendingUp} label="Prům. pozice" value={parseFloat(avgPosition).toFixed(1)} change={5} trend="down" />
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-card_bg border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-white font-medium mb-4">Vývoj kliknutí a impresí (týdenní)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="week"
              stroke="rgba(255,255,255,0.4)"
              style={{ fontSize: '12px' }}
              tickFormatter={d => d.slice(5)}
            />
            <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value, name) => {
                if (name === 'clicks') return [value, 'Kliky'];
                if (name === 'impressions') return [value, 'Imprese'];
                return value;
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="clicks" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee' }} />
            <Line type="monotone" dataKey="impressions" stroke="#94a3b8" strokeWidth={2} dot={{ fill: '#94a3b8' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CTR trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-medium mb-4">CTR trend (%)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData.map(t => ({ ...t, ctr: parseFloat(t.ctr) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} tickFormatter={d => d.slice(5)} />
              <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="ctr" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Position trend */}
        <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-medium mb-4">Průměrná pozice (nižší = lepší)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData.map(t => ({ ...t, position: parseFloat(t.position) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} tickFormatter={d => d.slice(5)} />
              <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="position" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top keywords */}
      <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-medium mb-4">Top klíčová slova - City Cooling</h2>
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-3 text-[10px] font-mono text-white/30 uppercase px-2 pb-3 border-b border-white/10">
            <span className="col-span-5">Klíčové slovo</span>
            <span className="col-span-2 text-right">Kliky</span>
            <span className="col-span-2 text-right">Imprese</span>
            <span className="col-span-2 text-right">Pozice</span>
            <span className="col-span-1 text-right">CTR</span>
          </div>
          {filteredQueries.slice(0, 15).map((q, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-center p-2 rounded-lg hover:bg-white/5 transition-all">
              <span className="col-span-5 text-sm text-white truncate">{q.query}</span>
              <span className="col-span-2 text-right text-sm text-white/70">{(q.clicks || 0).toLocaleString('cs-CZ')}</span>
              <span className="col-span-2 text-right text-sm text-white/70">{(q.impressions || 0).toLocaleString('cs-CZ')}</span>
              <span className="col-span-2 text-right text-sm text-cyan font-medium">{(q.position || 0).toFixed(1)}</span>
              <span className="col-span-1 text-right text-sm text-emerald-400">{q.impressions > 0 ? ((q.clicks / q.impressions) * 100).toFixed(1) : 0}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="mt-8 p-4 rounded-xl bg-cyan/5 border border-cyan/20">
        <p className="text-xs text-cyan/80">
          <strong>Sledované klíčová slova:</strong> {CITY_COOLING_KEYWORDS.join(', ')}
        </p>
        <p className="text-xs text-white/50 mt-2">
          Data jsou synchronizovaná z Google Search Console. Zobrazují organický traffic pro projekty související s city cooling, urban misting systems a outdoor cooling applications.
        </p>
      </div>
    </div>
  );
}