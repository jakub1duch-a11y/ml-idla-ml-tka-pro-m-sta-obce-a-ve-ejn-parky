import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ClipboardCheck, FileText, Users, Workflow, PlugZap, ArrowUpRight, ShieldCheck, Bot, AlertTriangle } from 'lucide-react';

const LINKS=[
  {label:'Schvalovací centrum',tab:'approvals',Icon:ClipboardCheck,description:'Nabídky a podklady ke kontrole'},
  {label:'Poptávky',tab:'poptavky',Icon:FileText,description:'Příchozí požadavky zákazníků'},
  {label:'Obchodní centrum',tab:'sales-hub',Icon:Users,description:'Klienti, případy a nabídky'},
  {label:'Workflow a úkoly',tab:'tasks',Icon:Workflow,description:'Postup práce a odpovědnosti'},
  {label:'Integrace',tab:'integrations',Icon:PlugZap,description:'Stav konektorů a AI'}
];
const asList = v=>Array.isArray(v)?v:[];
export default function OperationsOverview(){
 const navigate=useNavigate();
 const [data,setData]=useState({runs:[],tasks:[],integrations:[],providers:[]});
 const [failed,setFailed]=useState([]);
 useEffect(()=>{let live=true;Promise.allSettled([
  base44.entities.OfferAgentRun.list('-created_date',200),
  base44.entities.AdminTask.list('-updated_date',100),
  base44.entities.SuperAgentIntegration.list('sort_order',100),
  base44.entities.AIProviderConfig.list('priority',50)
 ]).then(results=>{if(!live)return;setData({runs:asList(results[0].status==='fulfilled'?results[0].value:[]),tasks:asList(results[1].status==='fulfilled'?results[1].value:[]),integrations:asList(results[2].status==='fulfilled'?results[2].value:[]),providers:asList(results[3].status==='fulfilled'?results[3].value:[])});setFailed(results.map((x,i)=>x.status==='rejected'?['Nabídky','Úkoly','Konektory','AI'][i]:null).filter(Boolean));});return()=>{live=false};},[]);
 const pending=data.runs.filter(x=>x.run_status==='pending_approval').length;
 const issues=data.runs.filter(x=>['failed','needs_input'].includes(x.run_status)).length;
 const tasks=data.tasks.filter(x=>!['completed','cancelled'].includes(x.status)).length;
 const connected=data.integrations.filter(x=>x.connected&&!String(x.status||'').startsWith('blocked')).length;
 const openai=data.providers.find(x=>/openai|chatgpt/i.test([x.provider_key,x.display_name].join(' ')));
 const openaiStatus=openai?.status||'unconfigured';
 return <section className="space-y-5" aria-label="Obchodní operační přehled">
  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
   <div><p className="text-[11px] uppercase tracking-[.2em] text-cyan font-semibold">MLŽIDLA / COMMAND CENTER</p><h2 className="text-2xl md:text-3xl font-semibold text-white mt-1">Obchodní a AI workflow</h2><p className="text-sm text-white/50 mt-2">Jedno místo pro nabídky, zákazníky, schvalování a napojení systémů.</p></div>
   <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/5 px-3 py-2 text-xs text-amber-200"><ShieldCheck size={15}/> Odesílání pouze po vašem schválení</div>
  </div>
  {failed.length>0&&<div role="status" className="flex gap-2 text-amber-200 text-sm"><AlertTriangle size={16}/> Nelze ověřit: {failed.join(', ')}. Nezobrazené hodnoty nejsou potvrzené.</div>}
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
   {[{name:'Ke schválení',value:failed.includes('Nabídky')?'—':pending,Icon:ClipboardCheck,tab:'approvals',accent:'text-cyan'},{name:'Vyžaduje opravu',value:failed.includes('Nabídky')?'—':issues,Icon:AlertTriangle,tab:'approvals',accent:'text-amber-300'},{name:'Otevřené úkoly',value:failed.includes('Úkoly')?'—':tasks,Icon:Workflow,tab:'tasks',accent:'text-white'},{name:'Evidovaná napojení',value:failed.includes('Konektory')?'—':connected,Icon:PlugZap,tab:'integrations',accent:'text-emerald-300'}].map(s=><button key={s.name} onClick={()=>navigate('/admin?tab='+s.tab)} className="rounded-2xl border border-white/10 bg-[#121c29] p-4 md:p-5 text-left hover:border-cyan/40 transition-colors"><div className="flex justify-between items-center text-white/50 text-xs"><span>{s.name}</span><s.Icon size={17}/></div><div className={'text-3xl font-semibold mt-4 '+s.accent}>{s.value}</div><span className="inline-flex gap-1 items-center text-[11px] text-white/40 mt-3">Otevřít <ArrowUpRight size={12}/></span></button>)}
  </div>
  <div className="grid xl:grid-cols-[1.5fr_1fr] gap-4">
   <div className="rounded-2xl border border-white/10 bg-[#101923] p-5"><h3 className="text-white font-medium mb-4">Pracovní oblasti</h3><div className="grid sm:grid-cols-2 gap-2">{LINKS.map(({label,tab,Icon,description})=><button key={tab} onClick={()=>navigate('/admin?tab='+tab)} className="flex gap-3 items-center text-left rounded-xl border border-white/10 bg-white/[.025] hover:bg-cyan/[.06] hover:border-cyan/25 p-3"><span className="p-2 rounded-lg bg-cyan/10 text-cyan"><Icon size={18}/></span><span className="flex-1 min-w-0"><span className="block text-sm font-medium text-white">{label}</span><span className="block text-xs text-white/40 mt-1">{description}</span></span><ArrowUpRight size={14} className="text-white/30"/></button>)}</div></div>
   <div className="rounded-2xl border border-white/10 bg-[#101923] p-5"><div className="flex items-center gap-2"><Bot className="text-cyan" size={20}/><h3 className="font-medium text-white">OpenAI a ChatGPT</h3></div><p className="mt-3 text-sm text-white/60">Stav registru poskytovatelů: <strong className="text-white">{failed.includes('AI')?'neověřeno':openaiStatus}</strong></p><p className="mt-3 text-xs leading-5 text-white/45">Přístup ChatGPT ke konektorům neznamená automaticky přístup webové aplikace Base44. Pro skutečné propojení je potřeba serverové API, bezpečně uložený klíč, oprávnění a audit operací.</p><button onClick={()=>navigate('/admin?tab=integrations')} className="mt-5 rounded-lg border border-cyan/30 text-cyan px-4 py-2 text-sm hover:bg-cyan/10">Zkontrolovat integrace</button></div>
  </div>
 </section>;
}
