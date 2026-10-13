import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Send, Eye, CheckCircle, Clock, XCircle, RefreshCw, Search, ExternalLink,
  FileText, FolderOpen, Mail, Phone, Building2, Calendar, AlertTriangle, Loader2, Euro,
} from 'lucide-react';

const STATUS_CFG = {
  sent:               { label: 'Odesláno',          cls: 'text-cyan border-cyan/30 bg-cyan/10',          icon: Send },
  viewed:             { label: 'Otevřelo klientem',  cls: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: Eye },
  extension_requested: { label: 'Prodloužení platnosti', cls: 'text-amber-400 border-amber-400/30 bg-amber-400/10', icon: Clock },
  approved:            { label: 'Objednáno',         cls: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle },
  in_production:       { label: 'Ve výrobě',         cls: 'text-blue-300 border-blue-300/30 bg-blue-300/10', icon: RefreshCw },
  ready:               { label: 'Připraveno',         cls: 'text-violet-300 border-violet-400/30 bg-violet-400/10', icon: CheckCircle },
  delivered:           { label: 'Doručeno',          cls: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle },
  expired:             { label: 'Platnost vypršela',  cls: 'text-white/40 border-white/10 bg-white/5',       icon: XCircle },
  rejected:            { label: 'Zamítnuto',          cls: 'text-red-400 border-red-400/30 bg-red-400/10',    icon: XCircle },
};

const SENT_STATUSES = Object.keys(STATUS_CFG);
const FILTERS = [
  { key: 'all', label: 'Vše' },
  { key: 'sent', label: 'Odesláno' },
  { key: 'viewed', label: 'Otevřeno' },
  { key: 'approved', label: 'Objednáno' },
  { key: 'expired', label: 'Expired' },
  { key: 'rejected', label: 'Zamítnuto' },
];

const money = (v) => v ? new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(Number(v)) : '—';
const date = (v) => v ? new Date(v).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const daysLeft = (validUntil) => {
  if (!validUntil) return null;
  const diff = Math.ceil((new Date(validUntil).getTime() - Date.now()) / 86400000);
  return diff;
};

