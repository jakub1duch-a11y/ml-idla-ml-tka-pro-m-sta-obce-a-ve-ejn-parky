import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Send, Eye, CheckCircle, Clock, XCircle, RefreshCw, Search, ExternalLink,
  FileText, FolderOpen, Mail, Phone, Building2, Calendar, AlertTriangle, Loader2, Euro, Link2, Sparkles, ShieldCheck,
} from 'lucide-react';

const STATUS_CFG = {
  draft: { label: 'Rozpracováno', cls: 'text-white/60 border-white/10 bg-white/5', icon: FileText },
  draft_ready_for_review: { label: 'AI koncept ke kontrole', cls: 'text-violet-200 border-violet-400/30 bg-violet-400/10', icon: Sparkles },
  pending_approval: { label: 'Čeká na schválení', cls: 'text-amber-300 border-amber-400/30 bg-amber-400/10', icon: ShieldCheck },
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

const FILTERS = [
  { key: 'all', label: 'Vše' },
  { key: 'drafts', label: 'Rozpracované / AI koncepty' },
  { key: 'sent', label: 'Odesláno' },
  { key: 'viewed', label: 'Otevřeno' },
  { key: 'approved', label: 'Objednáno' },
  { key: 'expired', label: 'Prošlé' },
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
  const [assets, setAssets] = useState([]);
  const [runs, setRuns] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draftBusy, setDraftBusy] = useState('');
  const [canvaInput, setCanvaInput] = useState({});
  const [actionMessage, setActionMessage] = useState({});
  const [linkBusy, setLinkBusy] = useState('');
  const [expanded, setExpanded] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true); setLoadError('');
    const result = await Promise.allSettled([
      base44.entities.ProjectOrder.list('-created_date', 500),
      base44.entities.OfferAsset.list('-created_date', 500),
      base44.entities.OfferAgentRun.list('-created_date', 500),
      base44.entities.EmailMessage.list('-received_at', 500),
    ]);
    const unwrap = (entry, label) => {
      if (entry.status === 'rejected') { console.warn('Offer CRM source unavailable', label); return []; }
      return Array.isArray(entry.value) ? entry.value : (entry.value?.items || []);
    };
    setOrders(unwrap(result[0], 'ProjectOrder').filter(o => Boolean(STATUS_CFG[o.status])));
    setAssets(unwrap(result[1], 'OfferAsset'));
    setRuns(unwrap(result[2], 'OfferAgentRun'));
    setMessages(unwrap(result[3], 'EmailMessage'));
    const failed = ['Nabídky', 'Přílohy / Canva', 'Schvalování', 'Gmail komunikace']
      .filter((_, index) => result[index].status === 'rejected');
    if (failed.length) setLoadError('Některé části přehledu nejsou dostupné: ' + failed.join(', ') + '.');
    setLoading(false);
  };

  const createGmailDraft = async (order) => {
    setDraftBusy(order.id);
    setActionMessage(prev => ({ ...prev, [order.id]: '' }));
    try {
      const response = await base44.functions.invoke('createVerifiedOfferDraft', { project_order_id: order.id });
      const result = response?.data || response;
      if (!result?.ok) throw new Error(result?.error || 'Gmail koncept se nepodařilo vytvořit.');
      setActionMessage(prev => ({ ...prev, [order.id]: result.ready_for_manual_review
        ? 'Gmail koncept s ověřeným PDF byl uložen. Nebyl odeslán.'
        : 'Uložen pouze interní Gmail koncept. Klientovi se nic neposílá: ' + (result.pdf_warning || 'Čeká na ověření / schválení.') }));
    } catch(e) {
      setActionMessage(prev => ({ ...prev, [order.id]: e?.response?.data?.error || e?.message || 'Nelze připravit Gmail koncept.' }));
    } finally { setDraftBusy(''); }
  };

  const attachCanva = async (order) => {
    const raw = (canvaInput[order.id] || '').trim();
    let url;
    try {
      url = new URL(raw);
      if (url.protocol !== 'https:' || !['canva.com','www.canva.com'].includes(url.hostname))
        throw new Error('Povolen je pouze odkaz https://www.canva.com/');
    } catch {
      setActionMessage(prev => ({ ...prev, [order.id]: 'Zadejte platný HTTPS odkaz na editovatelný Canva design.' }));
      return;
    }
    if (assets.some(x => x.project_order_id === order.id && x.file_url === url.toString())) {
      setActionMessage(prev => ({ ...prev, [order.id]: 'Canva design už je u této nabídky uložený.' }));
      return;
    }
    setLinkBusy(order.id);
    try {
      await base44.entities.OfferAsset.create({
        project_order_id: order.id, inquiry_id: order.inquiry_id || '',
        inquiry_type: order.inquiry_type === 'contact' ? 'contact' : 'poptavka',
        file_url: url.toString(), title: 'Canva – editovatelná nabídka',
        file_name: 'Canva design ' + (order.quote_number || order.project_name || order.id),
        asset_type: 'presentation', file_type: 'text/html',
        selected_for_offer: false, generated_by_ai: false,
      });
      setCanvaInput(prev => ({ ...prev, [order.id]: '' }));
      setActionMessage(prev => ({ ...prev, [order.id]: 'Canva design přiřazen k nabídce.' }));
      await load();
    } catch(e) {
      setActionMessage(prev => ({ ...prev, [order.id]: e?.message || 'Canva odkaz nelze uložit.' }));
    } finally { setLinkBusy(''); }
  };
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const sent = orders.filter((o) => o.status === 'sent').length;
    const drafts = orders.filter(o => ['draft','draft_ready_for_review','pending_approval'].includes(o.status)).length;
    const viewed = orders.filter((o) => o.status === 'viewed').length;
    const approved = orders.filter((o) => ['approved', 'in_production', 'ready', 'delivered'].includes(o.status)).length;
    const expired = orders.filter((o) => o.status === 'expired').length;
    const pending = orders.filter((o) => ['sent', 'viewed', 'extension_requested'].includes(o.status)).length;
    return { total: orders.length, sent, viewed, approved, expired, pending, drafts };
  }, [orders]);

  const visible = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== 'all' && (filter === 'drafts' ? !['draft','draft_ready_for_review','pending_approval'].includes(o.status) : filter === 'approved' ? !['approved', 'in_production', 'ready', 'delivered'].includes(o.status) : o.status !== filter)) return false;
      const hay = `${o.client_name} ${o.client_email} ${o.client_company} ${o.product_name} ${o.project_name} ${o.quote_number}`.toLowerCase();
      return !query || hay.includes(query.toLowerCase());
    });
  }, [orders, filter, query]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[.16em] text-cyan mb-2">Obchodní nabídky</p>
          <h1 className="text-2xl sm:text-3xl text-white font-semibold">Obchodní nabídky · AI / Canva / Gmail</h1>
          <p className="text-white/40 text-sm mt-1 max-w-2xl">Pracovní koncepty, podklady z Canvy, schvalování, Gmail a obchodní komunikace. Zákazníkovi se nic neposílá bez vašeho schválení.</p>
        </div>
        <button onClick={load} className="h-10 px-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2">
          <RefreshCw size={15} /> Obnovit
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 mb-6">
        <StatCard icon={FileText} label="Všechny nabídky" value={stats.total} cls="bg-white/5 text-white/60" />
        <StatCard icon={Sparkles} label="Rozpracované" value={stats.drafts} cls="bg-violet-400/10 text-violet-300" />
        <StatCard icon={Mail} label="Čeká na odpověď" value={stats.pending} cls="bg-cyan/10 text-cyan" />
        <StatCard icon={Eye} label="Otevřelo klientem" value={stats.viewed} cls="bg-blue-400/10 text-blue-400" />
        <StatCard icon={CheckCircle} label="Objednáno" value={stats.approved} cls="bg-emerald-400/10 text-emerald-400" />
        <StatCard icon={XCircle} label="Prošlé" value={stats.expired} cls="bg-white/5 text-white/40" />
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

      {loadError && <p role="alert" className="mb-4 text-sm text-amber-300">{loadError}</p>}
      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-cyan" /></div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-14 text-center text-sm text-white/35">Žádné nabídky pro zvolený filtr.</div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => {
            const linked = assets.filter(a => a.project_order_id === o.id || (o.inquiry_id && a.inquiry_id === o.inquiry_id));
            const canva = linked.filter(a => { try { const url = new URL(a.file_url); return url.protocol === 'https:' && ['canva.com','www.canva.com'].includes(url.hostname); } catch { return false; } });
            const latestRun = runs.find(r => r.project_order_id === o.id);
            const email = (o.client_email || '').trim().toLowerCase();
            const lastEmail = messages.find(m => email && [m.contact_email, m.from_email, m.to_email].some(v => (v || '').trim().toLowerCase() === email));
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
                      <span className="flex items-center gap-1"><Calendar size={11} /> {o.issued_at ? 'Odesláno ' + date(o.issued_at) : 'Zatím neodesláno'}</span>
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
                <div className="mt-4 border-t border-white/10 pt-3">
                  <button onClick={() => setExpanded(expanded === o.id ? '' : o.id)} className="text-xs text-cyan hover:underline">{expanded === o.id ? 'Skrýt detail' : 'Detail nabídky a komunikace'}</button>
                  {expanded === o.id && <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl bg-black/15 border border-white/10 p-4 space-y-2">
                      <h4 className="font-semibold text-sm text-white">Dokumenty a Canva ({linked.length})</h4>
                      {linked.length ? linked.map(f => <a key={f.id} href={f.file_url} target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan hover:underline">{f.title || f.file_name || f.asset_type || 'Soubor'} ↗</a>) : <p className="text-xs text-white/40">K nabídce nejsou přiřazeny soubory v evidenci OfferAsset.</p>}
                      {o.quote_pdf_url && <a className="block text-xs text-cyan" target="_blank" rel="noopener noreferrer" href={o.quote_pdf_url}>Otevřít cenovou nabídku PDF ↗</a>}
                      {!!o.presentation_url && <a href={o.presentation_url} target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan">Prezentace na Google Workspace ↗</a>}
                      {!!o.presentation_pdf_url && <a href={o.presentation_pdf_url} target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan">PDF prezentace ↗</a>}
                      {canva.length > 0 && <p className="text-xs text-emerald-300">{canva.length} Canva designů přiřazeno</p>}
                      <form onSubmit={e => {e.preventDefault(); attachCanva(o);}} className="flex flex-wrap gap-2 pt-2">
                        <input aria-label="Odkaz na Canva design" type="url" placeholder="https://www.canva.com/design/…" required value={canvaInput[o.id] || ''}
                          onChange={e=>setCanvaInput(prev=>({...prev,[o.id]:e.target.value}))}
                          className="flex-1 min-w-[180px] rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-white placeholder:text-white/35"/>
                        <button disabled={linkBusy===o.id} className="inline-flex gap-1 items-center rounded-lg border border-cyan/30 px-3 py-2 text-xs text-cyan disabled:opacity-40"><Link2 size={13}/>{linkBusy===o.id?'Ukládám…':'Přiřadit Canvu'}</button>
                      </form>
                      <p className="text-xs text-white/40">Odkaz slouží pro otevření i editaci dle Canva oprávnění. Automatický export PDF je samostatný krok.</p>
                    </div>
                    <div className="rounded-xl bg-black/15 border border-white/10 p-4 space-y-3">
                      <h4 className="font-semibold text-sm text-white">Zákazník a e-mail</h4>
                      <p className="text-xs text-white/60">{o.client_name} · {o.client_company || 'bez firmy'}</p>
                      <p className="text-xs text-white/60">Odesílatel: {o.sender_email || 'neevidován'}</p>
                      <div className="flex gap-2 flex-wrap">
                        {o.client_email && <a target="_blank" rel="noopener noreferrer" href={'https://mail.google.com/mail/u/0/#search/'+encodeURIComponent('from:('+o.client_email+') OR to:('+o.client_email+')')} className="text-xs border border-white/20 rounded-lg px-3 py-2 text-white/80">Vyhledat komunikaci v Gmailu ↗</a>}
                        {o.client_email && <button type="button" disabled={draftBusy===o.id} onClick={()=>createGmailDraft(o)}
                          className="inline-flex gap-1 items-center text-xs border border-cyan/30 bg-cyan/10 rounded-lg px-3 py-2 text-cyan disabled:opacity-40">
                          <Mail size={13}/>{draftBusy===o.id?'Ověřuji…':'Vytvořit Gmail koncept'}
                        </button>}
                        <a target="_blank" rel="noopener noreferrer" href="https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts" className="text-xs border border-white/20 rounded-lg px-3 py-2 text-white/75">Gmail koncepty ↗</a>
                        {o.inquiry_id && <a href="/admin?tab=poptavky" className="text-xs border border-white/20 rounded-lg px-3 py-2 text-white/80">Přejít na poptávky</a>}
                      </div>
                      {lastEmail && <div className="rounded-lg border border-white/10 p-3 text-xs text-white/55">
                        <p>Poslední evidovaná komunikace: {lastEmail.subject || 'bez předmětu'} · {date(lastEmail.received_at)}</p>
                        {lastEmail.gmail_url && <a href={lastEmail.gmail_url} target="_blank" rel="noopener noreferrer" className="text-cyan">Otevřít Gmail vlákno ↗</a>}
                      </div>}
                      <div className="rounded-lg border border-white/10 p-3 text-xs text-white/55">
                        <p>AI schválení: {latestRun?.run_status || 'bez záznamu'}</p>
                        <p>Kontrola kvality: {latestRun?.qa_passed ? 'evidovaná' : 'vyžaduje kontrolu'} · Zdroje cen: {(latestRun?.pricing_sources || []).length}</p>
                        <a href="/admin?tab=approvals" className="mt-2 inline-block text-cyan">Otevřít schvalovací centrum ↗</a>
                      </div>
                      {actionMessage[o.id] && <p role="status" className="text-xs text-amber-200">{actionMessage[o.id]}</p>}
                      <p className="text-xs text-white/40">Server Gmailu před uložením ověřuje účet, cenu, schválení a PDF. Bez ověření ukládá pouze interní návrh. Žádné automatické odesílání.</p>
                    </div>
                  </div>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}