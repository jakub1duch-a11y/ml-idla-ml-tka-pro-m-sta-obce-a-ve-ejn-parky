import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, RefreshCw, ShieldCheck, Mail, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PORTAL_ID = 149778217;
const fmt = (value) => {
  const d = new Date(value || '');
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('cs-CZ',{dateStyle:'medium',timeStyle:'short'});
};
const norm = (value) => String(value || '').toLowerCase().trim();
const classify = (value) => ({
  mlzidla: 'Mlžidla.cz',
  holmtec_candidate: 'Možná HolmTec · ověřit',
  unassigned: 'Nezařazeno · ověřit',
}[value] || 'Nezařazeno · ověřit');
function hubspotUrl(id) {
  const filters = encodeURIComponent(JSON.stringify([{property:'hs_object_id',operator:'EQ',value:String(id)}]));
  return `https://app.hubspot.com/contacts/${PORTAL_ID}/objects/0-49?filters=${filters}`;
}
function MessageCard({ message, gmailUrl }) {
  const [expanded,setExpanded] = useState(false);
  const incoming = message.direction === 'INCOMING_EMAIL' || message.direction === 'inbound';
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className={incoming ? 'text-blue-800' : 'text-emerald-800'}>{incoming?'Přijato':'Odesláno / evidováno'}</span>
          {message.is_customer_agent && <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-900">AI Customer Agent</span>}
          {message.brand_hint && <span className="text-slate-500">{classify(message.brand_hint)}</span>}
        </div>
        <h3 className="mt-2 break-words font-semibold text-[#102b3a]">{message.subject || 'Bez předmětu'}</h3>
        <p className="mt-1 text-xs text-slate-500">{fmt(message.timestamp || message.received_at)} · {message.status || message.direction || 'Zpráva'}</p>
        {(message.from_email || message.to_email) && <p className="mt-1 break-all text-xs text-slate-500">Od: {message.from_email || '—'} · Komu: {message.to_email || '—'}</p>}
      </div>
      <button type="button" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}
        className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-[#102b3a]">
        {expanded?'Skrýt text':'Zobrazit text'} {expanded?<ChevronUp size={15}/>:<ChevronDown size={15}/>}
      </button>
    </div>
    {expanded && <div className="mt-4 max-h-[30rem] overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-[#f5f8fa] p-4 text-xs leading-6 text-slate-700">
      {message.body_text || 'Úplný text není v tomto zdroji k dispozici.'}
    </div>}
    <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-[#007c91]">
      {message.id && <a href={hubspotUrl(message.id)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1">Záznam v HubSpotu <ExternalLink size={13}/></a>}
      {gmailUrl && <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1">Původní vlákno Gmail <ExternalLink size={13}/></a>}
    </div>
  </article>;
}
export default function AdminHubSpot() {
  const [messages,setMessages] = useState([]);
  const [gmail,setGmail] = useState([]);
  const [checkedAt,setCheckedAt] = useState(null);
  const [total,setTotal] = useState(null);
  const [cursor,setCursor] = useState(null);
  const [nextCursor,setNextCursor] = useState(null);
  const [history,setHistory] = useState([]);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [gmailError,setGmailError] = useState('');
  const [filter,setFilter] = useState('all');
  const [query,setQuery] = useState('');
  const [source,setSource] = useState('hubspot');

  const load = useCallback(async (after = null) => {
    setBusy(true);setError('');
    try {
      const response = await base44.functions.invoke('hubspotCommunicationAudit',{limit:30, ...(after?{after}:{})});
      const data = response?.data || response;
      if (!data?.ok || data.portal_id !== PORTAL_ID || data.mode !== 'read_only') throw new Error(data?.error || 'Neověřené propojení HubSpot');
      setMessages(data.messages || []);
      setTotal(data.total ?? null);
      setCheckedAt(data.checked_at);
      setNextCursor(data.next_after || null);
      setCursor(after);
    } catch (ex) {
      setMessages([]);setNextCursor(null);
      setError(ex?.message || 'Historii HubSpotu nelze aktuálně načíst.');
    } finally {setBusy(false);}
  },[]);
  useEffect(()=>{load();},[load]);
  useEffect(()=>{
    let alive=true;
    base44.entities.EmailMessage.list('-received_at',300).then(items=>{
      if(alive)setGmail(items || []);
    }).catch(()=>{
      if(alive)setGmailError('Interní archiv Gmail není dostupný. Původní zprávy zůstávají v Gmailu.');
    });
    return ()=>{alive=false;};
  },[]);
  const visible = useMemo(()=>{
    const list = source==='hubspot' ? messages : gmail.map(m=>({
      ...m, timestamp:m.received_at,
      direction:m.direction,
      is_customer_agent:/MLZIDLAcz Customer Agent/i.test(m.body_text || ''),
      brand_hint: /mlžidla|mlzidla|mlžítk|mlzitk/i.test(m.subject || '') ? 'mlzidla' : /holmtec|trubk|ohýbán|ohyb/i.test(m.subject || '') ? 'holmtec_candidate' : 'unassigned',
    }));
    return list.filter(m=>{
      const incoming=m.direction==='inbound' || m.direction==='INCOMING_EMAIL';
      const matches = filter==='all' || (filter==='outbound'&&!incoming) || (filter==='inbound'&&incoming) || (filter==='agent'&&m.is_customer_agent);
      const searchable=[m.subject,m.body_text,m.from_email,m.to_email,m.contact_email].join(' ').toLowerCase();
      return matches && (!query || searchable.includes(norm(query)));
    });
  },[messages,gmail,source,filter,query]);
  const next = () => { if(nextCursor){setHistory(p=>[...p,cursor]);load(nextCursor);} };
  const previous=()=>{const old=history.at(-1) || null;setHistory(h=>h.slice(0,-1));load(old);};
  return <section className="mx-auto max-w-6xl space-y-5 p-4 sm:p-7" aria-labelledby="hubspot-title">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#008ea5]">Obchodní centrum / HubSpot · Gmail</p>
        <h1 id="hubspot-title" className="mt-1 text-2xl font-bold text-[#102b3a]">Historie obchodní komunikace</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">HubSpot portál {PORTAL_ID} · účet meduna@holmtec.cz. Přehled pouze čte již evidované zprávy, nic neodesílá ani nevytváří nové kontakty.</p>
      </div>
      <button type="button" disabled={busy} onClick={()=>{setHistory([]);load(null);}}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#102b3a] px-4 text-sm font-semibold text-white disabled:opacity-50">
        <RefreshCw size={16} className={busy?'animate-spin':''}/> Obnovit historii
      </button>
    </header>
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <AlertTriangle size={19} className="mt-0.5 shrink-0"/>
      <div><strong>Automatické odesílání zatím nepovolovat.</strong> Toto zobrazení žádné e-maily neodesílá. Ověření vypnutí odpovědí „MLZIDLAcz Customer Agent“ v nastavení HubSpotu je samostatný nutný krok.</div>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">E-mailové události v HubSpotu</p><p className="mt-1 text-2xl font-bold text-[#102b3a]">{total??'—'}</p></div>
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Načtené zprávy Gmail v Base44</p><p className="mt-1 text-2xl font-bold text-[#102b3a]">{gmail.length}</p><p className="text-[11px] text-slate-500">Max. 300, archiv nemusí být úplný</p></div>
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Poslední kontrola HubSpotu</p><p className="mt-2 text-sm font-semibold text-[#102b3a]">{fmt(checkedAt)}</p></div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {[['hubspot','HubSpot – aktuální CRM'],['gmail','Gmail – interní archiv']].map(([key,label])=>
          <button key={key} type="button" onClick={()=>setSource(key)} aria-pressed={source===key} className={`min-h-10 rounded-lg px-4 text-xs font-semibold ${source===key?'bg-[#102b3a] text-white':'bg-slate-100 text-slate-700'}`}>{label}</button>)}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1"><span className="sr-only">Hledat v načtených zprávách</span><Search size={16} className="pointer-events-none absolute left-3 top-3 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Hledat v načtených zprávách" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-[#102b3a]"/></label>
        <select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filtrovat zprávy" className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-[#102b3a]">
          <option value="all">Všechny zprávy</option><option value="outbound">Odchozí</option><option value="inbound">Příchozí</option><option value="agent">AI Customer Agent</option>
        </select>
      </div>
      <p className="mt-2 text-xs text-slate-500">Filtry a hledání se vztahují k právě načtené stránce. Pro úplný export je potřeba projít další stránky.</p>
    </div>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {source==='gmail' && gmailError && <p role="alert" className="text-sm text-amber-800">{gmailError}</p>}
    <div className="space-y-3">
      {busy && <p role="status" className="text-sm text-slate-600">Načítání…</p>}
      {!busy && visible.length===0 && <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">V načtených záznamech nejsou zprávy odpovídající filtru.</p>}
      {visible.map(m=><MessageCard key={m.id || m.gmail_message_id} message={m} gmailUrl={source==='gmail'?m.gmail_url:null}/>)}
    </div>
    {source==='hubspot' && <div className="flex items-center justify-between gap-3">
      <button type="button" onClick={previous} disabled={!history.length||busy} className="min-h-10 rounded-lg border border-slate-300 px-3 text-xs font-semibold disabled:opacity-40">Předchozí</button>
      <span className="text-xs text-slate-500">{messages.length} zpráv na této stránce</span>
      <button type="button" onClick={next} disabled={!nextCursor||busy} className="min-h-10 rounded-lg border border-slate-300 px-3 text-xs font-semibold disabled:opacity-40">Další zprávy</button>
    </div>}
    <footer className="flex flex-wrap gap-4 border-t border-slate-200 pt-4 text-xs text-slate-600">
      <span className="inline-flex items-center gap-1"><ShieldCheck size={15}/> Pouze čtení · žádné odesílání</span>
      <a className="inline-flex items-center gap-1 font-semibold text-[#007c91]" href="https://app-eu1.hubspot.com/contacts/149778217/objects/0-3" target="_blank" rel="noopener noreferrer">Obchodní případy HubSpot <ExternalLink size={13}/></a>
      <a className="inline-flex items-center gap-1 font-semibold text-[#007c91]" href="https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#sent" target="_blank" rel="noopener noreferrer"><Mail size={13}/> Gmail Odeslané <ExternalLink size={13}/></a>
    </footer>
  </section>;
}
