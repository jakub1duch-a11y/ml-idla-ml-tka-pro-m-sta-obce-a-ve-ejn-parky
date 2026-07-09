import React, { useState, useEffect } from 'react';
import { Loader, Eye, ExternalLink, ShoppingBag, Target } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminProductAnalytics() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('28');

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      base44.functions.invoke('getAnalyticsData', { days: parseInt(period) }),
      base44.entities.Product.list(),
    ]).then(([analyticsRes, products]) => {
      const clicks = analyticsRes.data?.productClicks || [];
      const merged = clicks.map((c) => {
        const slug = c.path.replace('/produkt/', '');
        const product = products.find((p) => p.slug === slug);
        return { slug, name: product?.name || slug, views: c.views };
      });
      setRows(merged);
    }).catch(() => setError('Nelze načíst data — zkontrolujte připojení Google Analytics.'))
      .finally(() => setLoading(false));
  }, [period]);

  const chartData = rows.slice(0, 10).map((r) => ({ name: r.name.substring(0, 16), views: r.views }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-white text-lg font-medium">Produktová analýza</h2>
        <div className="flex gap-2">
          {[['7', '7 dní'], ['28', '28 dní'], ['90', '90 dní']].map(([val, label]) => (
            <button key={val} onClick={() => setPeriod(val)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${period === val ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      ) : (
        <div className="space-y-6">
          {chartData.length > 0 && (
            <div className="p-4 rounded-xl bg-white/3 border border-white/8">
              <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-4 flex items-center gap-1.5"><Eye size={12} /> Zobrazení produktových stránek</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="views" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="rounded-xl border border-white/8 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-white/5 text-[10px] font-mono text-white/30 tracking-widest uppercase">
              <span className="col-span-2">Produkt</span>
              <span className="text-right">Zobrazení</span>
            </div>
            <div className="divide-y divide-white/5">
              {rows.length === 0 ? (
                <p className="text-center text-white/25 py-10 text-sm">Žádná data za vybrané období.</p>
              ) : rows.map((r) => (
                <div key={r.slug} className="grid grid-cols-3 gap-4 px-4 py-2.5 hover:bg-white/3 transition-all">
                  <span className="col-span-2 text-sm text-white/70 truncate">{r.name}</span>
                  <span className="text-sm text-cyan text-right">{r.views}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="https://merchants.google.com/" target="_blank" rel="noopener noreferrer"
              className="p-5 rounded-xl bg-white/3 border border-white/8 hover:border-cyan/30 transition-all flex items-center gap-3">
              <ShoppingBag size={18} className="text-cyan shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Google Merchant Center</p>
                <p className="text-white/35 text-xs mt-0.5">Statistiky produktových nabídek nejsou přes tuto platformu propojitelné — otevřete přímo v Merchant Center.</p>
              </div>
              <ExternalLink size={14} className="text-white/30 ml-auto shrink-0" />
            </a>
            <a href="https://ads.google.com/" target="_blank" rel="noopener noreferrer"
              className="p-5 rounded-xl bg-white/3 border border-white/8 hover:border-cyan/30 transition-all flex items-center gap-3">
              <Target size={18} className="text-cyan shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">Google Ads kampaně</p>
                <p className="text-white/35 text-xs mt-0.5">Spuštěné a plánované kampaně sledujte v Google Ads — přímé napojení zde není k dispozici.</p>
              </div>
              <ExternalLink size={14} className="text-white/30 ml-auto shrink-0" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}