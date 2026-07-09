import React, { useState, useEffect } from 'react';
import { Loader, Eye, MousePointerClick } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProductAnalyticsPanel({ slug }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    base44.functions.invoke('getAnalyticsData', { days: 28 })
      .then((res) => {
        const rows = res.data?.productClicks || [];
        const row = rows.find((r) => r.path === `/produkt/${slug}`);
        setStats({ views: row?.views || 0, rank: row ? rows.indexOf(row) + 1 : null, total: rows.length });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="p-4 rounded-xl bg-white/3 border border-white/8">
      <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Zájem o tento produkt (28 dní)</p>
      {loading ? (
        <div className="flex justify-center py-4"><Loader size={18} className="animate-spin text-cyan/40" /></div>
      ) : error ? (
        <p className="text-white/30 text-xs">Nelze načíst data — zkontrolujte připojení Google Analytics.</p>
      ) : (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-cyan" />
            <div>
              <p className="text-white text-lg font-light">{stats.views}</p>
              <p className="text-white/30 text-[10px] font-mono">Zobrazení stránky</p>
            </div>
          </div>
          {stats.rank && (
            <div className="flex items-center gap-2">
              <MousePointerClick size={16} className="text-emerald-400" />
              <div>
                <p className="text-white text-lg font-light">#{stats.rank} <span className="text-white/30 text-xs">/ {stats.total}</span></p>
                <p className="text-white/30 text-[10px] font-mono">Pořadí mezi produkty</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}