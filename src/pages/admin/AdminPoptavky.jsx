import React, { useState, useEffect } from 'react';
import { Loader, Mail, Phone, Building2, Package, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Normalized status buckets across both source entities
const BUCKETS = {
  nove: { label: 'Nové', color: 'text-cyan border-cyan/30 bg-cyan/10', icon: AlertCircle, match: (s) => s === 'nova' || s === 'new' },
  reseni: { label: 'V řešení', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10', icon: Clock, match: (s) => s === 'v_reseni' || s === 'contacted' || s === 'in_progress' },
  vyrizene: { label: 'Vyřízené', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle, match: (s) => s === 'uzavrena' || s === 'closed' },
};

// Status options offered per source entity
const STATUS_OPTIONS = {
  Poptavka: [{ value: 'nova', label: 'Nová' }, { value: 'v_reseni', label: 'V řešení' }, { value: 'uzavrena', label: 'Vyřízená' }],
  ContactInquiry: [{ value: 'new', label: 'Nová' }, { value: 'contacted', label: 'Kontaktováno' }, { value: 'in_progress', label: 'V řešení' }, { value: 'closed', label: 'Vyřízená' }],
};

function getBucket(status) {
  return Object.keys(BUCKETS).find((k) => BUCKETS[k].match(status)) || 'nove';
}

export default function AdminPoptavky() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    const [poptavky, inquiries] = await Promise.all([
      base44.entities.Poptavka.list('-created_date'),
      base44.entities.ContactInquiry.list('-created_date'),
    ]);
    const normalized = [
      ...poptavky.map((p) => ({
        id: p.id, entity: 'Poptavka', source: 'Poptávka', name: p.jmeno, email: p.email, phone: p.telefon,
        company: p.firma, product: p.produkt, message: p.zprava, status: p.status, created_date: p.created_date,
      })),
      ...inquiries.map((c) => ({
        id: c.id, entity: 'ContactInquiry', source: 'Kontakt', name: c.name, email: c.email, phone: '',
        company: '', product: c.product_id, message: c.message, status: c.status, created_date: c.created_date,
      })),
    ].sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime());
    setItems(normalized);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (item, status) => {
    await base44.entities[item.entity].update(item.id, { status });
    load();
  };

  const visible = filter === 'all' ? items : items.filter((i) => getBucket(i.status) === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-white text-lg font-medium">Poptávky ({items.length})</h2>
        <div className="flex gap-2">
          {['all', ...Object.keys(BUCKETS)].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${filter === s ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
              {s === 'all' ? 'Vše' : BUCKETS[s].label}
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
          {visible.map((item) => {
            const bucket = BUCKETS[getBucket(item.status)];
            const StatusIcon = bucket.icon;
            const isOpen = expanded === `${item.entity}-${item.id}`;
            return (
              <div key={`${item.entity}-${item.id}`} className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : `${item.entity}-${item.id}`)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15 text-white/40">{item.source}</span>
                      <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${bucket.color}`}>
                        <StatusIcon size={10} /> {bucket.label}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs font-mono truncate">{item.email} {item.company ? `· ${item.company}` : ''} {item.product ? `· ${item.product}` : ''}</p>
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
                      {item.phone && (
                        <a href={`tel:${item.phone}`} className="flex items-center gap-2 text-xs text-white/50 hover:text-white">
                          <Phone size={12} /> {item.phone}
                        </a>
                      )}
                      {item.company && (
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Building2 size={12} /> {item.company}
                        </div>
                      )}
                      {item.product && (
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Package size={12} /> {item.product}
                        </div>
                      )}
                    </div>
                    {item.message && (
                      <div className="flex gap-2 text-xs text-white/60 bg-white/5 rounded-lg p-3">
                        <MessageSquare size={12} className="shrink-0 mt-0.5 text-white/30" />
                        <p className="leading-relaxed">{item.message}</p>
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap pt-1">
                      <p className="text-xs text-white/25 font-mono mr-2 self-center">Změnit stav:</p>
                      {STATUS_OPTIONS[item.entity].map((opt) => (
                        <button key={opt.value} onClick={() => setStatus(item, opt.value)}
                          disabled={item.status === opt.value}
                          className="px-3 py-1 rounded-full text-xs font-mono border border-white/15 text-white/50 transition-all disabled:opacity-40 disabled:border-cyan/30 disabled:text-cyan hover:text-white">
                          {opt.label}
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