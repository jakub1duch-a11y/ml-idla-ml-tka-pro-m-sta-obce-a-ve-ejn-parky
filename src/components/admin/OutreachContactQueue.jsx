import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCopy, ExternalLink, MailPlus, RefreshCw, Search, ShieldCheck, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SOURCE_URL = 'https://docs.google.com/spreadsheets/d/1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE/edit#gid=1776486526';
const GMAIL_DRAFTS = 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts';
const STATUS = {
  new: 'Neoslovený – k ověření',
  needs_action: 'Vyžaduje kontrolu / koncept',
  contacted: 'Již oslovený',
  replied: 'Odpověď zákazníka',
  follow_up: 'Následná komunikace',
  declined: 'Neoslovovat',
  closed: 'Uzavřeno',
};
const normalize = (v) => String(v || '').trim().toLocaleLowerCase('cs-CZ');
const styles = 'min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#102b3a] hover:border-[#008ea5] disabled:cursor-not-allowed disabled:opacity-40';

export default function OutreachContactQueue() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('new');
  const [selected, setSelected] = useState(null);
  const [preflight, setPreflight] = useState(null);
  const [busy, setBusy] = useState(false);
  const [legalBasis, setLegalBasis] = useState(false);
  const [notice, setNotice] = useState('');
  const load = async () => {
    setLoading(true);setError('');
    try {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') throw new Error('forbidden');
      const data = await base44.entities.CrmContact.list('-updated_date', 1500);
      setContacts(Array.isArray(data) ? data : []);
    } catch {setError('Kontakty CRM nelze načíst. Ověřte přihlášení do administrace.');}
    finally {setLoading(false);}
  };
  useEffect(() => {load();}, []);
  const counts = useMemo(() => contacts.reduce((acc, c) => {acc[c.status || 'new'] = (acc[c.status || 'new'] || 0) + 1; return acc;}, {}), [contacts]);
  const filtered = useMemo(() => {
    const term=normalize(search);
    return contacts.filter(c => (filter === 'all' || (c.status || 'new') === filter) &&
      (!term || [c.email,c.name,c.organization,c.role].some(x => normalize(x).includes(term))))
      .sort((a,b) => normalize(a.organization).localeCompare(normalize(b.organization),'cs'));
  }, [contacts,filter,search]);
  const current = contacts.find(c => c.id === selected) || null;
  const select = (c) => {setSelected(c.id);setPreflight(null);setLegalBasis(false);setNotice('');setError('');};
  const check = async () => {
    if (!current) return;
    setBusy(true);setError('');setNotice('');setPreflight(null);setLegalBasis(false);
    try {
      const response=await base44.functions.invoke('outreachContactPreflight',{contact_id:current.id,action:'preview'});
      if(!response?.data?.ok)throw new Error(response?.data?.error||'preflight_failed');
      setPreflight(response.data);
    } catch(ex) {setError(`Ověření nelze dokončit (${String(ex?.response?.data?.error||ex?.message||'chyba').slice(0,90)}). Nic se neodeslalo.`);}
    finally {setBusy(false);}
  };
  const draft = async () => {
    if(!preflight?.can_create_draft || !legalBasis || !current) return;
    if(!window.confirm(`Vytvořit Gmail KONCEPT pro ${current.email} se schváleným PDF a náhledem? Nic se neodešle.`))return;
    setBusy(true);setError('');setNotice('');
    try {
      const response=await base44.functions.invoke('outreachContactPreflight',{
        contact_id:current.id,action:'draft',confirm:'VYTVORIT_KONCEPT',legal_basis_confirmed:true,source_row_status:preflight.source_status,
      });
      if(!response?.data?.ok || !response?.data?.created)throw new Error(response?.data?.error||'draft_failed');
      setNotice('Gmail koncept vytvořen s PDF a obrazovým náhledem. Zpráva NEBYLA odeslána.');
      setPreflight(null);setLegalBasis(false);
      await load();
    } catch(ex) {setError(`Gmail koncept nebyl potvrzen (${String(ex?.response?.data?.error||ex?.message||'chyba').slice(0,90)}). Zkontrolujte Gmail koncepty před opakováním.`);}
    finally {setBusy(false);}
  };
  const copy = async () => {
    if(!preflight) return;
    try {await navigator.clipboard.writeText(`Předmět: ${preflight.subject}\n\n${preflight.body}`);setNotice('Text zkopírován. Přílohy je nutné přiložit a ověřit odděleně.');}
    catch {setError('Kopírování nebylo povoleno prohlížečem.');}
  };
  return <section id="outreach-contacts" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="outreach-title">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#008ea5]">Obchodní centrum / první oslovení</p>
        <h2 id="outreach-title" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#102b3a]"><Users size={21} className="text-[#008ea5]"/> Kontakty k novému oslovení</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Pracovní fronta kontaktů z hlavní tabulky. Každý nový koncept vyžaduje ověření Gmailu, neosloveného stavu, organizace, seznamu NEOSLOVOVAT a originálních PDF/JPG příloh. Odesílání zde není povoleno.</p>
      </div>
      <button className={styles+' inline-flex items-center gap-2'} type="button" onClick={load} disabled={busy||loading}><RefreshCw size={15} className={loading?'animate-spin':''}/> Obnovit CRM</button>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {[
        ['Celkem v CRM',contacts.length],['Neoslovené',counts.new||0],['Ke kontrole',counts.needs_action||0],['Již oslovené',counts.contacted||0]
      ].map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-[#f6fafb] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums text-[#102b3a]">{loading?'…':value}</p></div>)}
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      <label className="relative min-w-[230px] flex-1"><Search size={17} className="absolute left-3 top-3 text-slate-500"/><span className="sr-only">Hledat kontakt</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Organizace, jméno nebo e-mail" className="min-h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm"/></label>
      <label><span className="sr-only">Stav kontaktů</span><select className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm" value={filter} onChange={e=>{setFilter(e.target.value);setSelected(null);setPreflight(null);}}><option value="all">Všechny stavy</option>{Object.entries(STATUS).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="max-h-[500px] overflow-y-auto rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 p-3 text-xs text-slate-500">{filtered.length} odpovídajících kontaktů · zobrazeno prvních {Math.min(100,filtered.length)}</div>
        {filtered.slice(0,100).map(c=><button key={c.id} type="button" onClick={()=>select(c)} className={`block w-full border-b border-slate-100 p-3 text-left hover:bg-[#e8f6f8] ${current?.id===c.id?'bg-[#e8f6f8]':''}`}>
          <p className="text-sm font-semibold text-[#102b3a]">{c.organization||c.name||c.email}</p><p className="mt-1 truncate text-xs text-slate-600">{c.name?`${c.name} · `:''}{c.email}</p>
          <p className="mt-1 text-[11px] text-slate-500">{STATUS[c.status]||c.status||'Neurčeno'} · řádek {c.sheet_row||'—'}</p>
        </button>)}
        {!loading && filtered.length===0 && <p className="p-4 text-sm text-slate-500">Žádné kontakty pro zvolený filtr.</p>}
      </div>
      <article className="rounded-xl border border-slate-200 bg-[#f7fafb] p-4">
        {!current ? <p className="text-sm text-slate-500">Vyberte kontakt. Nejprve zobrazíme aktuální kontrolu; případný Gmail koncept se vytváří samostatným potvrzením.</p> : <>
          <h3 className="text-base font-bold text-[#102b3a]">{current.organization||current.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{current.name} · {current.email}</p>
          <p className="mt-2 text-xs text-slate-600">{STATUS[current.status]||current.status} · Zdroj: {current.sheet_name||'jiný'} / {current.sheet_row||'—'}</p>
          {current.next_step && <p className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700">{current.next_step}</p>}
          <button disabled={busy||loading} type="button" onClick={check} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#102b3a] px-4 text-sm font-semibold text-white disabled:opacity-40"><ShieldCheck size={17}/> Ověřit oslovení a přílohy</button>
          {preflight && <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs"><strong>Stav zdroje:</strong> {preflight.source_status}<br/><strong>PDF:</strong> {preflight.attachments.pdf?.name||'Neověřeno'}<br/><strong>Obrázek:</strong> {preflight.attachments.image?.name||'Neověřeno'}</div>
            {preflight.blockers?.length > 0 && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><p className="flex items-center gap-1 font-semibold"><AlertTriangle size={15}/> Koncept zatím nelze založit</p><ul className="mt-2 list-disc space-y-1 pl-5 text-xs">{preflight.blockers.map((b,i)=><li key={i}>{b}</li>)}</ul></div>}
            <div className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-xs font-bold text-[#102b3a]">{preflight.subject}</p><p className="mt-2 max-h-52 overflow-auto whitespace-pre-line text-xs leading-5 text-slate-700">{preflight.body||'Text chybí.'}</p></div>
            <button className={styles+' inline-flex items-center gap-2'} type="button" onClick={copy}><ClipboardCopy size={15}/> Zkopírovat text</button>
            {preflight.can_create_draft && <label className="flex gap-2 text-xs leading-5 text-slate-700"><input type="checkbox" checked={legalBasis} onChange={e=>setLegalBasis(e.target.checked)} /> Ověřil jsem oprávněnost oslovení, příjemce, přílohy a historii komunikace. Založím pouze koncept, bez odeslání.</label>}
            <button type="button" onClick={draft} disabled={busy||!preflight.can_create_draft||!legalBasis} className="flex min-h-11 items-center gap-2 rounded-lg bg-[#008ea5] px-4 text-sm font-semibold text-white disabled:opacity-40"><MailPlus size={17}/> Vytvořit Gmail koncept s PDF a obrázkem</button>
          </div>}
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[#007e94]"><a href={GMAIL_DRAFTS} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1"><ExternalLink size={14}/> Gmail koncepty</a><a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1"><ExternalLink size={14}/> Zdrojová tabulka</a>{current.thread_url&&<a href={current.thread_url} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1"><ExternalLink size={14}/> Předchozí vlákno</a>}</div>
        </>}
      </article>
    </div>
    <p className="mt-4 flex gap-2 text-xs text-slate-500"><CheckCircle2 size={15} className="shrink-0 text-[#008ea5]"/> Ověření a import CRM neznamenají odeslání. Gmail koncept lze vytvořit pouze z autorizovaného firemního účtu a se skutečně přístupnými přílohami. HubSpot a Sites vyžadují samostatně ověřené přenosy.</p>
  </section>;
}
