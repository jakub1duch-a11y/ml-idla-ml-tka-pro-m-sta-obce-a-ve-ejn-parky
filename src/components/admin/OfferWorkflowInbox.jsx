import React, { useCallback, useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, FileText, Inbox, RefreshCw, ShieldCheck, Copy, Database, Bot, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TYPE_LABELS={poptavka:'Webový formulář',contact:'Kontaktní formulář',gmail:'Odpověď v Gmailu'};
const formatDate=(v)=>{const date=new Date(v);return Number.isNaN(date.getTime())?'—':date.toLocaleString('cs-CZ',{dateStyle:'short',timeStyle:'short'});};

export default function OfferWorkflowInbox() {
  const [report,setReport]=useState(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [selected,setSelected]=useState(null);
  const [gateway,setGateway]=useState(null);
  const [gatewayError,setGatewayError]=useState('');
  const [providerBusy,setProviderBusy]=useState('');
  const [providerResult,setProviderResult]=useState(null);
  const refresh=useCallback(async()=>{
    setBusy(true);setError('');
    try{
      const result=await base44.functions.invoke('offerPipelineIntakePreflight',{});
      if(!result?.data?.ok)throw new Error(result?.data?.error||'readiness_failed');
      setReport(result.data);
      setSelected(null);
      setGateway(null);
      setProviderResult(null);
    }catch(ex){
      setError(ex?.response?.data?.error||ex.message||'Kontrolní přehled není dostupný.');
    }finally{setBusy(false);}
  },[]);
  const checkHubspot=async(item)=> {
    if (!item?.source_id) return;
    setProviderBusy('hubspot');setGatewayError('');setGateway(null);setProviderResult(null);
    try {
      const result=await base44.functions.invoke('hubspotOfferCaseGateway',{kind:item.kind,id:item.source_id});
      if(!result?.data?.ok)throw new Error(result?.data?.error||'crm_preflight_unavailable');
      setGateway({...result.data,case_id:item.id});
    }catch(ex){setGatewayError(ex?.response?.data?.message||ex?.response?.data?.error||ex.message||'HubSpot nelze ověřit.');}
    finally {setProviderBusy('');}
  };
  const handoffChatgpt=async(item)=> {
    if(gateway?.case_id!==item.id || !gateway?.crm_ready) return;
    setProviderBusy('chatgpt');setGatewayError('');
    try {
      await navigator.clipboard.writeText(gateway.provider_options.chatgpt.prompt);
      setProviderResult('Zadání bylo zkopírováno. Otevřete ChatGPT a vložte ho do nového chatu. Jde o ruční předání, nikoli spuštěné API.');
      window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
    }catch(ex){setGatewayError('Prohlížeč nepovolil kopírování. Předání do ChatGPT zatím nelze dokončit.');}
    finally{setProviderBusy('');}
  };
  const runBase44=async(item)=> {
    if(gateway?.case_id!==item.id || !gateway?.crm_ready || item.kind==='gmail')return;
    setProviderBusy('base44');setGatewayError('');setProviderResult(null);
    try{
      const result=await base44.functions.invoke('offerWorkflowPreflight',
        {inquiry_id:item.source_id,inquiry_type:item.inquiry_type});
      if(!result?.data?.ok)throw new Error(result?.data?.error||'preflight_failed');
      setProviderResult(`Base44 kontrola provedena. Blokací: ${result.data.blockers?.length||0}. Cenová nabídka ani Gmail koncept nebyly automaticky vytvořeny.`);
    }catch(ex){setGatewayError(ex?.response?.data?.error||ex.message||'Base44 kontrola selhala.');}
    finally{setProviderBusy('');}
  };
  const items=report?.cases||[];
  const active=items.find(x=>x.id===selected)||items[0]||null;
  return <section aria-labelledby="offer-inbox-title" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#008ea5]">Obchodní workflow / bezpečný příjem</p>
        <h2 id="offer-inbox-title" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#102b3a]"><Inbox size={21} className="text-[#008ea5]"/> Poptávky a odpovědi k přípravě nabídek</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Načte nové poptávky a příchozí obchodní odpovědi z evidovaných zpráv. Zobrazí překážky před tvorbou cenové nabídky. Tato kontrola nemění stav případu, nevytváří Gmail koncept a nic neodesílá.</p>
      </div>
      <button type="button" onClick={refresh} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#102b3a] px-4 text-sm font-semibold text-white disabled:opacity-50">
        <RefreshCw size={17} className={busy?'animate-spin':''}/> {busy?'Načítání…':'Zkontrolovat nové případy'}
      </button>
    </div>
    {error&&<p role="alert" className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle size={17}/>{error}</p>}
    {report&&<>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{[
        ['Webové poptávky',report.counts?.web],
        ['Kontaktní formuláře',report.counts?.contact],
        ['Gmail odpovědi',report.counts?.gmail],
        ['Případy v přehledu',report.counts?.shown],
      ].map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-[#f5f9fa] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums text-[#102b3a]">{value??'—'}</p></div>)}</div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200">
          {items.length===0?<p className="p-5 text-sm text-slate-500">V kontrolovaném rozsahu nebyly nalezeny případy vyžadující nabídku.</p>:
          items.map(item=><button type="button" key={item.id} onClick={()=>{setSelected(item.id);setGateway(null);setGatewayError('');setProviderResult(null);}} className={`flex w-full flex-col border-b border-slate-100 p-3 text-left hover:bg-[#f2fafb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008ea5] ${active?.id===item.id?'bg-[#e9f7f9]':''}`}>
            <span className="flex w-full justify-between gap-2"><strong className="truncate text-sm text-[#102b3a]">{item.customer||item.email||'Bez kontaktu'}</strong><span className="shrink-0 text-[10px] text-slate-500">{formatDate(item.received_at)}</span></span>
            <span className="mt-1 text-xs text-slate-600">{TYPE_LABELS[item.kind]||item.kind} · {item.product_name||item.subject||'Produkt k upřesnění'}</span>
          </button>)}
        </div>
        {active&&<article className="rounded-xl border border-slate-200 bg-[#f8fafb] p-4">
          <p className="text-[10px] uppercase tracking-widest text-[#008ea5]">Kontrola případu</p>
          <h3 className="mt-2 text-base font-bold text-[#102b3a]">{active.customer||active.email}</h3>
          <p className="mt-1 text-xs text-slate-600">{active.email}</p>
          <p className="mt-3 text-sm text-[#102b3a]">Produkt: <strong>{active.product_name||'Nutno spárovat'}</strong></p>
          <p className="mt-1 text-xs text-slate-500">Stav přípravy: {active.offer_run_status||'Nezpracováno'}</p>
          <h4 className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#102b3a]"><AlertTriangle size={16} className="text-amber-600"/> Nutné kontroly</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-700">
            {(active.blockers||[]).map((b,i)=><li key={i}>{b}</li>)}
          </ul>
          <p className="mt-4 text-xs text-slate-700">{active.next_step}</p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="flex items-center gap-2 text-sm font-bold text-[#102b3a]"><Database size={16}/> HubSpot je primární CRM</h4>
            <p className="mt-1 text-xs text-slate-600">Portál HolmTec 149778217. Před předáním agentovi ověřit správný účet a existující kontakt.</p>
            <button type="button" onClick={()=>checkHubspot(active)} disabled={Boolean(providerBusy)}
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#102b3a] px-3 text-xs font-semibold text-white disabled:opacity-50">
              <RefreshCw size={15} className={providerBusy==='hubspot'?'animate-spin':''}/> Ověřit případ v HubSpotu
            </button>
            {gateway?.case_id===active.id && <p role="status" className="mt-2 text-xs text-emerald-800">
              HubSpot ověřen · {gateway.contact_match?.hubspot_id?'Kontakt nalezen':'Kontakt zatím nenalezen'}.
              {gateway.contact_match?.ambiguous?' Duplicitní shoda: ruční kontrola.':''}
            </p>}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={()=>runBase44(active)}
                disabled={Boolean(providerBusy)||gateway?.case_id!==active.id||!gateway?.crm_ready||active.kind==='gmail'}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#008ea5] px-3 text-xs font-semibold text-[#006a7d] disabled:opacity-40">
                <Bot size={16}/> Spustit Base44 kontrolu
              </button>
              <button type="button" onClick={()=>handoffChatgpt(active)}
                disabled={Boolean(providerBusy)||gateway?.case_id!==active.id||!gateway?.crm_ready}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#008ea5] px-3 text-xs font-semibold text-white disabled:opacity-40">
                <Copy size={16}/> Předat do ChatGPT chatu
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Oddělené cesty: Base44 provádí skutečný interní preflight; ChatGPT otevře nový chat se zkopírovaným zadáním. API/MCP spuštění vyžaduje samostatnou autorizaci. Gemini bude možné přidat později.</p>
            <a href="https://app-eu1.hubspot.com/contacts/149778217/objects/0-3" target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-[#007c91] hover:underline">
              <ExternalLink size={14}/> Otevřít obchodní případy HubSpot
            </a>
            {providerResult&&<p role="status" className="mt-2 flex gap-2 text-xs text-[#0d6976]"><Sparkles size={16} className="shrink-0"/>{providerResult}</p>}
            {gatewayError&&<p role="alert" className="mt-2 text-xs text-red-700">{gatewayError}</p>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {active.gmail_url&&<a href={active.gmail_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-[#102b3a]"><ExternalLink size={14}/> Otevřít Gmail vlákno</a>}
            {active.kind!=='gmail'&&<a href="/admin?tab=poptavky" className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-[#102b3a]"><FileText size={14}/> Poptávky v administraci</a>}
          </div>
        </article>}
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-600"><ShieldCheck size={17} className="shrink-0 text-[#008ea5]"/> Ceny: pouze Kalkulace 2026, schválený produkt MASTER, Canva PDF s listem SUPLA, Gmail koncept jako konečný automatický výstup. Publikace a skutečné odeslání vyžadují kontrolu obchodníkem.</p>
      <p className="mt-1 flex items-start gap-2 text-xs text-[#0a6677]"><CheckCircle2 size={16}/> MLŽIDLA.cz – Pro příjemnější místa k životu.</p>
    </>}
  </section>;
}