function StatCard({ icon: Icon, label, value, cls }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cls}`}><Icon size={16} /></div>
      </div>
      <p className="text-white text-2xl font-heading font-medium">{value}</p>
    </div>
  );
}

export default function AdminOffers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    const { items } = await base44.entities.ProjectOrder.filter(
      { status: { $in: SENT_STATUSES } },
      { sort: '-issued_at', limit: 200, fields: ['id', 'quote_number', 'client_name', 'client_email', 'client_company', 'client_phone', 'product_name', 'project_name', 'status', 'issued_at', 'valid_until', 'total_price', 'quote_pdf_url', 'drive_case_folder_url', 'last_customer_action_at', 'approved_at', 'customer_message', 'sender_email'] },
    );
    setOrders(items);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const sent = orders.filter((o) => o.status === 'sent').length;
    const viewed = orders.filter((o) => o.status === 'viewed').length;
    const approved = orders.filter((o) => ['approved', 'in_production', 'ready', 'delivered'].includes(o.status)).length;
    const expired = orders.filter((o) => o.status === 'expired').length;
    const pending = orders.filter((o) => ['sent', 'viewed', 'extension_requested'].includes(o.status)).length;
    return { total: orders.length, sent, viewed, approved, expired, pending };
  }, [orders]);

  const visible = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== 'all' && (filter === 'approved' ? !['approved', 'in_production', 'ready', 'delivered'].includes(o.status) : o.status !== filter)) return false;
      const hay = `${o.client_name} ${o.client_email} ${o.client_company} ${o.product_name} ${o.project_name} ${o.quote_number}`.toLowerCase();
      return !query || hay.includes(query.toLowerCase());
    });
  }, [orders, filter, query]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[.16em] text-cyan mb-2">Obchodní nabídky</p>
          <h1 className="text-2xl sm:text-3xl text-white font-semibold">Odeslané nabídky</h1>
          <p className="text-white/40 text-sm mt-1 max-w-2xl">Přehled všech nabídek odeslaných klientům — stav otevření, objednání, platnosti a expirace.</p>
        </div>
        <button onClick={load} className="h-10 px-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2">
          <RefreshCw size={15} /> Obnovit
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <StatCard icon={Send} label="Celkem odesláno" value={stats.total} cls="bg-white/5 text-white/60" />
        <StatCard icon={Mail} label="Čeká na odpověď" value={stats.pending} cls="bg-cyan/10 text-cyan" />
        <StatCard icon={Eye} label="Otevřelo klientem" value={stats.viewed} cls="bg-blue-400/10 text-blue-400" />
        <StatCard icon={CheckCircle} label="Objednáno" value={stats.approved} cls="bg-emerald-400/10 text-emerald-400" />
        <StatCard icon={XCircle} label="Expired" value={stats.expired} cls="bg-white/5 text-white/40" />
        <StatCard icon={Euro} label="Hodnota nabídek" value={money(orders.filter(o => ['sent','viewed','extension_requested','approved','in_production','ready','delivered'].includes(o.status)).reduce((s,o) => s + Number(o.total_price || 0), 0))} cls="bg-cyan/10 text-cyan" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <label className="relative flex-1">
          <Search size={15} className="absolute left-3 top-3 text-white/25" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Klient, produkt, číslo nabídky…"
            className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.035] pl-9 pr-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyan/40" />
        </label>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all ${filter === f.key ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-cyan" /></div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-14 text-center text-sm text-white/35">Žádné nabídky pro zvolený filtr.</div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => {
            const cfg = STATUS_CFG[o.status] || { label: o.status, cls: 'text-white/50 border-white/10 bg-white/5', icon: AlertTriangle };
            const StatusIcon = cfg.icon;
            const dl = daysLeft(o.valid_until);
            const expiringSoon = dl !== null && dl >= 0 && dl <= 7 && ['sent', 'viewed', 'extension_requested'].includes(o.status);
            return (
              <article key={o.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide ${cfg.cls}`}>
                        <StatusIcon size={12} /> {cfg.label}
                      </span>
                      <span className="text-[10px] font-mono text-white/30">{o.quote_number || 'bez čísla'}</span>
                      {expiringSoon && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                          <AlertTriangle size={10} /> Platnost vyprší za {dl} {dl === 1 ? 'den' : 'dní'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold truncate">{o.client_name}</h3>
                    <p className="text-sm text-white/45 mt-0.5 truncate">{o.product_name || o.project_name}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/40">
                      {o.client_email && <a href={`mailto:${o.client_email}`} className="flex items-center gap-1 hover:text-cyan"><Mail size={11} /> {o.client_email}</a>}
                      {o.client_phone && <span className="flex items-center gap-1"><Phone size={11} /> {o.client_phone}</span>}
                      {o.client_company && <span className="flex items-center gap-1"><Building2 size={11} /> {o.client_company}</span>}
                      <span className="flex items-center gap-1"><Calendar size={11} /> Odesláno {date(o.issued_at)}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> Platí do {date(o.valid_until)}</span>
                      {o.last_customer_action_at && <span className="flex items-center gap-1 text-cyan/60"><Eye size={11} /> Naposledy otevřelo {date(o.last_customer_action_at)}</span>}
                    </div>
                    {o.customer_message && (
                      <div className="mt-2 rounded-lg border border-white/8 bg-black/10 p-2.5 text-[11px] text-white/50 italic line-clamp-2">
                        „{o.customer_message}"
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col lg:items-end gap-2 lg:max-w-[280px]">
                    <p className="text-lg font-semibold text-white">{money(o.total_price)}</p>
                    <div className="flex flex-wrap lg:justify-end gap-2">
                      {o.quote_pdf_url && <a href={o.quote_pdf_url} target="_blank" rel="noreferrer" className="h-9 px-3 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white flex items-center gap-1.5"><FileText size={13} /> PDF <ExternalLink size={11} /></a>}
                      {o.drive_case_folder_url && <a href={o.drive_case_folder_url} target="_blank" rel="noreferrer" className="h-9 px-3 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white flex items-center gap-1.5"><FolderOpen size={13} /> Disk <ExternalLink size={11} /></a>}
                      {o.client_email && <a href={`mailto:${o.client_email}?subject=Re: Nabídka ${o.quote_number || ''}`} className="h-9 px-3 rounded-lg bg-cyan text-[#08232b] text-xs font-bold flex items-center gap-1.5"><Mail size={13} /> Kontaktovat</a>}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}