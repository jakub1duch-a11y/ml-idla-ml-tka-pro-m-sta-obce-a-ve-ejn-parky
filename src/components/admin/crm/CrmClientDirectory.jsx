import React, { useMemo, useState } from 'react';
import { Search, Mail, Phone, Building2, ShoppingBag, DollarSign, Calendar, X, ChevronRight } from 'lucide-react';

const money = (v) => new Intl.NumberFormat('cs-CZ').format(Number(v || 0));
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('cs-CZ') : '';

const SOURCE_LABELS = {
  poptavka: 'Poptávka', contact: 'Kontakt', order: 'Objednávka', prospect: 'Prospect',
};

export default function CrmClientDirectory({ clients, activities, orders }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter((c) =>
      c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) || c.phone?.includes(q)
    );
  }, [clients, search]);

  const selectedActivities = useMemo(() => {
    if (!selected) return [];
    return activities.filter((a) => a.contact_email?.toLowerCase().trim() === selected.email).sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  }, [selected, activities]);

  const selectedOrders = useMemo(() => {
    if (!selected) return [];
    return orders.filter((o) => o.client_email?.toLowerCase().trim() === selected.email).sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  }, [selected, orders]);

  return (
    <>
      <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          <p className="text-white text-sm font-medium">Klientský adresář ({clients.length})</p>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hledat klienta…"
              className="w-64 rounded-lg border border-white/10 bg-black/20 pl-9 pr-3 py-2 text-xs text-white placeholder-white/25 outline-none focus:border-cyan/30" />
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto divide-y divide-white/5">
          {filtered.length === 0 && <p className="text-center text-white/25 py-10 text-sm">Žádní klienti.</p>}
          {filtered.map((c) => (
            <button key={c.email} onClick={() => setSelected(c)} className="w-full flex items-center gap-3 p-3.5 hover:bg-white/5 transition text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan text-xs font-bold shrink-0">
                {(c.name || c.email || '?')[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{c.name || 'Neznámý'}</p>
                <p className="text-white/30 text-[10px] font-mono truncate">{c.email} {c.company ? `· ${c.company}` : ''}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.orderCount > 0 && <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-cyan/20 bg-cyan/10 text-cyan">{c.orderCount}× objednávka</span>}
                {c.totalValue > 0 && <span className="text-[10px] font-mono text-emerald-400">{money(c.totalValue)} Kč</span>}
                <div className="flex gap-1">
                  {c.sources.map((s) => <span key={s} className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/10 text-white/35">{SOURCE_LABELS[s] || s}</span>)}
                </div>
                <ChevronRight size={14} className="text-white/20" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Client detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-md bg-[#0d1117] border-l border-white/10 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0d1117] border-b border-white/8 px-5 py-4 flex items-center justify-between">
              <p className="text-white text-sm font-medium">{selected.name || selected.email}</p>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan/10 text-cyan text-xl font-bold">{(selected.name || selected.email || '?')[0]?.toUpperCase()}</div>
                <div>
                  <p className="text-white text-sm font-medium">{selected.name || 'Neznámý klient'}</p>
                  {selected.company && <p className="text-white/40 text-xs">{selected.company}</p>}
                </div>
              </div>
              <div className="space-y-2">
                {selected.email && <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-xs text-cyan hover:underline"><Mail size={13}/> {selected.email}</a>}
                {selected.phone && <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-xs text-white/50 hover:text-white"><Phone size={13}/> {selected.phone}</a>}
                {selected.company && <div className="flex items-center gap-2 text-xs text-white/50"><Building2 size={13}/> {selected.company}</div>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/8 bg-white/5 p-3">
                  <p className="text-[9px] uppercase text-white/30">Objednávky</p>
                  <p className="text-white text-lg font-medium mt-1">{selected.orderCount}</p>
                </div>
                <div className="rounded-lg border border-white/8 bg-white/5 p-3">
                  <p className="text-[9px] uppercase text-white/30">Celková hodnota</p>
                  <p className="text-emerald-400 text-lg font-medium mt-1">{money(selected.totalValue)} Kč</p>
                </div>
              </div>

              {selectedOrders.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase text-white/30 mb-2 flex items-center gap-1"><ShoppingBag size={11}/> Objednávky / nabídky</p>
                  <div className="space-y-2">
                    {selectedOrders.map((o) => (
                      <div key={o.id} className="rounded-lg border border-white/8 bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-white/70 font-mono">{o.quote_number || 'Bez čísla'}</p>
                          {o.total_price > 0 && <span className="text-xs text-cyan font-mono">{money(o.total_price)} Kč</span>}
                        </div>
                        <p className="text-[10px] text-white/35 mt-1">{o.product_name} · {o.status}</p>
                        <p className="text-[9px] text-white/20 mt-1 font-mono">{fmtDate(o.created_date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedActivities.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase text-white/30 mb-2 flex items-center gap-1"><Calendar size={11}/> Aktivity ({selectedActivities.length})</p>
                  <div className="space-y-2">
                    {selectedActivities.slice(0, 10).map((a) => (
                      <div key={a.id} className="rounded-lg border border-white/8 bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-white/70">{a.subject}</p>
                          <span className="text-[9px] font-mono text-white/30">{a.type}</span>
                        </div>
                        {a.description && <p className="text-[10px] text-white/40 mt-1 line-clamp-2">{a.description}</p>}
                        <p className="text-[9px] text-white/20 mt-1 font-mono">{fmtDate(a.created_date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-white/20 font-mono">První kontakt: {fmtDate(selected.firstSeen)} · Poslední: {fmtDate(selected.lastSeen)}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}