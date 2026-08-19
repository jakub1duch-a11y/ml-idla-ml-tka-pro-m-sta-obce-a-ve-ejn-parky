import React, { useEffect, useMemo, useState } from 'react';
import {
  BriefcaseBusiness, Search, ExternalLink, FileText, Presentation,
  FolderOpen, Mail, Eye, CheckCircle2, Clock3, XCircle, RefreshCw,
  ChevronDown, ChevronUp, Building2, UserRound, CalendarDays
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS = {
  draft: { label: 'Koncept', cls: 'bg-white/5 text-white/50 border-white/10' },
  pending_approval: { label: 'Ke schválení', cls: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  sent: { label: 'Odesláno', cls: 'bg-cyan/10 text-cyan border-cyan/20' },
  viewed: { label: 'Otevřeno', cls: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  extension_requested: { label: 'Žádost o prodloužení', cls: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  approved: { label: 'Přijato', cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  expired: { label: 'Expirováno', cls: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
  rejected: { label: 'Zamítnuto', cls: 'bg-red-500/10 text-red-300 border-red-500/20' },
  in_production: { label: 'Ve výrobě', cls: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  ready: { label: 'Připraveno', cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  delivered: { label: 'Dodáno', cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
};

const fmtPrice = (value) => new Intl.NumberFormat('cs-CZ', {
  style: 'currency', currency: 'CZK', maximumFractionDigits: 0,
}).format(Number(value || 0));

const fmtDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
};

const isWon = (status) => ['approved', 'in_production', 'ready', 'delivered'].includes(status);
const isOpen = (status) => ['sent', 'viewed', 'extension_requested'].includes(status);

function Metric({ icon: Icon, label, value, tone = 'text-cyan' }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.16em] text-white/35">
        <Icon size={13} className={tone} /> {label}
      </div>
      <div className={`mt-2 text-2xl font-light ${tone}`}>{value}</div>
    </div>
  );
}

function AssetLink({ href, icon: Icon, children }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/65 hover:border-cyan/30 hover:text-cyan">
      <Icon size={13} /> {children} <ExternalLink size={11} />
    </a>
  );
}

export default function AdminOffers() {
  const [orders, setOrders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [orderRows, assetRows] = await Promise.all([
        base44.entities.ProjectOrder.list('-created_date', 500),
        base44.entities.OfferAsset.list('-created_date', 500),
      ]);
      setOrders(orderRows || []);
      setAssets(assetRows || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = status === 'all' || o.status === status;
      const haystack = [o.quote_number, o.project_name, o.client_name, o.client_company, o.client_email, o.product_name, o.sender_email]
        .filter(Boolean).join(' ').toLowerCase();
      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [orders, query, status]);

  const sentThisMonth = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      if (!o.issued_at || !['sent', 'viewed', 'extension_requested', 'approved', 'in_production', 'ready', 'delivered'].includes(o.status)) return false;
      const d = new Date(o.issued_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [orders]);

  const openOrders = orders.filter((o) => isOpen(o.status));
  const wonOrders = orders.filter((o) => isWon(o.status));
  const openValue = openOrders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
  const wonValue = wonOrders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);

  const now = Date.now();
  const expiredAwaiting = orders.filter((o) => o.valid_until && new Date(o.valid_until).getTime() < now && isOpen(o.status)).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[.18em] text-cyan/70">Obchod / CRM</p>
          <h2 className="mt-1 text-xl font-medium text-white">Nabídky a historie odeslání</h2>
          <p className="mt-1 text-sm text-white/40">Centrální kontrola cenových nabídek, klientů, dokumentů a jejich aktuálního stavu.</p>
        </div>
        <button onClick={load} disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-50">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Obnovit data
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <Metric icon={Mail} label="Odesláno tento měsíc" value={sentThisMonth} />
        <Metric icon={Clock3} label="Čeká na reakci" value={openOrders.length} tone="text-amber-300" />
        <Metric icon={BriefcaseBusiness} label="Hodnota otevřených" value={fmtPrice(openValue)} tone="text-violet-300" />
        <Metric icon={CheckCircle2} label="Vyhráno" value={fmtPrice(wonValue)} tone="text-emerald-300" />
        <Metric icon={XCircle} label="Po platnosti" value={expiredAwaiting} tone="text-orange-300" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat zákazníka, projekt, číslo nabídky, e-mail…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan/30" />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#111820] px-3 py-2.5 text-sm text-white/70 outline-none focus:border-cyan/30">
          <option value="all">Všechny stavy</option>
          {Object.entries(STATUS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full text-left">
            <thead className="border-b border-white/8 bg-white/[0.03] text-[10px] font-mono uppercase tracking-[.14em] text-white/30">
              <tr>
                <th className="px-4 py-3">Nabídka / projekt</th>
                <th className="px-4 py-3">Zákazník</th>
                <th className="px-4 py-3">Stav</th>
                <th className="px-4 py-3">Odesláno / vydáno</th>
                <th className="px-4 py-3">Odesílatel</th>
                <th className="px-4 py-3 text-right">Hodnota</th>
                <th className="px-4 py-3">Dokumenty</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && <tr><td colSpan="8" className="px-4 py-10 text-center text-sm text-white/35">Načítám obchodní nabídky…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan="8" className="px-4 py-10 text-center text-sm text-white/35">Žádné nabídky neodpovídají filtru.</td></tr>}
              {!loading && filtered.map((o) => {
                const st = STATUS[o.status] || STATUS.draft;
                const rowAssets = assets.filter((a) => a.project_order_id === o.id);
                const isExpanded = expanded === o.id;
                return (
                  <React.Fragment key={o.id}>
                    <tr className="align-top hover:bg-white/[0.025]">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-white">{o.quote_number || o.project_name || 'Bez čísla'}</div>
                        <div className="mt-1 max-w-[260px] truncate text-xs text-white/40">{o.project_name || o.product_name || '—'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-white/80">{o.client_name || '—'}</div>
                        <div className="mt-1 text-xs text-white/40">{o.client_company || o.client_email || '—'}</div>
                      </td>
                      <td className="px-4 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] ${st.cls}`}>{st.label}</span></td>
                      <td className="px-4 py-4 text-xs text-white/55">{fmtDate(o.issued_at || o.created_date)}</td>
                      <td className="px-4 py-4 text-xs text-white/55">{o.sender_email || '—'}</td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-white">{o.total_price ? fmtPrice(o.total_price) : '—'}</td>
                      <td className="px-4 py-4"><div className="flex flex-wrap gap-1.5">
                        <AssetLink href={o.quote_pdf_url} icon={FileText}>PDF</AssetLink>
                        <AssetLink href={o.presentation_url || o.presentation_pdf_url} icon={Presentation}>Prezentace</AssetLink>
                        <AssetLink href={o.drive_case_folder_url} icon={FolderOpen}>Drive</AssetLink>
                      </div></td>
                      <td className="px-2 py-4">
                        <button onClick={() => setExpanded(isExpanded ? null : o.id)} className="rounded-lg p-2 text-white/35 hover:bg-white/5 hover:text-white">
                          {isExpanded ? <ChevronUp size={15}/> : <ChevronDown size={15}/>} 
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-cyan/[0.025]">
                        <td colSpan="8" className="px-4 py-5">
                          <div className="grid gap-5 lg:grid-cols-3">
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Klient a projekt</p>
                              <div className="mt-3 space-y-2 text-sm text-white/65">
                                <div className="flex gap-2"><UserRound size={14} className="mt-0.5 text-cyan/60"/><span>{o.client_name || '—'} · {o.client_email || '—'}{o.client_phone ? ` · ${o.client_phone}` : ''}</span></div>
                                <div className="flex gap-2"><Building2 size={14} className="mt-0.5 text-cyan/60"/><span>{o.client_company || 'Bez firmy'} · {o.product_name || o.project_name || '—'}</span></div>
                                <div className="flex gap-2"><CalendarDays size={14} className="mt-0.5 text-cyan/60"/><span>Platnost do: {fmtDate(o.valid_until)}</span></div>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Aktivita</p>
                              <div className="mt-3 space-y-1.5 text-xs text-white/55">
                                <div>Vydáno / odesláno: <span className="text-white/80">{fmtDate(o.issued_at)}</span></div>
                                <div>Poslední akce klienta: <span className="text-white/80">{fmtDate(o.last_customer_action_at)}</span></div>
                                <div>Přijato: <span className="text-white/80">{fmtDate(o.approved_at)}</span></div>
                                <div>Odhad objednávky: <span className="text-white/80">{o.estimated_order_date || o.estimated_order_window || '—'}</span></div>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">Soubory nabídky</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <AssetLink href={o.quote_pdf_url} icon={FileText}>Cenová nabídka</AssetLink>
                                <AssetLink href={o.inquiry_pdf_url} icon={FileText}>Poptávka</AssetLink>
                                <AssetLink href={o.order_confirmation_pdf_url} icon={CheckCircle2}>Potvrzení</AssetLink>
                                <AssetLink href={o.presentation_url} icon={Presentation}>Prezentace</AssetLink>
                                <AssetLink href={o.presentation_pdf_url} icon={Presentation}>Prezentace PDF</AssetLink>
                                <AssetLink href={o.drive_case_folder_url} icon={FolderOpen}>Složka případu</AssetLink>
                                {rowAssets.map((a) => <AssetLink key={a.id} href={a.file_url} icon={FileText}>{a.title || a.file_name}</AssetLink>)}
                              </div>
                            </div>
                          </div>
                          {(o.description || o.customer_message || o.special_requirements) && (
                            <div className="mt-5 border-t border-white/8 pt-4 text-xs leading-relaxed text-white/50">
                              {o.description && <p><span className="text-white/70">Popis:</span> {o.description}</p>}
                              {o.customer_message && <p className="mt-1"><span className="text-white/70">Zpráva klienta:</span> {o.customer_message}</p>}
                              {o.special_requirements && <p className="mt-1"><span className="text-white/70">Speciální požadavky:</span> {o.special_requirements}</p>}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/30">
        <span>Zobrazeno {filtered.length} z {orders.length} nabídek.</span>
        <a href="/obchodni-nabidky" className="inline-flex items-center gap-1.5 text-cyan/70 hover:text-cyan">Otevřít plný Sales Hub <ExternalLink size={12}/></a>
      </div>
    </div>
  );
}
