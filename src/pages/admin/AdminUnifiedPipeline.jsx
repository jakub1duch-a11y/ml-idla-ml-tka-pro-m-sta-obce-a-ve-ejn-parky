import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  ArrowUpRight, Bot, BriefcaseBusiness, CalendarDays, CheckCircle2,
  ChevronRight, CircleAlert, ClipboardList, Clock3, ExternalLink,
  FileSpreadsheet, Filter, LayoutGrid, List, Mail, Palette,
  Search, ShieldCheck, X,
} from 'lucide-react';
import {
  PIPELINE_CASES, PIPELINE_SHEET_URL, PIPELINE_SNAPSHOT_DATE, PIPELINE_STAGES,
} from '@/data/adminPipelineSnapshot';

const BRAND_NAMES = { mlzidla: 'MLŽIDLA.cz', holmtec: 'HolmTec' };
const BRAND_FILTERS = [
  { id: 'all', label: 'Obě značky' },
  { id: 'mlzidla', label: 'MLŽIDLA.cz' },
  { id: 'holmtec', label: 'HolmTec' },
];
const PIPELINE_SHEET_PREVIEW_URL = PIPELINE_SHEET_URL.replace('/edit#gid=', '/preview?gid=');
const AGENTS = [
  { title: 'Příjem poptávky', Icon: Mail, detail: 'Gmail → ověření firmy → kontrolní evidence BT', state: 'Scénář vytvořen, zatím neaktivní' },
  { title: 'Technické posouzení', Icon: BriefcaseBusiness, detail: 'HolmTec: výkresy, ohýbání a přípravky. MLŽIDLA: parametry, instalace a řízení.', state: 'Vyžaduje ověřené vstupy' },
  { title: 'Nabídka a dokumentace', Icon: Palette, detail: 'Schválená kalkulace → Canva A4 → PDF → koncept Gmail', state: 'Test koncového průchodu zbývá' },
  { title: 'Synchronizace agentů', Icon: Bot, detail: 'Make API pro čtení pipeline a dashboardu', state: 'API výstup vykazuje chybu; nepoužívat pro zápisy' },
];
const FORMAT_CZK = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 });
const normalize = (input) => String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const LIVE_STATUS = {
  draft: 'calculation',
  pending_approval: 'calculation',
  approved: 'offer',
  sent: 'offer',
  accepted: 'order',
  ordered: 'order',
  in_production: 'order',
  completed: 'order',
};
const CLOSED_STATUSES = new Set(['cancelled', 'canceled', 'rejected', 'archived', 'lost', 'completed']);
const isTestOrder = (order) => /\b(test|ghost test|duplicita|nepoužívat)\b/i.test(
  [order.project_name, order.client_company, order.production_notes?.slice(0, 150)].join(' ')
);
const validAmount = (value) => typeof value === 'number' && Number.isFinite(value) && value > 0;
function toLiveCase(order) {
  const state = String(order.status || '').toLowerCase();
  const accepted = ['accepted', 'ordered', 'in_production', 'completed'].includes(state);
  const total = validAmount(order.total_price) ? order.total_price : null;
  return {
    key: 'base44-' + order.id,
    bt: order.quote_number || 'Bez čísla CN',
    quote: order.quote_number || '',
    brand: 'mlzidla',
    customer: order.client_company || order.client_name || 'Neuvedený zákazník',
    project: order.project_name || 'Neupřesněný projekt',
    product: order.product_name || order.description?.slice(0, 90) || 'Mlžítko',
    stage: LIVE_STATUS[state] || 'inquiry',
    date: order.updated_date ? new Date(order.updated_date).toLocaleDateString('cs-CZ') : '—',
    nextStep: accepted ? 'Ověřit výrobní a dodací stav podle zakázky.' : 'Ověřit stav nabídky a další komunikaci.',
    note: 'Živá evidence Base44 (ProjectOrder). Celková hodnota nemá ve schématu jednoznačně doložený režim DPH. Finální smluvní cenu a její DPH potvrďte objednávkou.',
    source: 'live',
    amountUnclassified: total,
    finalPrice: null,
    offerPrice: null,
    basePrice: null,
    priceStatus: total == null ? 'Cena zatím neověřena' : (accepted ? 'Evidovaná částka objednávky – režim DPH ověřit' : 'Evidovaná částka – nepotvrzená finální cena'),
    orderUrl: order.quote_pdf_url || order.quote_drive_file_url || '',
    folderUrl: order.drive_case_folder_url || '',
    gmail: '',
  };
}


