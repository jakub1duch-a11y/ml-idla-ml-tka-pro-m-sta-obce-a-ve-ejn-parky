import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const money = (v) => new Intl.NumberFormat('cs-CZ').format(Number(v || 0));

export default function CrmRevenueChart({ orders }) {
  const data = useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { label: d.toLocaleDateString('cs-CZ', { month: 'short', year: '2-digit' }), won: 0, pipeline: 0 };
    }
    orders.forEach((o) => {
      const date = o.issued_at || o.created_date;
      if (!date) return;
      const d = new Date(date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) return;
      const total = Number(o.total_price) || 0;
      if (['in_production', 'ready', 'delivered'].includes(o.status)) {
        months[key].won += total;
      } else if (['sent', 'viewed', 'extension_requested', 'approved', 'pending_approval', 'draft'].includes(o.status)) {
        months[key].pipeline += total;
      }
    });
    return Object.values(months);
  }, [orders]);

  const totalWon = data.reduce((s, d) => s + d.won, 0);
  const totalPipeline = data.reduce((s, d) => s + d.pipeline, 0);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1.5"><TrendingUp size={12} className="text-cyan"/> Výnosy a pipeline (6 měsíců)</p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-white/50">Vyhráno: <strong className="text-emerald-400">{money(totalWon)} Kč</strong></span>
            <span className="text-xs text-white/50">Pipeline: <strong className="text-cyan">{money(totalPipeline)} Kč</strong></span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 0, left: -10, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }}
            formatter={(v) => `${money(v)} Kč`}
          />
          <Bar dataKey="pipeline" fill="#22d3ee" radius={[2, 2, 0, 0]} name="Pipeline" />
          <Bar dataKey="won" fill="#10b981" radius={[2, 2, 0, 0]} name="Vyhráno" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}