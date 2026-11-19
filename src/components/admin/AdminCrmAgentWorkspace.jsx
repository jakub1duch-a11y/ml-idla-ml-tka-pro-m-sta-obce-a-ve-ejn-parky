import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowUpRight, CheckCircle2, FileCheck2, FolderOpen, GitBranch, Layers3, Mail, RefreshCw, ShieldCheck, Table2, Workflow } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SOURCES = [
  { key: 'hubspot', label: 'HubSpot', detail: 'Firemní CRM · portál 149778217', href: 'https://app-eu1.hubspot.com/contacts/149778217/objects/0-3', Icon: Layers3 },
  { key: 'sheets', label: 'Google Sheets', detail: 'Kontakty, příležitosti a nabídky', href: 'https://docs.google.com/spreadsheets/d/1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE/edit', Icon: Table2 },
  { key: 'gmail', label: 'Gmail', detail: 'meduna@holmtec.cz · pouze koncepty', href: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#drafts', Icon: Mail },
  { key: 'drive', label: 'Mlžný disk', detail: 'MASTER, ceny a schválené PDF', href: 'https://drive.google.com/drive/folders/1WdEakL7O80-ZEgx-9zqeF39HvsC-v3s3', Icon: FolderOpen },
];
const WORKFLOW = [
  'Webová poptávka',
  'Ověření zákazníka',
  'HubSpot Deal',
  'Produkt a MASTER',
  'Aktuální kalkulace',
  'Canva nabídka',
  'Gmail koncept',
  'Ruční schválení',
];

function Status({ active, pending = false }) {
  if (pending) return <span className="text-[11px] font-semibold text-slate-500">Neověřeno</span>;
  return active
    ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><CheckCircle2 size={14}/>Ověřeno</span>
    : <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700"><AlertTriangle size={14}/>Vyžaduje kontrolu</span>;
}

export default function AdminCrmAgentWorkspace() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const check = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const response = await base44.functions.invoke('crmIntegrationHealth', {});
      const data = response?.data || {};
      if (!data.ok) throw new Error(data.error || 'health_unavailable');
      setHealth(data);
    } catch {
      setError('Živá kontrola konektorů se nezdařila. Bez ověření portálu a identity účtů se žádná automatická synchronizace nesmí spouštět.');
      setHealth(null);
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { check(); }, [check]);

  return <section aria-labelledby="crm-agent-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="bg-[#102b3a] px-5 py-6 text-white sm:px-7 sm:py-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#85e1e9]">MLŽIDLA.cz / Agent & CRM</p>
          <h2 id="crm-agent-title" className="mt-2 flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl"><Workflow size={24} className="text-[#85e1e9]"/> Obchodní workflow a propojení</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">Jedna poptávka, jeden obchodní případ. Ověřené fotografie a ceny, nabídka podle značky a Gmail koncept před ručním schválením.</p>
        </div>
        <button type="button" disabled={busy} onClick={check} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#102b3a] hover:bg-[#e3f6f8] disabled:opacity-60"><RefreshCw size={16} className={busy ? 'animate-spin' : ''}/>Zkontrolovat propojení</button>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-200"><ShieldCheck size={16} className="text-[#85e1e9]"/> Pouze administrátor · bez automatického odesílání · ceny až po živém ověření</div>
    </div>
    <div className="p-4 sm:p-6">
      {error && <div role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error}</div>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SOURCES.map(({key,label,detail,href,Icon}) => {
          const current = health?.[key];
          const ready = key === 'sheets' ? current?.ready && current?.source_access : current?.ready;
          return <div key={key} className="rounded-xl border border-slate-200 bg-[#f7fbfc] p-4">
            <div className="flex items-start justify-between gap-2"><Icon size={19} className="text-[#008ea5]"/><Status active={ready} pending={!health}/></div>
            <p className="mt-3 font-semibold text-[#102b3a]">{label}</p>
            <p className="mt-1 min-h-9 text-xs leading-5 text-slate-600">{detail}</p>
            {health && key === 'hubspot' && current?.pipeline_verified && <p className="mt-1 text-xs text-slate-600">Pipeline: {current.stages} / 8 fází</p>}
            {health && !ready && current?.reason && <p className="mt-1 text-[11px] text-amber-800">{String(current.reason).slice(0,90)}</p>}
            <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#007b92] hover:underline">Otevřít <ArrowUpRight size={13}/></a>
          </div>;
        })}
      </div>
      <div className="mt-5 rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-semibold text-[#102b3a]"><FileCheck2 size={18} className="text-[#008ea5]"/> Postup AI nabídkového agenta</h3>
          <span className="text-xs text-slate-500">Kontrolované předání mezi systémy</span>
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW.map((step,index)=><li key={step} className="flex items-center gap-2 rounded-lg bg-[#f2f8fa] p-3 text-xs font-medium text-[#102b3a]"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d9eef1] font-bold text-[#007b92]">{index+1}</span>{step}</li>)}
        </ol>
        <p className="mt-3 text-xs leading-5 text-slate-600">HubSpot je zdrojem stavu příležitostí. Google Sheets eviduje kontakty; Base44 je zdrojem poptávky a geometrie produktu. Ceny se kontrolují v Kalkulaci mlžítka 2026. Canva pracuje s kopií schválené šablony. Odeslání nabídky vyžaduje ruční schválení a potvrzení v Gmail SENT.</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[#007b92]">
        <a href="https://app-eu1.hubspot.com/agent-hub/149778217/manage-agents/intro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline"><Workflow size={15}/> Agenti HubSpot <ArrowUpRight size={13}/></a>
        <a href="https://www.canva.com/brand/brand-templates/EAHZVIjydfU" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline"><FileCheck2 size={15}/> Šablona MLŽIDLA.cz <ArrowUpRight size={13}/></a>
        <a href="https://github.com/jakub1duch-a11y/ml-idla-ml-tka-pro-m-sta-obce-a-ve-ejn-parky" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline"><GitBranch size={15}/> Zdrojový kód <ArrowUpRight size={13}/></a>
      </div>
    </div>
  </section>;
}
