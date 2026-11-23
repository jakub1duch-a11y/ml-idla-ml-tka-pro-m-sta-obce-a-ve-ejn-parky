import React, { useMemo, useState } from 'react';
import { ExternalLink, Workflow, Mail, FileSpreadsheet, Palette, ShieldCheck, AlertTriangle, LayoutDashboard, BriefcaseBusiness, Bot, Search, Table2, Columns3, FileText, X } from 'lucide-react';

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
// Ověřené snapshotové stavy z centrální tabulky 0_BT_Poptavky / PIPELINE_PROJEKTY (23. 11. 2026).
// Data nejsou online napojená: změny provádějte ve zdrojové tabulce, nikoliv v tomto přehledu.
const SNAPSHOT = [
  { bt:'BT260 889', customer:'DŘEVOSLAV', brand:'mlzidla', product:'MRAK 1414', stage:'sent', amount:49500, evidence:'1a208a4ae8c62276' },
  { bt:'BT260 890', customer:'ENVY SPORT SERVIS', brand:'mlzidla', product:'Suchdol · 3× LINEA Ø70', stage:'estimate', amount:53650, preliminary:true, evidence:'1a209d1460821629' },
  { bt:'BT260 875', customer:'INVEKTA', brand:'holmtec', product:'KOLO Ø470 · 10 ks', stage:'sent', evidence:'1a208a252109deb8' },
  { bt:'BT260 876_877', customer:'SICO / Trelleborg', brand:'holmtec', product:'Výroba trnů · 2 + 2 ks', stage:'sent', evidence:'1a1f9648017b47f1' },
  { bt:'BT260 878', customer:'SICO / Trelleborg', brand:'holmtec', product:'Dva rovné nerezové trny', stage:'sent', evidence:'1a1f9475a8d2dc6f' },
  { bt:'BT260 887', customer:'REV IT CZECH', brand:'holmtec', product:'Rám buggy · CNC ohýbání', stage:'cooperation', evidence:'1a1fdb96b684a695' },
  { bt:'BT260 884_886', customer:'Technické posouzení', brand:'holmtec', product:'TR26,9×3,2 · 20/50/100 ks', stage:'cooperation', evidence:'1a207e8599ab1bea' },
  { bt:'BT260 880_883', customer:'Ohýbaná madla', brand:'holmtec', product:'TR30×2 · pravá / levá', stage:'cooperation', evidence:'1a1f8648a92b44fd' },
  { bt:'100-262685', customer:'MICO', brand:'holmtec', product:'Potvrzená objednávka · čeká na materiál', stage:'ordered', evidence:'1a208d2a297ef84d' },
  { bt:'NOBJ016621', customer:'European Data Industries', brand:'holmtec', product:'Čeká na termín dodání', stage:'ordered', evidence:'1a20832415c20107' },
];
const PHASES = [
  { id:'new', label:'Nové poptávky', dot:'bg-slate-400' },
  { id:'estimate', label:'Kalkulace', dot:'bg-amber-500' },
  { id:'sent', label:'Nabídka odeslána', dot:'bg-sky-500' },
  { id:'cooperation', label:'Kooperace', dot:'bg-violet-500' },
  { id:'ordered', label:'Objednávky', dot:'bg-emerald-500' },
];
const fmt = value => typeof value === 'number' ? new Intl.NumberFormat('cs-CZ').format(value) + ' Kč' : '—';
const gmailUrl = id => `https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/${encodeURIComponent(id)}`;

