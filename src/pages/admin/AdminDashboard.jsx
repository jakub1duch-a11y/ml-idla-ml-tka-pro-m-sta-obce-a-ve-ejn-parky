import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, FileText, ClipboardCheck, Package, Users, Clock, RefreshCw, ExternalLink, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SOURCES = { Poptavka: 'Poptávky z webu', ContactInquiry: 'Kontaktní formuláře', WebAdvisorLead: 'Webový poradce', ProjectOrder: 'Nabídky a zakázky', OfferAgentRun: 'Schvalování', ProductionOrder: 'Výroba', CrmContact: 'CRM kontakty', AdminTask: 'Úkoly', SyncRun: 'Synchronizace' };
const LIMIT = 500;
const date = v => v && Number.isFinite(new Date(v).getTime()) ? new Date(v).toLocaleString('cs-CZ', { dateStyle:'short', timeStyle:'short' }) : '—';
const sheets = 'https://docs.google.com/spreadsheets/d/1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE/edit';
const drafts = 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts';
const panel = 'rounded-xl border border-white/10 bg-[#111820]';
export default function AdminDashboard() {
  const [data,setData] = useState({});
  const [failed,setFailed] = useState([]);
  const [loadedAt,setLoadedAt] = useState(null);
  const [busy,setBusy] = useState(true);
  const inFlight = useRef(false);
  const alive = useRef(true);
  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    const keys = Object.keys(SOURCES);
    try {
      const results = await Promise.allSettled(keys.map(async key => {
        const rows = await base44.entities[key].list('-created_date', LIMIT);
        if (!Array.isArray(rows)) throw new Error('Invalid response');
        return rows;
      }));
      if (!alive.current) return;
      setData(Object.fromEntries(keys.map((key,i) => [key, results[i].status === 'fulfilled' ? results[i].value : null])));
      setFailed(keys.filter((_,i) => results[i].status === 'rejected'));
      setLoadedAt(new Date());
    } finally { inFlight.current = false; if (alive.current) setBusy(false); }
  },[]);
  useEffect(() => {
    alive.current = true;
    load();
    const timer = setInterval(() => { if (document.visibilityState === 'visible') load(); },60000);
    const onVisible = () => { if(document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange',onVisible);
    return () => { alive.current = false; clearInterval(timer); document.removeEventListener('visibilitychange',onVisible); };
  },[load]);
  const count = (keys, predicate) => keys.some(k => !Array.isArray(data[k])) ? '—' : (keys.some(k => data[k].length >= LIMIT) ? '≥' : '') + keys.reduce((sum,k) => sum + data[k].filter(predicate).length,0);
  const cards = [
    ['Nové poptávky',Inbox,'poptavky',['Poptavka','ContactInquiry','WebAdvisorLead'],r=>['nova','new'].includes(r.status)],
    ['Rozpracované nabídky',FileText,'offers',['ProjectOrder'],r=>['draft','draft_ready_for_review','pending_approval'].includes(r.status)],
    ['Ke schválení',ClipboardCheck,'approvals',['OfferAgentRun'],r=>r.run_status==='pending_approval'],
    ['Odeslané / otevřené nabídky',FileText,'offers',['ProjectOrder'],r=>['sent','viewed','extension_requested'].includes(r.status)],
    ['Aktivní výrobní zakázky',Package,'orders',['ProductionOrder'],r=>!['completed','cancelled'].includes(r.status)],
    ['Kontakty k dalšímu kroku',Users,'crm',['CrmContact'],r=>r.action_required===true || ['needs_action','follow_up'].includes(r.status)],
    ['Úkoly po termínu',Clock,'tasks',['AdminTask'],r=>!['completed','cancelled'].includes(r.status)&&r.due_date&&new Date(r.due_date+'T23:59:59')<new Date()],
  ];
  const inquiries = [...(data.Poptavka||[]).map(r=>({...r,displayName:r.firma||r.jmeno,product:r.produkt})),...(data.ContactInquiry||[]).map(r=>({...r,displayName:r.name,product:r.service_type})),...(data.WebAdvisorLead||[]).map(r=>({...r,displayName:r.name||r.company,product:r.summary}))].sort((a,b)=>String(b.created_date).localeCompare(String(a.created_date))).slice(0,8);
  const runs = data.SyncRun || [];
  return <main className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-8">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-semibold tracking-wider text-cyan">OBCHODNÍ AGENDA</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Obchodní přehled</h1><p className="mt-2 text-sm text-white/60">Pracovní fronta, nabídky, kontakty a výroba.</p></div>
      <button type="button" onClick={load} disabled={busy} className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white disabled:opacity-50"><RefreshCw size={16} className={busy?'animate-spin':''}/> Obnovit přehled</button>
    </header>
    <div className="flex flex-wrap items-center gap-2 text-xs text-white/55"><span>Poslední načtení Base44: {date(loadedAt)}</span><span>· automatické obnovení zobrazení každou minutu</span></div>
    {failed.length>0 && <div role="alert" className="flex gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200"><AlertTriangle size={18} className="shrink-0"/> Nedostupné zdroje: {failed.map(k=>SOURCES[k]).join(', ')}. Neověřené hodnoty se zobrazují jako pomlčka.</div>}
    <section aria-label="Obchodní ukazatele" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map(([label,Icon,tab,keys,fn])=><Link key={label} to={'/admin?tab='+tab} className={panel+' min-w-0 p-4 hover:border-cyan/50 focus-visible:outline focus-visible:outline-cyan'}><Icon size={18} className="mb-3 text-cyan"/><p className="min-h-10 text-sm text-white/70">{label}</p><p className="mt-1 text-3xl font-semibold tabular-nums text-white">{count(keys,fn)}</p></Link>)}
      <a href={drafts} target="_blank" rel="noopener noreferrer" className={panel+' p-4 hover:border-cyan/50'}><FileText size={18} className="mb-3 text-cyan"/><p className="min-h-10 text-sm text-white/70">Koncepty Gmail</p><p className="mt-2 flex items-center gap-1 text-sm font-medium text-cyan">Otevřít <ExternalLink size={13}/></p></a>
    </section>
    <p className="text-xs text-white/45">Počty vycházejí z nejvýše 500 nejnovějších záznamů každého zdroje. Nejde o ověřený stav externích systémů.</p>
    <section className={panel+' overflow-hidden'}>
      <header className="flex items-center justify-between gap-3 border-b border-white/10 p-4"><h2 className="font-semibold text-white">Poslední poptávky v Base44</h2><Link to="/admin?tab=poptavky" className="text-sm text-cyan">Všechny <ChevronRight size={14} className="inline"/></Link></header>
      {inquiries.length ? <div className="divide-y divide-white/10">{inquiries.map(r=><div key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="break-words font-medium text-white">{r.displayName||'Bez názvu'}</p><p className="mt-1 break-words text-sm text-white/55">{String(r.product||'Produkt neuveden').slice(0,100)}</p></div><div className="text-xs text-white/60">{date(r.created_date)} · {r.status||'Stav neuveden'}</div></div>)}</div>:<p className="p-4 text-sm text-white/60">{busy?'Načítání…':failed.some(k=>['Poptavka','ContactInquiry','WebAdvisorLead'].includes(k))?'Zdroj není dostupný.':'V načtených datech nejsou poptávky.'}</p>}
    </section>
    <section className={panel+' p-4 sm:p-5'}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold text-white">Evidence a synchronizace</h2><Link to="/admin?tab=sales-hub" className="text-sm text-cyan">Správa synchronizace</Link></div>
      <p className="mt-2 text-sm text-white/60">Poslední evidované běhy, nikoli potvrzení aktivního plánovače.</p>
      <div className="mt-4 divide-y divide-white/10">{['gmail','google_sheets','google_drive','combined'].map(source=>{const r=runs.find(x=>x.source===source);return <div key={source} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span className="text-white/80">{{gmail:'Gmail',google_sheets:'Google Sheets',google_drive:'Google Drive',combined:'Společná synchronizace'}[source]}</span><span className={r?.status==='failed'?'text-amber-200':'text-white/60'}>{r?({completed:'Dokončeno',failed:'Chyba',running:'Probíhá'}[r.status]||r.status)+' · '+date(r.finished_at||r.started_at):'Bez ověřeného běhu'}</span></div>})}</div>
      <a href={sheets} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-cyan"><ExternalLink size={15}/> Otevřít zdrojovou obchodní tabulku</a>
      <p className="mt-4 flex items-center gap-2 text-xs text-white/60"><ShieldCheck size={16} className="text-cyan"/> Zákaznické zprávy se automaticky neodesílají.</p>
    </section>
  </main>;
}
