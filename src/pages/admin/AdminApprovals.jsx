import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ClipboardCheck, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';

const STATUS = { intake:'Přijato', needs_input:'Chybí podklady', solution:'Technické řešení', pricing:'Kalkulace', visualization:'Vizualizace', document:'Dokument', qa:'Kontrola kvality', pending_approval:'Čeká na schválení', approved:'Schváleno', sent:'Odesláno', failed:'Chyba' };
export default function AdminApprovals() {
  const [runs,setRuns] = useState([]);
  const [assets,setAssets] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [filter,setFilter] = useState('pending');
  const [busy,setBusy] = useState('');
  const refresh = async () => {
    setLoading(true);setError('');
    try {
      const [r,a] = await Promise.all([base44.entities.OfferAgentRun.list('-created_date',200),base44.entities.OfferAsset.list('-created_date',300)]);
      setRuns(Array.isArray(r)?r:[]);setAssets(Array.isArray(a)?a:[]);
    } catch(e) {setError(e?.message || 'Nelze načíst schvalovací podklady.');}
    finally {setLoading(false);}
  };
  useEffect(()=>{refresh();},[]);
  const shown = runs.filter(r=>filter==='all'||(filter==='pending'?r.run_status==='pending_approval':r.run_status===filter));
  const approve = async (r) => {
    if (!window.confirm('Schválit tuto nabídku? Tím se nabídka pouze schválí, neodešle.')) return;
    setBusy(r.id);setError('');
    try {
      const response = await base44.functions.invoke('approveOfferConcept',{action:'approve_run',run_id:r.id,confirm_approval:true});
      if (response?.data?.error) throw new Error(response.data.error);
      await refresh();
    } catch(e){setError(e?.message||'Schválení nebylo provedeno.');}
    finally {setBusy('');}
  };
  const returnForRevision = async (r) => {
    const note = window.prompt('Co má AI opravit? (povinné)');
    if (!note?.trim()) return;
    setBusy(r.id);setError('');
    try {
      await base44.entities.OfferAgentRun.update(r.id,{run_status:'needs_input',approval_required:true,send_allowed:false,notes:[r.notes, 'Vráceno k úpravě: '+note.trim()].filter(Boolean).join('\n').slice(-5000)});
      await refresh();
    } catch(e){setError(e?.message||'Vrácení k úpravě se nezdařilo.');}
    finally {setBusy('');}
  };
  return <div className="p-5 md:p-8 text-white max-w-6xl mx-auto">
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div><h1 className="text-2xl font-semibold flex items-center gap-3"><ClipboardCheck className="text-cyan-400"/>Schvalovací centrum</h1><p className="text-white/55 text-sm mt-2">Kontrola výstupů AI a obchodního workflow před použitím nebo odesláním.</p></div>
      <button onClick={refresh} className="px-4 py-2 rounded-lg border border-white/20 flex gap-2 items-center"><RefreshCw size={16}/>Aktualizovat</button>
    </div>
    <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm text-amber-100 mb-6 flex gap-3"><AlertTriangle size={20} className="shrink-0"/>Schválení kontroluje server: pouze určený vlastník, dokončené QA a uvedené zdroje cen. Schválení nabídku neodesílá. Před ostrým použitím je nutný test přihlášených rolí a odesílací funkce.</div>
    <div className="flex gap-2 flex-wrap mb-5">{[['pending','Čeká na mě'],['needs_input','K doplnění'],['approved','Schválené'],['sent','Odeslané'],['failed','Chyby'],['all','Vše']].map(([id,label])=><button key={id} onClick={()=>setFilter(id)} className={'rounded-full px-4 py-2 text-sm border '+(filter===id?'border-cyan-400 text-cyan-300 bg-cyan-400/10':'border-white/15 text-white/60')}>{label}{id==='pending'?' ('+runs.filter(x=>x.run_status==='pending_approval').length+')':''}</button>)}</div>
    {error&&<p role="alert" className="text-red-300 mb-4">{error}</p>}
    {loading?<p className="text-white/50">Načítám záznamy…</p>:shown.length===0?<div className="border border-white/10 rounded-xl p-8 text-white/50">V tomto stavu nejsou evidované žádné položky.</div>:<div className="space-y-4">{shown.map(r=>{
      const files=assets.filter(a=>a.inquiry_id===r.inquiry_id||(r.project_order_id&&a.project_order_id===r.project_order_id));
      return <article key={r.id} className="rounded-xl border border-white/15 bg-white/[.03] p-5">
        <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-medium text-lg">Nabídka / poptávka {r.inquiry_id||r.project_order_id||r.id}</h2><p className="text-white/50 text-xs mt-1">Zdroj: {r.inquiry_type||'—'} · Stav: {STATUS[r.run_status]||r.run_status} · ID běhu: {r.id}</p></div><span className="text-sm text-cyan-300">{r.qa_passed?'QA dokončeno':'QA nepotvrzeno'}</span></div>
        <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm"><div><span className="text-white/40">Produkty:</span> {(r.selected_product_slugs||[]).join(', ')||'Neuvedeno'}</div><div><span className="text-white/40">Cenové zdroje:</span> {(r.pricing_sources||[]).join(', ')||'Neověřeno'}</div></div>
        {r.notes&&<p className="mt-3 text-sm text-white/70 whitespace-pre-wrap">{r.notes}</p>}
        {r.last_error&&<p className="mt-3 text-sm text-red-300">{r.last_error}</p>}
        <div className="mt-4"><h3 className="text-sm font-medium mb-2">Přílohy, vizualizace, Canva a PDF ({files.length})</h3>{files.length?<div className="flex flex-wrap gap-2">{files.map(f=><a key={f.id} href={f.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1.5 items-center rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-cyan-400">{f.title||f.file_name}<ExternalLink size={13}/></a>)}</div>:<p className="text-white/40 text-sm">K tomuto běhu nejsou evidované přílohy.</p>}</div>
        {r.run_status==='pending_approval'&&<div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/10"><button disabled={busy===r.id || !r.qa_passed || !(r.pricing_sources||[]).length} onClick={()=>approve(r)} className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-200 disabled:opacity-40">Schválit nabídku</button><button disabled={busy===r.id} onClick={()=>returnForRevision(r)} className="px-4 py-2 rounded-lg border border-white/25 hover:bg-white/10">Vrátit k úpravě</button><span className="text-white/40 text-xs self-center">Odeslání není z této stránky možné</span></div>}
      </article>;
    })}</div>}
  </div>;
}
