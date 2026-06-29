import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Eye, MousePointer, TrendingUp, Send, Package } from 'lucide-react';

const PERIOD_OPTIONS = [{ label: '7 dní', value: 7 }, { label: '28 dní', value: 28 }, { label: '90 dní', value: 90 }];
const COLORS = ['#22d3ee', '#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa', '#fb923c', '#34d399'];

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="bg-card_bg border border-white/10 rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg bg-cyan/10 flex items-center justify-center">
        <Icon size={14} className="text-cyan" />
      </div>
      <p className="text-xs font-mono text-white/40 tracking-widest uppercase">{label}</p>
    </div>
    <p className="text-3xl font-light text-white">{value}</p>
    {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
  </div>
);

export default function AdminAnalytika() {
  const [days, setDays] = useState(28);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    base44.functions.invoke('getAnalyticsData', { days })
      .then(res => setData(res.data))
      .catch(e => setError(e.message || 'Chyba při načítání Analytics'))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">GOOGLE ANALYTICS</p>
          <h1 className="text-2xl font-light text-white">Přehled návštěvnosti</h1>
        </div>
        <div className="flex gap-2">
          {PERIOD_OPTIONS.map(o => (
            <button key={o.value} onClick={() => setDays(o.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all ${
                days === o.value ? 'bg-cyan text-ink font-bold' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="flex justify-center items-center h-64"><div className="w-6 h-6 border border-cyan border-t-transparent rounded-full animate-spin" /></div>}
      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <StatCard icon={Users} label="Návštěvníci" value={data.totals.users.toLocaleString('cs-CZ')} />
            <StatCard icon={Eye} label="Nový uživatelé" value={data.newUsers.toLocaleString('cs-CZ')} sub="prvních návštěvníků" />
            <StatCard icon={MousePointer} label="Relace" value={data.totals.sessions.toLocaleString('cs-CZ')} />
            <StatCard icon={Package} label="Klikly na produkty" value={data.productClicks.reduce((acc, p) => acc + p.views, 0).toLocaleString('cs-CZ')} />
            <StatCard icon={Send} label="Poptávky" value={data.inquiries.toLocaleString('cs-CZ')} sub="odeslané formuláře" />
            <StatCard icon={TrendingUp} label="Stránky/relace" value={data.totals.sessions ? (data.totals.pageviews / data.totals.sessions).toFixed(1) : '—'} />
          </div>

          {/* Daily chart */}
          <div className="bg-card_bg border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-5">Denní návštěvnost</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.daily}>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={d => d.slice(4).replace(/(\d{2})(\d{2})/, '$1.$2')} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#131c27', border: '1px solid #1e2a3a', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                <Line type="monotone" dataKey="sessions" stroke="#22d3ee" strokeWidth={2} dot={false} name="Relace" />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={false} name="Uživatelé" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top pages */}
            <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-5">Top stránky</p>
              <div className="space-y-2">
                {data.pages.slice(0, 8).map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/20 w-4">{i + 1}</span>
                    <span className="text-xs text-white/60 flex-1 truncate">{p.path}</span>
                    <span className="text-xs font-mono text-cyan">{p.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top products */}
            <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-5">Top produkty</p>
              <div className="space-y-2">
                {data.productClicks.slice(0, 8).map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/20 w-4">{i + 1}</span>
                    <span className="text-xs text-white/60 flex-1 truncate">{p.path.replace('/produkt/', '')}</span>
                    <span className="text-xs font-mono text-cyan">{p.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources pie */}
            <div className="bg-card_bg border border-white/10 rounded-2xl p-6">
              <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-4">Zdroje návštěvnosti</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.sources} dataKey="sessions" nameKey="channel" cx="40%" cy="50%" outerRadius={75} label={false}>
                    {data.sources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v}</span>} />
                  <Tooltip contentStyle={{ background: '#131c27', border: '1px solid #1e2a3a', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}