import React, { useState, useEffect } from 'react';
import { Loader, Mail, Phone, Building2, Package, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_LABELS = {
  nova: { label: 'Nová', color: 'text-cyan border-cyan/30 bg-cyan/10', icon: AlertCircle },
  v_reseni: { label: 'V řešení', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10', icon: Clock },
  uzavrena: { label: 'Uzavřená', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle },
};

export default function AdminPoptavky() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.Poptavka.list('-created_date').then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await base44.entities.Poptavka.update(id, { status });
    load();
  };

  const visible = filter === 'all' ? items : items.filter(i => i.status === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">Poptávky ({items.length})</h2>
        <div className="flex gap-2">
          {['all', 'nova', 'v_reseni', 'uzavrena'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${filter === s ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
              {s === 'all' ? 'Vše' : STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>
      ) : visible.length === 0 ? (
        <p className="text-center text-white/25 py-16 text-sm">Žádné poptávky.</p>
      ) : (
        <div className="space-y-2">
          {visible.map(item => {
            const status = STATUS_LABELS[item.status] || STATUS_LABELS.nova;
            const StatusIcon = status.icon;
            const isOpen = expanded === item.id;
            return (
              <div key={item.id} className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : item.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-white text-sm font-medium">{item.jmeno}</p>
                      <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${status.color}`}>
                        <StatusIcon size={10} /> {status.label}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs font-mono truncate">{item.email} {item.firma ? `· ${item.firma}` : ''} {item.produkt ? `· ${item.produkt}` : ''}</p>
                  </div>
                  <p className="text-white/25 text-xs font-mono shrink-0">
                    {item.created_date ? new Date(item.created_date).toLocaleDateString('cs-CZ') : ''}
                  </p>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-white/8 pt-4 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {item.email && (
                        <a href={`mailto:${item.email}`} className="flex items-center gap-2 text-xs text-cyan hover:underline">
                          <Mail size={12} /> {item.email}
                        </a>
                      )}
                      {item.telefon && (
                        <a href={`tel:${item.telefon}`} className="flex items-center gap-2 text-xs text-white/50 hover:text-white">
                          <Phone size={12} /> {item.telefon}
                        </a>
                      )}
                      {item.firma && (
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Building2 size={12} /> {item.firma}
                        </div>
                      )}
                      {item.produkt && (
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Package size={12} /> {item.produkt}
                        </div>
                      )}
                    </div>
                    {item.zprava && (
                      <div className="flex gap-2 text-xs text-white/60 bg-white/5 rounded-lg p-3">
                        <MessageSquare size={12} className="shrink-0 mt-0.5 text-white/30" />
                        <p className="leading-relaxed">{item.zprava}</p>
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap pt-1">
                      <p className="text-xs text-white/25 font-mono mr-2 self-center">Změnit stav:</p>
                      {Object.entries(STATUS_LABELS).map(([key, val]) => (
                        <button key={key} onClick={() => setStatus(item.id, key)}
                          disabled={item.status === key}
                          className={`px-3 py-1 rounded-full text-xs font-mono border transition-all disabled:opacity-40 ${val.color}`}>
                          {val.label}
                        </button>
                      ))}
                      <a href={`mailto:${item.email}?subject=Re: Vaše poptávka mlzidla.cz`}
                        className="ml-auto px-3 py-1 rounded-full text-xs font-mono bg-cyan text-ink hover:bg-cyan/90 transition-all">
                        Odpovědět →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}