function StageLabel({ stage }) {
  const config = PIPELINE_STAGES.find((item) => item.id === stage);
  if (!config) return null;
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: config.accent }} />
      {config.label}
    </span>
  );
}

function BrandLabel({ brand }) {
  return (
    <span className={'inline-flex rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ' + (
      brand === 'mlzidla' ? 'bg-cyan-50 text-[#007e92]' : 'bg-slate-100 text-slate-600'
    )}>
      {BRAND_NAMES[brand] || brand}
    </span>
  );
}

function CaseCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={'Zobrazit detail zakázky ' + item.bt + ' – ' + item.customer}
      className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-[0_2px_12px_rgba(14,47,63,0.035)] transition hover:border-cyan-400 hover:shadow-[0_9px_30px_rgba(14,47,63,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-medium text-slate-500">{item.bt}</span>
        <ChevronRight size={15} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-cyan-700" />
      </div>
      <div className="text-[14px] font-semibold leading-5 text-[#142f3d]">{item.customer}</div>
      <p className="mt-1.5 min-h-9 text-xs leading-[1.5] text-slate-600">{item.product}</p>
      {item.finalPrice != null && <p className="mt-2 text-sm font-bold text-emerald-700">Finální: {FORMAT_CZK.format(item.finalPrice)}</p>}
      {item.amountUnclassified != null && <p className="mt-2 text-sm font-semibold tabular-nums text-[#152f3c]">{FORMAT_CZK.format(item.amountUnclassified)} <span className="text-[10px] font-normal text-slate-500">režim DPH neověřen</span></p>}
      {item.offerPrice != null && <p className="mt-2 text-sm font-bold tabular-nums text-[#152f3c]">{FORMAT_CZK.format(item.offerPrice)}</p>}
      {item.basePrice != null && <p className="mt-2 text-sm font-bold tabular-nums text-[#152f3c]">{FORMAT_CZK.format(item.basePrice)} <span className="text-[10px] font-normal text-slate-500">základ</span></p>}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <BrandLabel brand={item.brand} />
        <span className="text-[10px] text-slate-400">{item.date}</span>
      </div>
    </button>
  );
}

