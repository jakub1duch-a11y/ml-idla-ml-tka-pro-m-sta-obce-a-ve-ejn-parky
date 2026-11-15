import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, ExternalLink, Eye, FileText, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CHECKS = [
  { key:'recipient_and_pdf', label:'Zkontroloval jsem příjemce, číslo nabídky a skutečné PDF přílohy.' },
  { key:'product_and_geometry', label:'Varianta produktu, rozměry, materiál a trysky odpovídají výrobním podkladům.' },
  { key:'pricing_vat', label:'Položkové ceny, součet, DPH a platnost nabídky jsou ověřené.' },
  { key:'brand_and_attachments', label:'Fotografie, vizualizace, text a logo odpovídají identitě MLŽIDLA.cz.' },
];
const CANVA_TEMPLATE='https://www.canva.com/d/_-XHlZkPRAv5TED';

export default function OfferEmailPreview({ projectId, quoteNumber, clientEmail }) {
  const [preview,setPreview]=useState(null);
  const [checks,setChecks]=useState([]);
  const [loading,setLoading]=useState('');
  const [error,setError]=useState('');
  const [draft,setDraft]=useState(null);
  const fetchPreview=async()=>{
    if(!projectId)return;
    setLoading('preview');setError('');setDraft(null);
    try {
      const response=await base44.functions.invoke('offerDeliveryApproval',{project_id:projectId,action:'preview'});
      if(!response?.data?.ok)throw new Error(response?.data?.error||'Náhled nelze načíst.');
      setPreview(response.data);setChecks([]);
    }catch(e){setError(e?.response?.data?.error||e?.message||'Náhled nelze načíst.');}
    finally{setLoading('');}
  };
  const createDraft=async()=>{
    if(!preview?.can_create_draft || checks.length!==CHECKS.length || loading)return;
    if(!window.confirm('Vytvořit pouze Gmail KONCEPT pro '+preview.recipient+' s ověřenými PDF přílohami? Zpráva nebude odeslána.'))return;
    setLoading('draft');setError('');
    try {
      const response=await base44.functions.invoke('offerDeliveryApproval',{
        project_id:projectId,action:'create_draft',confirm_create:true,
        expected_recipient:preview.recipient,expected_pdf_url:preview.quote_pdf_url,
        confirmed_checks:checks
      });
      if(!response?.data?.ok)throw new Error(response?.data?.error||'Koncept se nepodařilo vytvořit.');
      setDraft(response.data);setPreview(null);
    }catch(e){setError(e?.response?.data?.blockers?.join(' ')||e?.response?.data?.error||e?.message||'Uložení konceptu selhalo.');}
    finally{setLoading('');}
  };
  return <section aria-label="Schválení a náhled klientské nabídky" className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-[#102b3a] sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#008ea5]">MLŽIDLA.cz / schválení nabídky</p>
        <h3 className="mt-1 flex items-center gap-2 text-lg font-bold"><Mail size={18} className="text-[#008ea5]"/>Náhled e-mailu zákazníkovi</h3>
        <p className="mt-1 text-xs text-slate-600">Nabídka {quoteNumber||'bez čísla'} · {clientEmail||'neznámý příjemce'} · skutečné odeslání je vždy ruční.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <a href={CANVA_TEMPLATE} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold hover:border-[#008ea5]"><FileText size={14}/> Canva šablona <ExternalLink size={12}/></a>
        <button type="button" onClick={fetchPreview} disabled={!!loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#102b3a] px-3 text-xs font-semibold text-white disabled:opacity-50">{loading==='preview'?<Loader2 size={14} className="animate-spin"/>:<Eye size={14}/>} {loading==='preview'?'Načítám…':'Zkontrolovat doručený vzhled'}</button>
      </div>
    </div>
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-cyan-100 bg-[#f3fafc] p-3 text-xs leading-5 text-[#19475b]">
      <ShieldCheck size={16} className="mt-0.5 shrink-0"/><p>Náhled nic neodesílá. Gmail koncept vznikne pouze po schválení a po ověření firemního účtu, HubSpot kontaktu a fyzického PDF.</p>
    </div>
    {error&&<p role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-800"><AlertTriangle size={15}/>{error}</p>}
    {draft&&<div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="mr-2 inline" size={17}/>Gmail koncept vytvořen pro {draft.recipient}. {draft.attachments?.length||0} PDF příloh. Zpráva nebyla odeslána. {draft.audit_saved===false&&'Zkontrolujte auditní záznam v administraci.'}<a href="https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts" target="_blank" rel="noopener noreferrer" className="mt-2 block font-semibold underline">Otevřít Gmail koncepty <ExternalLink size={12} className="inline"/></a></div>}
    {preview&&<>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-[#f5f9fa] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Příjemce</p><p className="mt-1 break-all text-sm font-semibold">{preview.recipient}</p></div>
        <div className="rounded-xl bg-[#f5f9fa] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CRM</p><p className="mt-1 text-sm font-semibold">{preview.hubspot_contact_id?'HubSpot 149778217 · kontakt ověřen':'HubSpot · vyžaduje kontrolu'}</p></div>
      </div>
      <p className="mt-3 text-sm font-semibold">{preview.subject}</p>
      <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">
        <iframe sandbox="" srcDoc={preview.html} title="Bezpečný náhled HTML e-mailu pro zákazníka" className="h-[520px] w-full border-0 bg-white"/>
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 p-3">
        <h4 className="text-xs font-bold">PDF přílohy a vizualizace</h4>
        <p className="mt-1 text-xs text-slate-600">Fyzická cenová nabídka PDF je povinná. Další prezentační PDF se připojí, pokud je dostupné a ověřené.</p>
        <ul className="mt-2 list-inside list-disc text-xs text-slate-700">{(preview.attachments||[]).map((x,i)=><li key={i}>{x.name}</li>)}</ul>
      </div>
      {preview.blockers?.length>0&&<div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3"><p className="flex gap-2 text-xs font-bold text-amber-900"><AlertTriangle size={15}/> Co je nutné před vytvořením konceptu doplnit</p><ul className="mt-2 list-inside list-disc space-y-1 text-xs text-amber-900">{preview.blockers.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
      <fieldset className="mt-4 space-y-3" disabled={!preview.can_create_draft}>
        <legend className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#102b3a]"><ClipboardCheck size={16}/> Kontrola obchodníkem</legend>
        {CHECKS.map(x=><label key={x.key} className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-700"><input type="checkbox" className="mt-1 accent-[#008ea5]" checked={checks.includes(x.key)} onChange={e=>setChecks(v=>e.target.checked?[...v,x.key]:v.filter(k=>k!==x.key))}/><span>{x.label}</span></label>)}
      </fieldset>
      <button type="button" onClick={createDraft} disabled={loading!==''||!preview.can_create_draft||checks.length!==CHECKS.length} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#008ea5] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
        {loading==='draft'?<Loader2 className="animate-spin" size={16}/>:<Mail size={16}/>} {loading==='draft'?'Ukládám…':'Schválit a vytvořit Gmail koncept s PDF'}
      </button>
    </>}
  </section>;
}
