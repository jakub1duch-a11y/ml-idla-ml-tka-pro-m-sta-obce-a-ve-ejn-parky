import React, { useState } from 'react';
import { ExternalLink, Workflow, Mail, FileSpreadsheet, Palette, ShieldCheck, AlertTriangle, LayoutDashboard, BriefcaseBusiness, Bot, RefreshCw } from 'lucide-react';

const BOOK = 'https://docs.google.com/spreadsheets/d/1zDl-j3xjKmAIvY3UmMq5D-SF2IkMUJznnuQhvgLRS_s/edit';
const VIEWS = [
  { id: 'pipeline', title: 'Pipeline projektů', gid: '2026112392', Icon: Workflow, detail: 'Fáze zakázky, odpovědnost, termíny, hodnota nabídky' },
  { id: 'dashboard', title: 'Obchodní dashboard', gid: '2026112393', Icon: LayoutDashboard, detail: 'Týdenní vývoj, fáze, hodnoty a úspěšnost' },
  { id: 'inbox', title: 'Kontrola Gmail → BT', gid: '2026112391', Icon: Mail, detail: 'Deduplikace, vazba na firmu, podklady a schválení' },
];
const AGENTS = [
  { title: 'Příjem poptávky', Icon: Mail, detail: 'Gmail → ověření firmy → kontrolní evidence BT', state: 'Scénář vytvořen, zatím neaktivní' },
  { title: 'Technické posouzení', Icon: BriefcaseBusiness, detail: 'HolmTec: výkresy, ohýbání a přípravky. MLŽIDLA: parametry, instalace a řízení.', state: 'Vyžaduje ověřené vstupy' },
  { title: 'Nabídka a dokumentace', Icon: Palette, detail: 'Schválená kalkulace → Canva A4 → PDF → koncept Gmail', state: 'Test koncového průchodu zbývá' },
  { title: 'Synchronizace agentů', Icon: Bot, detail: 'Make API pro čtení pipeline a dashboardu', state: 'API výstup vykazuje chybu; nepoužívat pro zápisy' },
];
export default function AdminUnifiedPipeline() {
  const [brand, setBrand] = useState('all');
  const [view, setView] = useState('pipeline');
  const active = VIEWS.find(item => item.id === view);
  const brandLabel = brand === 'all' ? 'Obě značky' : brand === 'holmtec' ? 'HolmTec' : 'MLŽIDLA.cz';
  return (
    <section className="min-h-screen bg-[#f4f7f9] text-[#102b3a] p-4 md:p-7" aria-label="Společná obchodní pipeline">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-2xl bg-[#102b3a] p-5 md:p-7 text-white">
          <p className="text-xs uppercase tracking-[.19em] text-cyan-300">HolmTec × MLŽIDLA.cz · interní obchodní centrum</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div><h1 className="text-2xl md:text-3xl font-semibold">Pipeline a obchodní přehled</h1><p className="mt-2 max-w-2xl text-sm text-white/65">Jedna evidence BT, dvě značky. Žádné automatické odesílání zákazníkům ani neověřené zápisy do CRM.</p></div>
            <a href={BOOK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-[#102b3a] hover:bg-cyan-400"><FileSpreadsheet size={17}/> Otevřít Google Sheets <ExternalLink size={14}/></a>
          </div>
        </header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap gap-2" role="group" aria-label="Značka">
            {[['all','Obě značky'],['holmtec','HolmTec'],['mlzidla','MLŽIDLA.cz']].map(([id,label])=><button key={id} type="button" onClick={()=>setBrand(id)} aria-pressed={brand===id} className={`rounded-lg px-4 py-2 text-sm font-medium border transition-colors ${brand===id?'bg-[#102b3a] text-white border-[#102b3a]':'bg-white border-slate-200 hover:border-cyan-500'}`}>{label}</button>)}
          </div>
          <span className="text-xs text-slate-500">Vybraná značka: {brandLabel}</span>
        </div>
        {brand !== 'all' && <div role="status" className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle size={18} className="shrink-0"/> Filtr značky je připraven v rozhraní, ale propojení s živými daty ještě není ověřené. Vložený Google Sheets zobrazuje obě značky. Pro aktuální filtrování použijte sloupec „Značka“ v tabulce.</div>}
        <div className="grid gap-3 md:grid-cols-3">{VIEWS.map(({id,title,gid,Icon,detail})=><button type="button" onClick={()=>setView(id)} key={id} aria-pressed={view===id} className={`rounded-xl border p-4 text-left transition-all ${view===id?'bg-cyan-50 border-cyan-500 shadow-sm':'bg-white border-slate-200 hover:border-cyan-300'}`}><Icon size={23} className="text-[#008fa1]"/><strong className="mt-2 block text-sm">{title}</strong><p className="mt-1 text-xs text-slate-500">{detail}</p></button>)}</div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-4"><h2 className="font-semibold">{active.title}</h2><a className="inline-flex items-center gap-1 text-sm text-[#007c90] hover:underline" href={BOOK+'#gid='+active.gid} target="_blank" rel="noopener noreferrer">Upravit v Google Sheets <ExternalLink size={14}/></a></div>
          <iframe title={active.title+' – Google Sheets'} src={BOOK.replace('/edit','/preview')+'?gid='+active.gid} className="h-[560px] w-full bg-slate-50" loading="lazy" referrerPolicy="no-referrer"/>
          <p className="px-4 py-3 text-xs text-slate-500">Pokud vložený náhled vyžaduje přihlášení nebo je blokovaný oprávněním, použijte odkaz „Upravit v Google Sheets“. Oprávnění tabulky se tím nemění.</p>
        </div>
        <section aria-labelledby="agents-heading" className="space-y-3"><div className="flex items-center gap-2"><Bot size={20}/><h2 id="agents-heading" className="text-lg font-semibold">Workflow a agenti</h2></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{AGENTS.map(({title,Icon,detail,state})=><article key={title} className="rounded-xl border border-slate-200 bg-white p-4"><Icon className="text-[#008fa1]" size={21}/><h3 className="mt-2 font-semibold text-sm">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-600">{detail}</p><p className="mt-3 border-t border-slate-100 pt-3 text-xs text-amber-800">{state}</p></article>)}</div></section>
        <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><ShieldCheck size={19} className="shrink-0 text-[#008fa1]"/><p>Pracovní verze v administraci. Změna fáze v tabulce se promítá do dashboardu; automatická obousměrná synchronizace Base44 ↔ Google Sheets ↔ HubSpot zatím není potvrzená. Bez schválení se nic neodesílá ani nepřepisuje.</p></div>
      </div>
    </section>
  );
}