function ProjectCard({record, onSelect}) {
  return <button type="button" onClick={() => onSelect(record)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-cyan-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500">
    <span className="font-mono text-[10px] text-slate-500">{record.bt}</span>
    <strong className="mt-1 block text-sm text-[#102b3a]">{record.customer}</strong>
    <span className="mt-1 block text-xs leading-5 text-slate-600">{record.product}</span>
    <span className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]"><span className="text-slate-500">{record.brand === 'holmtec' ? 'HolmTec' : 'MLŽIDLA.cz'}</span>{record.amount && <strong className="text-[#087789]">{fmt(record.amount)}{record.preliminary ? ' *' : ''}</strong>}</span>
  </button>;
}

export default function AdminUnifiedPipeline() {
  const [brand, setBrand] = useState('all');
  const [view, setView] = useState('kanban');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => SNAPSHOT.filter(r => (brand === 'all' || r.brand === brand) && `${r.bt} ${r.customer} ${r.product}`.toLocaleLowerCase('cs').includes(query.toLocaleLowerCase('cs'))), [brand, query]);
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
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['Aktivní případy', filtered.length],
            ['Odeslané nabídky', filtered.filter(r=>r.stage==='sent').length],
            ['U kooperantů', filtered.filter(r=>r.stage==='cooperation').length],
            ['Objednávky', filtered.filter(r=>r.stage==='ordered').length],
          ].map(([label,count])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold tabular-nums">{count}</p></div>)}
        </div>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="relative min-w-0 flex-1 sm:max-w-sm"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Hledat zakázky" placeholder="Hledat firmu, číslo BT, produkt…" className="w-full rounded-xl border border-slate-200 bg-white px-9 py-3 text-sm outline-offset-2 focus:border-cyan-500"/></div>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label="Zobrazení pipeline">
            {[{id:'kanban',label:'Kanban',Icon:Columns3},{id:'table',label:'Tabulka',Icon:Table2},{id:'source',label:'Zdroj',Icon:FileSpreadsheet}].map(({id,label,Icon})=><button type="button" key={id} aria-pressed={view===id} onClick={()=>setView(id)} className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold ${view===id ? 'bg-[#102b3a] text-white' : 'text-slate-600 hover:bg-slate-50'}`}><Icon size={15}/>{label}</button>)}
          </div>
        </div>
        <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><AlertTriangle size={15} className="mr-1 inline"/> Ověřený výřez evidence k 23. 11. 2026, nikoli živá synchronizace. Změny stavu se upravují v Google tabulce. Rozpor v odeslání Suchdolu vyžaduje dohledání e-mailu. Ceny s * označují pouze schválený základ.</div>
        {view === 'kanban' && <div className="-mx-1 overflow-x-auto pb-3"><div className="flex min-w-max gap-3 px-1" aria-label="Kanban zakázek">
          {PHASES.map(phase=>{const items=filtered.filter(r=>r.stage===phase.id);return <section key={phase.id} className="w-[220px] shrink-0 rounded-2xl border border-slate-200 bg-slate-100/70 p-3" aria-label={phase.label}><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xs font-semibold"><span className={`h-2 w-2 rounded-full ${phase.dot}`}/>{phase.label}</h2><span className="text-xs text-slate-500">{items.length}</span></div><div className="space-y-2">{items.map(r=><ProjectCard key={r.bt} record={r} onSelect={setSelected}/>)}{!items.length&&<p className="py-5 text-center text-xs text-slate-400">Bez záznamů</p>}</div></section>;})}
        </div></div>}
        {view === 'table' && <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="min-w-[720px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Číslo / BT','Zákazník','Produkt / případ','Značka','Fáze','Cena bez DPH','Doklad'].map(h=><th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(r=><tr key={r.bt} className="hover:bg-slate-50"><td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{r.bt}</td><td className="px-4 py-3 font-semibold">{r.customer}</td><td className="px-4 py-3">{r.product}</td><td className="px-4 py-3">{r.brand==='holmtec'?'HolmTec':'MLŽIDLA.cz'}</td><td className="px-4 py-3">{PHASES.find(p=>p.id===r.stage)?.label}</td><td className="px-4 py-3 whitespace-nowrap">{fmt(r.amount)}{r.preliminary?' *':''}</td><td className="px-4 py-3"><a href={gmailUrl(r.evidence)} target="_blank" rel="noopener noreferrer" className="text-cyan-700 underline">Gmail</a></td></tr>)}</tbody></table></div>}
        {view === 'source' && <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between gap-2 p-4"><h2 className="font-semibold">Google Sheets – zdrojová evidence</h2><a href={BOOK+'#gid=2026112392'} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-700 underline">Otevřít tabulku <ExternalLink size={12} className="inline"/></a></div><iframe title="Zdrojová pipeline v Google Sheets" src={BOOK.replace('/edit','/preview')+'?gid=2026112392'} className="h-[540px] w-full bg-slate-50" loading="lazy" referrerPolicy="no-referrer"/><p className="p-3 text-xs text-slate-500">Náhled může vyžadovat přihlášení. Přístupová práva tabulky se nemění.</p></div>}
        {selected&&<div role="presentation" className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={()=>setSelected(null)}><aside role="dialog" aria-modal="true" aria-label="Detail zakázky" onClick={e=>e.stopPropagation()} className="h-full w-full max-w-md overflow-auto bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs text-slate-500">{selected.bt}</p><h2 className="mt-1 text-xl font-semibold">{selected.customer}</h2></div><button type="button" aria-label="Zavřít detail" onClick={()=>setSelected(null)} className="rounded-lg p-2 hover:bg-slate-100"><X size={20}/></button></div><p className="mt-6 text-sm">{selected.product}</p><dl className="mt-5 space-y-3 text-sm"><div><dt className="text-slate-500">Značka</dt><dd>{selected.brand==='holmtec'?'HolmTec':'MLŽIDLA.cz'}</dd></div><div><dt className="text-slate-500">Fáze</dt><dd>{PHASES.find(p=>p.id===selected.stage)?.label}</dd></div><div><dt className="text-slate-500">Cena bez DPH</dt><dd>{fmt(selected.amount)}{selected.preliminary?' · pouze schválený základ':''}</dd></div></dl><a className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#102b3a] px-4 py-3 text-sm font-semibold text-white" href={gmailUrl(selected.evidence)} target="_blank" rel="noopener noreferrer"><Mail size={16}/> Otevřít Gmail <ExternalLink size={14}/></a></aside></div>}
        <section aria-labelledby="agents-heading" className="space-y-3"><div className="flex items-center gap-2"><Bot size={20}/><h2 id="agents-heading" className="text-lg font-semibold">Workflow a agenti</h2></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{AGENTS.map(({title,Icon,detail,state})=><article key={title} className="rounded-xl border border-slate-200 bg-white p-4"><Icon className="text-[#008fa1]" size={21}/><h3 className="mt-2 font-semibold text-sm">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-600">{detail}</p><p className="mt-3 border-t border-slate-100 pt-3 text-xs text-amber-800">{state}</p></article>)}</div></section>
        <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><ShieldCheck size={19} className="shrink-0 text-[#008fa1]"/><p>Pracovní verze v administraci. Změna fáze v tabulce se promítá do dashboardu; automatická obousměrná synchronizace Base44 ↔ Google Sheets ↔ HubSpot zatím není potvrzená. Bez schválení se nic neodesílá ani nepřepisuje.</p></div>
      </div>
    </section>
  );
}