function CaseDetail({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;
  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-[#091923]/60 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label={'Zakázka ' + item.bt} className="flex h-full w-full max-w-[540px] flex-col overflow-y-auto bg-[#f7f9fa] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-7">
          <span className="text-xs font-semibold uppercase tracking-[.13em] text-slate-500">Detail obchodního případu</span>
          <button type="button" onClick={onClose} aria-label="Zavřít detail" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600"><X size={19} /></button>
        </div>
        <div className="space-y-5 p-5 md:p-7">
          <div className="rounded-2xl bg-[#102d3c] p-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm text-cyan-200">{item.bt}</span>
              <span className="text-xs text-white/50">· {BRAND_NAMES[item.brand]}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{item.customer}</h2>
            <p className="mt-2 text-sm text-white/70">{item.product}</p>
            <div className="mt-5"><StageLabel stage={item.stage} /></div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-bold text-[#142f3d]">Evidence případu</h3>
            <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-3 gap-y-3 text-sm">
              <dt className="text-slate-500">Projekt</dt><dd className="font-medium text-slate-800">{item.project || 'Neuvedeno'}</dd>
              <dt className="text-slate-500">BT</dt><dd className="font-medium text-slate-800">{item.bt}</dd>
              <dt className="text-slate-500">CN BT</dt><dd className="font-medium text-slate-800">{item.quote || 'Zatím nepřiřazeno'}</dd>
              <dt className="text-slate-500">Finální cena</dt><dd className="font-semibold">{item.finalPrice != null ? FORMAT_CZK.format(item.finalPrice) : 'Nepotvrzena'}</dd>
              <dt className="text-slate-500">Zdroj</dt><dd>{item.source === 'live' ? 'Base44 – aktuální záznam' : 'Google Sheets – snímek ' + PIPELINE_SNAPSHOT_DATE}</dd>
              <dt className="text-slate-500">Změna</dt><dd className="font-medium text-slate-800">{item.date}</dd>
              {(item.offerPrice != null || item.basePrice != null || item.amountUnclassified != null) && <>
                <dt className="text-slate-500">Cena nabídky</dt>
                <dd className="font-semibold text-slate-800">{item.offerPrice != null ? FORMAT_CZK.format(item.offerPrice) : '—'}<div className="mt-0.5 text-xs font-normal text-slate-500">{item.offerPriceNote || 'Není ověřena odeslaná cena'}</div></dd>
                {item.basePrice != null && <><dt className="text-slate-500">Pracovní základ</dt><dd>{FORMAT_CZK.format(item.basePrice)} <span className="text-xs text-slate-500">{item.basePriceNote}</span></dd></>}
                {item.amountUnclassified != null && <><dt className="text-slate-500">Částka Base44</dt><dd>{FORMAT_CZK.format(item.amountUnclassified)}<div className="text-xs font-normal text-amber-700">{item.priceStatus}</div></dd></>}
              </>}
            </dl>
          </div>

          <div className="rounded-2xl border border-[#c8e7ee] bg-[#effbfc] p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#0e6677]"><Clock3 size={17} /> Další krok</h3>
            <p className="mt-2 text-sm leading-6 text-[#234956]">{item.nextStep}</p>
          </div>

          {item.note && <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#142f3d]"><CircleAlert size={17} /> Kontrolní poznámka</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
          </div>}

          <div className="space-y-2">
            {item.gmail && <a href={item.gmail} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#102d3c] px-4 py-3 text-sm font-semibold text-white hover:bg-[#17495e]"><Mail size={17} /> Otevřít komunikaci v Gmailu <ArrowUpRight size={15} /></a>}
            {item.orderUrl && <a href={item.orderUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-cyan-300 bg-white px-4 py-3 text-sm font-semibold text-[#142f3d]"><FileSpreadsheet size={17} /> PDF nabídky <ArrowUpRight size={15} /></a>}
            {item.folderUrl && <a href={item.folderUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#142f3d]">Složka projektu <ArrowUpRight size={15} /></a>}
            <a href={PIPELINE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#142f3d] hover:border-cyan-400"><FileSpreadsheet size={17} /> Otevřít záznam v Google Sheets <ArrowUpRight size={15} /></a>
          </div>
          <p className="text-xs leading-5 text-slate-500">Historická BT evidence je pouze snímek k {PIPELINE_SNAPSHOT_DATE}; položky Base44 se načítají zvlášť. Zobrazení je pouze pro čtení.</p>
        </div>
      </section>
    </div>
  );
}

export default function AdminUnifiedPipeline() {
  const [brand, setBrand] = useState('all');
  const [view, setView] = useState('kanban');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [liveError, setLiveError] = useState('');
  const [liveLoading, setLiveLoading] = useState(true);
  useEffect(() => {
    let active = true;
    base44.entities.ProjectOrder.list('-updated_date', 250)
      .then((rows) => {
        if (!active) return;
        const unique = new Map();
        (Array.isArray(rows) ? rows : []).forEach((order) => {
          if (!order?.id || isTestOrder(order) || CLOSED_STATUSES.has(String(order.status || '').toLowerCase())) return;
          const key = order.quote_number || order.id;
          if (!unique.has(key)) unique.set(key, toLiveCase(order));
        });
        setLiveOrders(Array.from(unique.values()));
        setLiveError('');
      })
      .catch(() => { if (active) setLiveError('Živé záznamy Base44 nelze načíst. Zobrazen je pouze historický snímek.'); })
      .finally(() => { if (active) setLiveLoading(false); });
    return () => { active = false; };
  }, []);
  const allCases = useMemo(() => [...liveOrders, ...PIPELINE_CASES.map((item) => ({ ...item, source: 'snapshot' }))], [liveOrders]);

  const filtered = useMemo(() => allCases.filter((item) => {
    if (brand !== 'all' && item.brand !== brand) return false;
    const haystack = [item.bt, item.quote, item.customer, item.project, item.product, item.nextStep].join(' ');
    return normalize(haystack).includes(normalize(query.trim()));
  }), [allCases, brand, query]);

  const counters = useMemo(() => ({
    offer: filtered.filter((item) => item.stage === 'offer').length,
    cooperation: filtered.filter((item) => item.stage === 'cooperation').length,
    order: filtered.filter((item) => item.stage === 'order').length,
    confirmedOffers: filtered.filter((item) => item.offerPrice != null).reduce((sum, item) => sum + item.offerPrice, 0),
    finalPrices: filtered.filter((item) => item.finalPrice != null).reduce((sum, item) => sum + item.finalPrice, 0),
  }), [filtered]);

  return (
    <div className="min-h-screen bg-[#f5f7f9] pb-14 text-[#102d3c]" aria-label="Administrace obchodní pipeline">
      <header className="bg-[#102d3c] px-4 pb-8 pt-7 text-white md:px-7 md:pt-9">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[11px] font-semibold uppercase tracking-[.20em] text-[#7fd9ea]">Obchodní centrum / HolmTec × MLŽIDLA.cz</p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-[34px]">Obchodní pipeline</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Zakázky, nabídky, kooperace a objednávky přehledně na jednom místě.</p>
            </div>
            <a href={PIPELINE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20">
              <FileSpreadsheet size={18} /> Zdrojová tabulka <ExternalLink size={14} />
            </a>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { title: 'Aktivní případy', value: filtered.length, Icon: ClipboardList },
              { title: 'Doložené nabídky bez DPH', value: FORMAT_CZK.format(counters.confirmedOffers), Icon: CheckCircle2 },
              { title: 'Potvrzené finální ceny', value: counters.finalPrices ? FORMAT_CZK.format(counters.finalPrices) : '—', Icon: BriefcaseBusiness },
              { title: 'Objednávky', value: counters.order, Icon: CalendarDays },
            ].map(({ title, value, Icon }) => <div key={title} className="rounded-2xl border border-white/15 bg-white/[.065] px-4 py-4 md:px-5">
              <div className="flex items-center justify-between gap-3"><span className="text-xs text-white/65">{title}</span><Icon size={18} className="text-cyan-200/75" /></div>
              <p className="mt-2 text-xl font-semibold tabular-nums md:text-2xl">{value}</p>
            </div>)}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-5 px-4 pt-6 md:px-7">
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-[#fffbec] px-4 py-3 text-xs leading-5 text-[#7b6125]">
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <div><strong>Smíšené zdroje.</strong> {liveLoading ? 'Načítám živé případy Base44. ' : liveError || ('Načteno ' + liveOrders.length + ' projektů z Base44. ')} Historická BT evidence je snímek k {PIPELINE_SNAPSHOT_DATE} a není online synchronizovaná s Google Sheets. Ceny bez ověřené sazby DPH ani finální smluvní ceny se nezapočítávají jako potvrzené.</div>
        </div>

        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between" aria-label="Filtry pipeline">
          <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="Filtr značky">
            {BRAND_FILTERS.map((filter) => <button key={filter.id} type="button" onClick={() => setBrand(filter.id)} aria-pressed={brand === filter.id}
              className={'min-h-9 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600 ' + (brand === filter.id ? 'bg-white text-[#102d3c] shadow-sm' : 'text-slate-500 hover:text-slate-900')}>
              {filter.label}
            </button>)}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <label className="relative flex-1 lg:w-[290px]">
              <span className="sr-only">Hledat zakázku nebo zákazníka</span>
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hledat BT, zákazníka, produkt…" className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-[#102d3c] outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
            </label>
            <div className="inline-flex shrink-0 gap-1 rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label="Typ zobrazení">
              <button type="button" onClick={() => setView('kanban')} aria-pressed={view === 'kanban'} className={'inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold ' + (view === 'kanban' ? 'bg-[#102d3c] text-white' : 'text-slate-600 hover:bg-slate-100')}><LayoutGrid size={15} /> Kanban</button>
              <button type="button" onClick={() => setView('table')} aria-pressed={view === 'table'} className={'inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold ' + (view === 'table' ? 'bg-[#102d3c] text-white' : 'text-slate-600 hover:bg-slate-100')}><List size={15} /> Tabulka</button>
              <button type="button" onClick={() => setView('source')} aria-pressed={view === 'source'} className={'inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold ' + (view === 'source' ? 'bg-[#102d3c] text-white' : 'text-slate-600 hover:bg-slate-100')}><FileSpreadsheet size={15} /> Zdroj</button>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-semibold"><Filter size={17} className="text-[#007e92]" /> {view === 'kanban' ? 'Kanban zakázek' : view === 'table' ? 'Přehled zakázek' : 'Google Sheets – zdrojová evidence'}</h2>
          <span className="text-xs text-slate-500">{filtered.length} z {allCases.length} případů · {counters.offer} nabídek · {counters.cooperation} u kooperantů</span>
        </div>

        {view === 'kanban' && (
          <div className="-mx-4 overflow-x-auto px-4 pb-4 md:-mx-7 md:px-7">
            <div className="flex min-w-max items-start gap-3 xl:grid xl:min-w-0 xl:grid-cols-5">
              {PIPELINE_STAGES.map((stage) => {
                const stageCases = filtered.filter((item) => item.stage === stage.id);
                return <section key={stage.id} aria-label={stage.label} className="w-[258px] shrink-0 rounded-2xl border border-slate-200 bg-[#edf1f4] p-3 xl:w-auto xl:min-w-0">
                  <div className="mb-3 flex items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.accent }} /><h3 className="text-xs font-bold">{stage.label}</h3></div>
                    <span className="rounded-full border border-white bg-white px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-500">{stageCases.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageCases.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 px-3 py-8 text-center text-xs text-slate-400">Žádný případ</div> : stageCases.map((item) => <CaseCard key={item.key} item={item} onOpen={setSelected} />)}
                  </div>
                </section>;
              })}
            </div>
          </div>
        )}

        {view === 'table' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-[#eef3f6] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr><th className="px-4 py-4">Číslo BT</th><th className="px-4 py-4">Zákazník / produkt</th><th className="px-4 py-4">Značka</th><th className="px-4 py-4">Fáze</th><th className="px-4 py-4">Nabídka bez DPH</th><th className="px-4 py-4">Finální cena</th><th className="px-4 py-4">Fáze zdroje</th><th className="px-4 py-4">Detail</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => <tr key={item.key} className="hover:bg-cyan-50/40">
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-slate-700">{item.bt}</td>
                  <td className="px-4 py-4"><div className="font-semibold text-[#142f3d]">{item.customer}</div><div className="mt-1 text-xs text-slate-500">{item.product}</div></td>
                  <td className="px-4 py-4"><BrandLabel brand={item.brand} /></td>
                  <td className="px-4 py-4"><StageLabel stage={item.stage} /></td>
                  <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold tabular-nums text-slate-800">{item.offerPrice != null ? FORMAT_CZK.format(item.offerPrice) : item.basePrice != null ? FORMAT_CZK.format(item.basePrice) + ' *' : '—'}</td>
                  <td className="px-4 py-4 text-xs">{item.finalPrice != null ? FORMAT_CZK.format(item.finalPrice) : '—'}</td>
                  <td className="px-4 py-4 text-xs">{item.source === 'live' ? 'Base44 · živě' : 'BT · snímek'}</td>
                  <td className="px-4 py-4"><button type="button" onClick={() => setSelected(item)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#007e92] hover:bg-cyan-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600">Otevřít <ChevronRight size={14} /></button></td>
                </tr>)}
                {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-500">Pro zadané filtry nejsou žádné případy.</td></tr>}
              </tbody>
            </table>
            <p className="border-t border-slate-100 p-3 text-xs text-slate-500">* Pouze pracovní základ výrobků. Částky Base44 bez určeného režimu DPH jsou v detailu projektu; finální cena se uvádí až po ověření objednávky.</p>
          </div>
        )}

        {view === 'source' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-4">
              <h3 className="text-sm font-semibold text-[#142f3d]">Google Sheets – zdrojová evidence</h3>
              <a href={PIPELINE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007e92] hover:underline">
                Otevřít tabulku <ExternalLink size={13} />
              </a>
            </div>
            <iframe
              title="Zdrojová pipeline v Google Sheets"
              src={PIPELINE_SHEET_PREVIEW_URL}
              className="h-[540px] w-full bg-slate-50"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <p className="p-3 text-xs text-slate-500">Náhled může vyžadovat přihlášení. Přístupová práva tabulky se nemění.</p>
          </div>
        )}

        <section aria-labelledby="agents-heading" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Bot size={19} className="text-[#007e92]" />
            <h2 id="agents-heading" className="text-base font-semibold">Workflow a agenti</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {AGENTS.map(({ title, Icon, detail, state }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <Icon className="text-[#007e92]" size={20} />
                <h3 className="mt-2 text-sm font-semibold text-[#142f3d]">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">{detail}</p>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-amber-800">{state}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex items-start gap-2 rounded-xl border border-[#d8e6eb] bg-white p-4 text-xs leading-5 text-slate-500">
          <ShieldCheck size={18} className="shrink-0 text-[#007e92]" />
          <span>Přístup pouze pro správce Base44. Odkazy do Gmailu a Google Sheets respektují původní oprávnění. Žádné automatické odesílání zpráv, změny CRM nebo vytváření čísel zakázek.</span>
        </footer>
      </main>
      <CaseDetail item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}