import React, { useEffect, useMemo, useState } from 'react';
import {
  Loader, Mail, Phone, Building2, Package, MessageSquare, CheckCircle, Clock, AlertCircle,
  FileText, Printer, Sparkles, Eye, Send, Inbox, FolderOpen, ArrowRight, X, Wand2, Image as ImageIcon,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import VisualizationStudio from '@/components/admin/VisualizationStudio';

const BUCKETS = {
  nove: { label: 'Nové', color: 'text-cyan border-cyan/30 bg-cyan/10', icon: AlertCircle, match: (s) => s === 'nova' || s === 'new' },
  reseni: { label: 'V řešení', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10', icon: Clock, match: (s) => s === 'v_reseni' || s === 'contacted' || s === 'in_progress' },
  vyrizene: { label: 'Vyřízené', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle, match: (s) => s === 'uzavrena' || s === 'closed' },
};

const STATUS_OPTIONS = {
  Poptavka: [{ value: 'nova', label: 'Nová' }, { value: 'v_reseni', label: 'V řešení' }, { value: 'uzavrena', label: 'Vyřízená' }],
  ContactInquiry: [{ value: 'new', label: 'Nová' }, { value: 'contacted', label: 'Kontaktováno' }, { value: 'in_progress', label: 'V řešení' }, { value: 'closed', label: 'Vyřízená' }],
};

const OFFER_STAGES = [
  { key: 'nova_poptavka', label: 'Nová poptávka', color: 'text-white/40 border-white/10 bg-white/5', icon: Inbox },
  { key: 'koncept', label: 'Koncept', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: Sparkles },
  { key: 'k_overeni', label: 'K ověření', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10', icon: Eye },
  { key: 'schvaleno', label: 'Schváleno', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle },
  { key: 'odeslano', label: 'Odesláno', color: 'text-cyan border-cyan/30 bg-cyan/10', icon: Send },
];

function getBucket(status) {
  return Object.keys(BUCKETS).find((k) => BUCKETS[k].match(status)) || 'nove';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' });
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-white text-2xl font-heading font-medium">{value}</p>
    </div>
  );
}

export default function AdminPoptavky() {
  const [items, setItems] = useState([]);
  const [projectOrders, setProjectOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState('dashboard'); // dashboard | board | list | studio
  const [printingItem, setPrintingItem] = useState(null);

  const load = async () => {
    setLoading(true);
    const [poptavky, inquiries, orders, prods] = await Promise.all([
      base44.entities.Poptavka.list('-created_date'),
      base44.entities.ContactInquiry.list('-created_date'),
      base44.entities.ProjectOrder.list('-created_date', 200),
      base44.entities.Product.list(),
    ]);
    const normalized = [
      ...poptavky.map((p) => ({
        id: p.id, entity: 'Poptavka', source: 'Poptávka', name: p.jmeno, email: p.email, phone: p.telefon,
        company: p.firma, product: p.produkt, message: p.zprava, status: p.status, created_date: p.created_date,
        offer_status: p.offer_status || 'nova_poptavka',
      })),
      ...inquiries.map((c) => ({
        id: c.id, entity: 'ContactInquiry', source: 'Kontakt', name: c.name, email: c.email, phone: '',
        company: '', product: c.product_id, message: c.message, status: c.status, created_date: c.created_date,
        offer_status: 'nova_poptavka',
      })),
    ].sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime());
    setItems(normalized);
    setProjectOrders(orders || []);
    setProducts(prods || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (item, status) => {
    await base44.entities[item.entity].update(item.id, { status });
    setItems((prev) => prev.map((i) => i.id === item.id && i.entity === item.entity ? { ...i, status } : i));
  };

  const ordersByInquiry = useMemo(() => {
    const map = {};
    (projectOrders || []).forEach((o) => {
      if (!o.inquiry_id) return;
      if (!map[o.inquiry_id]) map[o.inquiry_id] = [];
      map[o.inquiry_id].push(o);
    });
    return map;
  }, [projectOrders]);

  // Stats
  const stats = useMemo(() => {
    const total = items.length;
    const draftOffers = items.filter((i) => ['koncept', 'k_overeni'].includes(i.offer_status)).length;
    const approvedOffers = items.filter((i) => i.offer_status === 'schvaleno').length;
    const sentOffers = items.filter((i) => i.offer_status === 'odeslano').length;
    const newInquiries = items.filter((i) => getBucket(i.status) === 'nove').length;
    return { total, draftOffers, approvedOffers, sentOffers, newInquiries };
  }, [items]);

  const visible = filter === 'all' ? items : items.filter((i) => getBucket(i.status) === filter);

  // Offer board: group items by offer_status
  const boardColumns = useMemo(() => {
    const cols = {};
    OFFER_STAGES.forEach((s) => { cols[s.key] = []; });
    items.forEach((item) => {
      const stage = item.offer_status || 'nova_poptavka';
      if (cols[stage]) cols[stage].push(item);
    });
    return cols;
  }, [items]);

  const getOfferInfo = (item) => {
    const orders = ordersByInquiry[item.id] || [];
    const latest = orders[0];
    return {
      orders,
      latest,
      hasOffer: orders.length > 0,
      clientReceived: latest?.status === 'sent' || latest?.status === 'viewed' || latest?.status === 'approved',
      quoteNumber: latest?.quote_number,
      status: latest?.status,
    };
  };

  const printA4 = (item) => {
    setPrintingItem(item);
    setTimeout(() => {
      window.print();
      setPrintingItem(null);
    }, 300);
  };

  // Board card
  const BoardCard = ({ item }) => {
    const offer = getOfferInfo(item);
    return (
      <div className="rounded-xl border border-white/8 bg-white/5 p-3 hover:border-cyan/30 transition-all">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{item.name}</p>
            <p className="text-white/30 text-[10px] font-mono truncate">{item.email}</p>
          </div>
          <span className="text-[9px] font-mono text-white/30 shrink-0">{formatDate(item.created_date)}</span>
        </div>
        {offer.hasOffer ? (
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className={`px-2 py-0.5 rounded-full border ${offer.clientReceived ? 'text-cyan border-cyan/30 bg-cyan/10' : 'text-white/40 border-white/10'}`}>
              {offer.clientReceived ? '✓ Obdrženo' : 'Neodesláno'}
            </span>
            {offer.quoteNumber && <span className="text-white/30 truncate">{offer.quoteNumber}</span>}
          </div>
        ) : (
          <p className="text-[10px] text-white/25 italic">Bez nabídky</p>
        )}
        <div className="flex gap-1 mt-2">
          <button onClick={() => setExpanded(item.id)} className="text-[10px] text-cyan hover:underline">Detail</button>
          <button onClick={() => printA4(item)} className="text-[10px] text-white/40 hover:text-white ml-auto">Tisk A4</button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 print:p-0">
      {/* Print-only A4 layout */}
      {printingItem && (
        <div className="fixed inset-0 z-[200] bg-white print:block hidden">
          <div className="max-w-[210mm] mx-auto p-8 print:p-0">
            <div className="border-b-2 border-slate-900 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-900">MLŽIDLA® / HolmTec s.r.o.</h1>
              <p className="text-sm text-slate-500 mt-1">Poptávka — {printingItem.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-mono uppercase text-slate-400 mb-1">Klient</p>
                <p className="text-slate-900 font-medium">{printingItem.name}</p>
                <p className="text-slate-600 text-sm">{printingItem.email}</p>
                {printingItem.phone && <p className="text-slate-600 text-sm">{printingItem.phone}</p>}
                {printingItem.company && <p className="text-slate-600 text-sm">{printingItem.company}</p>}
              </div>
              <div>
                <p className="text-xs font-mono uppercase text-slate-400 mb-1">Datum</p>
                <p className="text-slate-900">{new Date(printingItem.created_date).toLocaleDateString('cs-CZ')}</p>
                {printingItem.product && <p className="text-slate-600 text-sm mt-1">Produkt: {printingItem.product}</p>}
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase text-slate-400 mb-2">Zpráva klienta</p>
              <div className="border border-slate-200 rounded p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{printingItem.message}</div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-400">
              <p>Ing. Radek Meduna · MLŽIDLA® / HolmTec s.r.o. · +420 774 700 390 · meduna@holmtec.cz</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 print:hidden">
        <div>
          <h2 className="text-white text-xl font-heading font-medium">Poptávky & nabídky</h2>
          <p className="text-white/40 text-xs mt-1">Přehledná správa poptávek, stav nabídek a tvorba vizualizací</p>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Inbox },
            { id: 'board', label: 'Tabule nabídek', icon: FolderOpen },
            { id: 'list', label: 'Seznam', icon: MessageSquare },
            { id: 'studio', label: 'Vizualizace', icon: ImageIcon },
          ].map((v) => {
            const Icon = v.icon;
            return (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${view === v.id ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
                <Icon size={13} /> {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats dashboard */}
      {view === 'dashboard' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6 print:hidden">
            <StatCard icon={Inbox} label="Celkem poptávek" value={stats.total} color="bg-white/5 text-white/60" />
            <StatCard icon={AlertCircle} label="Nové" value={stats.newInquiries} color="bg-cyan/10 text-cyan" />
            <StatCard icon={Sparkles} label="Koncepty" value={stats.draftOffers} color="bg-blue-400/10 text-blue-400" />
            <StatCard icon={CheckCircle} label="Schváleno" value={stats.approvedOffers} color="bg-emerald-400/10 text-emerald-400" />
            <StatCard icon={Send} label="Odesláno" value={stats.sentOffers} color="bg-cyan/10 text-cyan" />
          </div>

          {/* Recent inquiries + offer status */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 print:hidden">
            {/* Recent inquiries */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4">Nejnovější poptávky</p>
              <div className="space-y-2">
                {items.slice(0, 6).map((item) => {
                  const bucket = BUCKETS[getBucket(item.status)];
                  const StatusIcon = bucket.icon;
                  const offer = getOfferInfo(item);
                  return (
                    <button key={`${item.entity}-${item.id}`} onClick={() => setExpanded(item.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10 transition-all text-left">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-white/30 text-[10px] font-mono truncate">{item.email} {item.company ? `· ${item.company}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {offer.hasOffer && (
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${offer.clientReceived ? 'text-cyan border-cyan/30 bg-cyan/10' : 'text-amber-400 border-amber-400/30 bg-amber-400/10'}`}>
                            {offer.clientReceived ? '✓ Odesláno' : 'Koncept'}
                          </span>
                        )}
                        <span className={`flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full border ${bucket.color}`}>
                          <StatusIcon size={10} /> {bucket.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
                {items.length === 0 && <p className="text-center text-white/25 py-8 text-sm">Žádné poptávky.</p>}
              </div>
            </div>

            {/* Offer status summary */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4">Stav nabídek</p>
              <div className="space-y-3">
                {OFFER_STAGES.map((stage) => {
                  const count = boardColumns[stage.key]?.length || 0;
                  const StageIcon = stage.icon;
                  return (
                    <div key={stage.key} className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border ${stage.color}`}>
                        <StageIcon size={12} /> {stage.label}
                      </span>
                      <span className="text-white text-lg font-heading font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-white/8">
                <p className="text-[10px] text-white/30 leading-relaxed">
                  Nabídky se vytvářejí jako koncepty — nikdy se neodesílají automaticky. K odeslání je nutné ruční schválení.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Offer board (Kanban) */}
      {view === 'board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 print:hidden">
          {OFFER_STAGES.map((stage) => {
            const StageIcon = stage.icon;
            const cards = boardColumns[stage.key] || [];
            return (
              <div key={stage.key} className="rounded-2xl border border-white/8 bg-white/2 p-3">
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border ${stage.color} mb-3`}>
                  <StageIcon size={11} /> {stage.label}
                  <span className="ml-1 text-white/40">{cards.length}</span>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {cards.map((item) => <BoardCard key={item.id} item={item} />)}
                  {cards.length === 0 && <p className="text-center text-white/20 text-[10px] py-4">Prázdné</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3 print:hidden">
            <h3 className="text-white text-sm font-medium">Seznam poptávek ({items.length})</h3>
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
                const isOpen = expanded === item.id;
                const offer = getOfferInfo(item);
                return (
                  <div key={`${item.entity}-${item.id}`} className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                    <button onClick={() => setExpanded(isOpen ? null : item.id)}
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/3 transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15 text-white/40">{item.source}</span>
                          <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${bucket.color}`}>
                            <StatusIcon size={10} /> {bucket.label}
                          </span>
                          {offer.hasOffer && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${offer.clientReceived ? 'text-cyan border-cyan/30 bg-cyan/10' : 'text-amber-400 border-amber-400/30 bg-amber-400/10'}`}>
                              {offer.clientReceived ? '✓ Klient obdržel' : 'Koncept nabídky'}
                            </span>
                          )}
                        </div>
                        <p className="text-white/35 text-xs font-mono truncate">{item.email} {item.company ? `· ${item.company}` : ''} {item.product ? `· ${item.product}` : ''}</p>
                      </div>
                      <p className="text-white/25 text-xs font-mono shrink-0">{formatDate(item.created_date)}</p>
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

                        {/* Offer info */}
                        {offer.hasOffer && (
                          <div className="rounded-lg border border-cyan/20 bg-cyan/5 p-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <p className="text-xs text-cyan font-mono">{offer.quoteNumber || 'Nabídka bez čísla'}</p>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${offer.clientReceived ? 'text-cyan border-cyan/30 bg-cyan/10' : 'text-amber-400 border-amber-400/30 bg-amber-400/10'}`}>
                                {offer.clientReceived ? '✓ Klient obdržel nabídku' : 'Nabídka neodeslána klientovi'}
                              </span>
                            </div>
                            {offer.orders.length > 1 && (
                              <p className="text-[10px] text-white/30 mt-1">Celkem {offer.orders.length} verzí nabídky</p>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap pt-1">
                          <p className="text-xs text-white/25 font-mono mr-2 self-center">Stav:</p>
                          {STATUS_OPTIONS[item.entity].map((opt) => (
                            <button key={opt.value} onClick={() => setStatus(item, opt.value)}
                              disabled={item.status === opt.value}
                              className="px-3 py-1 rounded-full text-xs font-mono border border-white/15 text-white/50 transition-all disabled:opacity-40 disabled:border-cyan/30 disabled:text-cyan hover:text-white">
                              {opt.label}
                            </button>
                          ))}
                          <button onClick={() => printA4(item)} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono border border-white/15 text-white/50 hover:text-white">
                            <Printer size={11} /> Tisk A4
                          </button>
                          <a href={`mailto:${item.email}?subject=Re: Vaše poptávka mlzidla.cz`}
                            className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-cyan text-ink hover:bg-cyan/90 transition-all">
                            Odpovědět <ArrowRight size={11} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Visualization Studio */}
      {view === 'studio' && (
        <div className="max-w-4xl print:hidden">
          <VisualizationStudio products={products} />
        </div>
      )}
    </div>
  );
}